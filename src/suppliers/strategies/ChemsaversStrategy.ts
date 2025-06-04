import { isCAS } from "@/helpers/cas";
import { parseQuantity } from "@/helpers/quantity";
import { mapDefined } from "@/helpers/utils";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { isValidSearchResponse } from "@/utils/typeGuards/chemsavers";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Strategy implementation for Chemsavers supplier.
 * Handles product queries and data extraction using their Typesense search API.
 */
export class ChemsaversStrategy implements SupplierStrategy<globalThis.Product> {
  private readonly logger: Logger;
  public readonly baseURL: string = "https://www.chemsavers.com";
  private readonly apiURL: string = "0ul35zwtpkx14ifhp-1.a1.typesense.net";
  private readonly apiKey: string = "iPltuzpMbSZEuxT0fjPI0Ct9R1UBETTd";

  constructor() {
    this.logger = new Logger("ChemsaversStrategy");
  }

  /**
   * Creates the request body for the Typesense search API.
   */
  private makeRequestBody(query: string, limit: number): object {
    return {
      searches: [
        {
          query_by: "name, CAS, sku",
          highlight_full_fields: "name, CAS, sku",
          collection: "products",
          q: query,
          page: 0,
          per_page: limit,
        },
      ],
    };
  }

  /**
   * Query products from Chemsavers' Typesense search API
   */
  public async queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product>[] | void> {
    try {
      const body = this.makeRequestBody(query, limit);

      const response = await httpClient.getJson<unknown>(`https://${this.apiURL}/multi_search`, {
        "x-typesense-api-key": this.apiKey,
        "content-type": "text/plain",
      });

      if (!isValidSearchResponse(response)) {
        this.logger.warn("Bad search response:", response);
        return;
      }

      const products = mapDefined(response.results[0].hits.flat(), (hit: unknown) => {
        if (
          typeof hit !== "object" ||
          hit === null ||
          "document" in hit === false ||
          typeof hit.document !== "object"
        )
          return;
        return hit.document as ProductObject;
      });

      this.logger.debug("Mapped response objects:", products);

      // Initialize product builders from filtered results
      return this.initProductBuilders(products.slice(0, limit));
    } catch (error) {
      this.logger.error("Error querying products:", error);
      return;
    }
  }

  /**
   * Initialize product builders from Chemsavers search response data
   */
  private initProductBuilders(data: ProductObject[]): ProductBuilder<globalThis.Product>[] {
    return mapDefined(data, (result) => {
      const builder = new ProductBuilder(this.baseURL);

      const quantity = parseQuantity(result.name);
      if (quantity === undefined) return;

      builder
        .setBasicInfo(result.name, result.url, "Chemsavers")
        .setDescription(result.description)
        .setId(result.id)
        .setSku(result.sku)
        .setPricing(result.price, "USD", "$")
        .setQuantity(quantity.quantity, quantity.uom)
        .setCAS(isCAS(result.CAS) ? result.CAS : "");
      return builder;
    });
  }

  /**
   * Get detailed product data from Chemsavers
   * Since Chemsavers includes all product data in search results,
   * we can just return the product builder directly
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product> | void> {
    return builder;
  }
}
