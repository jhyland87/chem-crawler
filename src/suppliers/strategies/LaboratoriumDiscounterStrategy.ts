import { AVAILABILITY } from "@/constants/common";
import { findCAS } from "@/helpers/cas";
import { urlencode } from "@/helpers/request";
import { mapDefined } from "@/helpers/utils";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import {
  isProductObject,
  isSearchResponseOk,
  isValidSearchParams,
} from "@/utils/typeGuards/laboratoriumdiscounter";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Strategy implementation for LaboratoriumDiscounter supplier.
 * Handles product queries and data extraction using their JSON-based API.
 */
export class LaboratoriumDiscounterStrategy implements SupplierStrategy<globalThis.Product> {
  private readonly logger: Logger;
  public readonly baseURL: string = "https://www.laboratoriumdiscounter.nl";

  constructor() {
    this.logger = new Logger("LaboratoriumDiscounterStrategy");
  }

  /**
   * Constructs the query parameters for a product search request
   */
  private makeQueryParams(limit: number): LaboratoriumDiscounterSearchParams {
    return {
      limit: limit.toString(),
      format: "json",
    };
  }

  /**
   * Query products from LaboratoriumDiscounter's JSON API
   */
  public async queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product>[] | void> {
    const params = this.makeQueryParams(limit);
    if (!isValidSearchParams(params)) {
      this.logger.warn("Invalid search parameters:", params);
      return;
    }

    const response = await httpClient.getJson<unknown>(`${baseURL}/en/search/${urlencode(query)}`);

    if (!isSearchResponseOk(response)) {
      this.logger.warn("Bad search response:", response);
      return;
    }

    const rawSearchResults = Object.values(response.collection.products);
    return this.initProductBuilders(rawSearchResults.slice(0, limit));
  }

  /**
   * Initialize product builders from search response data
   */
  private initProductBuilders(
    data: LaboratoriumDiscounterSearchResponseProduct[],
  ): ProductBuilder<globalThis.Product>[] {
    return mapDefined(data, (product) => {
      const productBuilder = new ProductBuilder(this.baseURL);
      productBuilder
        .setBasicInfo(product.title, product.url, "LaboratoriumDiscounter")
        .setDescription(product.description)
        .setId(product.id)
        .setAvailability(product.available)
        .setSku(product.sku)
        .setUUID(product.code)
        .setQuantity(product.variant)
        .setCAS(typeof product.content === "string" ? (findCAS(product.content) ?? "") : "");
      return productBuilder;
    });
  }

  /**
   * Get detailed product data from LaboratoriumDiscounter's JSON API
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product> | void> {
    const productResponse = await httpClient.getJson<unknown>(`${baseURL}${builder.get("url")}`);

    if (!productResponse || !isProductObject(productResponse)) {
      this.logger.warn("Invalid product data - did not pass typeguard:", productResponse);
      return builder;
    }

    const productData = productResponse.product;
    const currency = productResponse.shop.currencies[productResponse.shop.currency];
    builder.setPricing(productData.price.price, currency.code, currency.symbol);

    if (typeof productData.variants === "object" && productData.variants !== null) {
      for (const variant of Object.values(productData.variants) as VariantObject[]) {
        if (variant.active === false) continue;
        builder.addVariant({
          id: variant.id,
          uuid: variant.code,
          sku: variant.sku,
          title: variant.title,
          price: variant.price.price,
          availability: variant.stock
            ? typeof variant.stock === "object"
              ? ((stock) => {
                  if (stock.available) return AVAILABILITY.IN_STOCK;
                  if (stock.on_stock) return AVAILABILITY.IN_STOCK;
                  if (stock.allow_backorders) return AVAILABILITY.BACKORDER;
                  return AVAILABILITY.OUT_OF_STOCK;
                })(variant.stock)
              : undefined
            : undefined,
        });
      }
    }
    return builder;
  }
}
