import { findCAS } from "@/helpers/cas";
import { parseQuantity } from "@/helpers/quantity";
import { firstMap } from "@/helpers/utils";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { isSearchResponse } from "@/utils/typeGuards/woocommerce";
import { WRatio } from "fuzzball";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Abstract base strategy for WooCommerce-based suppliers.
 * Provides common functionality for interacting with WooCommerce's REST API.
 *
 * @remarks
 * WooCommerce has two versions of API endpoints for products:
 * - V1: `/wp-json/wc/v1` and `/wp-json/wc/store/v1/products`
 * - V2: `/wp-json/wp/v2` and `/wp-json/wp/v2/product`
 *
 * This strategy uses the V1 endpoints as they provide more complete product data,
 * including variations and pricing information.
 *
 * @see https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/StoreApi/docs/products.md
 */
export abstract class WooCommerceStrategy implements SupplierStrategy<globalThis.Product> {
  protected readonly logger: Logger;
  protected readonly httpClient: HttpClient;
  protected readonly apiKey: string;

  constructor(apiKey: string) {
    this.logger = new Logger(this.constructor.name);
    this.httpClient = new HttpClient();
    this.apiKey = apiKey;
  }

  /** Base URL for the supplier's website */
  public abstract readonly baseURL: string;

  /** Display name of the supplier */
  public abstract readonly supplierName: string;

  /**
   * Query products from the WooCommerce API.
   * Makes a GET request to the WooCommerce Store API v1 products endpoint.
   *
   * @param query - Search term to filter products
   * @param limit - Maximum number of results to return
   * @returns Promise resolving to an array of ProductBuilder instances or undefined if the request fails
   */
  public async queryProducts(
    query: string,
    limit: number = 5,
  ): Promise<ProductBuilder<globalThis.Product>[] | undefined> {
    try {
      const url = new URL("/wp-json/wc/store/v1/products", this.baseURL);
      url.searchParams.append("search", query);
      url.searchParams.append("per_page", "100");

      const searchRequest = await this.httpClient.getJson<WooCommerceSearchResponseItem[]>(
        url.toString(),
        {
          Authorization: `Basic ${this.apiKey}`,
        },
      );

      if (!isSearchResponse(searchRequest)) {
        this.logger.error("Invalid search response:", searchRequest);
        return;
      }

      const results = searchRequest;
      const fuzzFiltered = this.fuzzyFilter(query, results);
      this.logger.info("fuzzFiltered:", fuzzFiltered);

      return this.initProductBuilders(fuzzFiltered.slice(0, limit));
    } catch (error) {
      this.logger.error("Error querying products:", error);
      return;
    }
  }

  /**
   * Get additional product data from the WooCommerce API.
   * For WooCommerce stores, we already have all the product data from the search results.
   *
   * @param builder - ProductBuilder instance to enhance with additional data
   * @returns Promise resolving to the enhanced ProductBuilder or undefined if the request fails
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
  ): Promise<ProductBuilder<globalThis.Product> | undefined> {
    return builder;
  }

  /**
   * Initialize product builders from WooCommerce search response data.
   * Transforms WooCommerce product data into ProductBuilder instances.
   *
   * @param results - Array of WooCommerce search response items
   * @returns Array of ProductBuilder instances initialized with WooCommerce product data
   */
  protected initProductBuilders(
    results: WooCommerceSearchResponseItem[],
  ): ProductBuilder<globalThis.Product>[] {
    return results.map((item) => {
      const builder = new ProductBuilder<globalThis.Product>(this.baseURL);

      builder
        .setBasicInfo(item.name, item.permalink, this.supplierName)
        .setId(item.id)
        .setSku(item.sku)
        .setPricing(
          Number(item.prices.price) / 100,
          item.prices.currency_code,
          item.prices.currency_symbol,
        );

      const cas = firstMap(findCAS, [item.description, item.short_description]);
      if (cas) builder.setCAS(cas);

      const toParseForQuantity = [item.name, item.description, item.short_description];

      if ("variations" in item) {
        const variations = item.variations.map((variation) => {
          const variant: Partial<Variant> = {
            id: variation.id,
          };

          if (Array.isArray(variation.attributes)) {
            const size = variation.attributes.find(
              (attribute) => attribute.name.toLowerCase() === "size",
            );
            if (size?.value) {
              toParseForQuantity.push(size.value);
              const variantQty = parseQuantity(size.value);

              if (variantQty) {
                variant.quantity = variantQty.quantity;
                variant.uom = variantQty.uom;
              }
            }
          }

          return variant;
        });

        if (variations.length > 0) {
          builder.addVariants(variations);
        }
      }

      const quantity = firstMap(parseQuantity, toParseForQuantity);
      if (quantity) {
        builder.setQuantity(quantity.quantity, quantity.uom);
      }

      this.logger.debug("initProductBuilder product:", builder.dump());

      return builder;
    });
  }

  /**
   * Fuzzy filter search results to improve relevance.
   * Uses string similarity to rank and filter results.
   *
   * @param query - Search term to filter against
   * @param results - Array of search results to filter
   * @returns Filtered and sorted array of search results
   */
  protected fuzzyFilter<T extends { name: string }>(query: string, results: T[]): T[] {
    return results
      .map((item) => ({
        item,
        score: WRatio(query.toLowerCase(), item.name.toLowerCase()),
      }))
      .filter(({ score }) => score > 50)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }
}
