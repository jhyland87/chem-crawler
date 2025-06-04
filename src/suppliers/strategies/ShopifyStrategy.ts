import { parseQuantity } from "@/helpers/quantity";
import { firstMap } from "@/helpers/utils";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { isShopifyVariant, isValidSearchResponse } from "@/utils/typeGuards/shopify";
import { WRatio } from "fuzzball";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Abstract base strategy for Shopify-based suppliers.
 * Provides common functionality for interacting with Shopify's search API.
 *
 * @remarks
 * This strategy uses the Searchanise API endpoint at searchserverapi.com, which is commonly
 * used by Shopify stores for their search functionality. The API provides comprehensive
 * product data including variants, pricing, and inventory information.
 *
 * Each supplier only needs to specify:
 * 1. Their unique API key
 * 2. Their base URL
 * 3. Their display name
 *
 * @see https://searchserverapi.com/getresults?api_key=8B7o0X1o7c&q=acid&maxResults=3
 */
export abstract class ShopifyStrategy implements SupplierStrategy<globalThis.Product> {
  protected readonly logger: Logger;
  protected readonly httpClient: HttpClient;
  protected readonly apiKey: string;
  protected readonly apiHost: string = "searchserverapi.com";

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
   * Query products from the Shopify search API.
   * Makes a GET request to the Searchanise API endpoint.
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
      const url = new URL("/getresults", `https://${this.apiHost}`);
      url.searchParams.append("api_key", this.apiKey);
      url.searchParams.append("q", query);
      url.searchParams.append("maxResults", "200");
      url.searchParams.append("startIndex", "0");
      url.searchParams.append("items", "true");
      url.searchParams.append("pageStartIndex", "0");
      url.searchParams.append("pagesMaxResults", "1");
      url.searchParams.append("vendorsMaxResults", "200");
      url.searchParams.append("output", "json");
      url.searchParams.append("_", new Date().getTime().toString());

      const searchRequest = await this.httpClient.getJson<SearchResponse>(url.toString());

      if (!isValidSearchResponse(searchRequest)) {
        this.logger.error("Invalid search response:", searchRequest);
        return;
      }

      if (!("items" in searchRequest) || !Array.isArray(searchRequest.items)) {
        this.logger.error("Invalid search response items:", searchRequest);
        return;
      }

      if (searchRequest.items.length === 0) {
        this.logger.info("No items found in search response");
        return;
      }

      const validItems = searchRequest.items.filter(
        (item): item is globalThis.ItemListing => item !== null,
      );
      const fuzzFiltered = this.fuzzyFilter(query, validItems);
      this.logger.info("fuzzFiltered:", fuzzFiltered);

      return this.initProductBuilders(fuzzFiltered.slice(0, limit));
    } catch (error) {
      this.logger.error("Error querying products:", error);
      return;
    }
  }

  /**
   * Get additional product data from the Shopify API.
   * For Shopify stores using Searchanise, we already have all the product data from the search results.
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
   * Initialize product builders from Shopify search response data.
   * Transforms Shopify product listings into ProductBuilder instances.
   *
   * @param results - Array of Shopify item listings from search results
   * @returns Array of ProductBuilder instances initialized with Shopify product data
   */
  protected initProductBuilders(
    results: globalThis.ItemListing[],
  ): ProductBuilder<globalThis.Product>[] {
    return results
      .map((item) => {
        const builder = new ProductBuilder<globalThis.Product>(this.baseURL);
        builder
          .setBasicInfo(item.title, item.link, this.supplierName)
          .setPricing(parseFloat(item.price), "USD", "$")
          .setDescription(item.description)
          .setSku(item.product_code)
          .setVendor(item.vendor);

        const quantity = firstMap(parseQuantity, [
          item.product_code,
          item.quantity,
          item.title,
          item.description,
        ]);

        if (!quantity) {
          this.logger.warn("Failed to get quantity from retrieved product data:", item);
          return;
        }

        builder.setQuantity(quantity.quantity, quantity.uom);

        if ("shopify_variants" in item && Array.isArray(item.shopify_variants)) {
          item.shopify_variants.forEach((variant) => {
            if (!isShopifyVariant(variant)) return;

            const variantQuantity = firstMap(parseQuantity, [
              variant.sku,
              (variant?.options?.Model as string) ?? "",
            ]);

            builder.addVariant({
              id: variant.variant_id,
              sku: variant.sku,
              price: variant.price,
              title: (variant?.options?.Model as string) ?? "",
              url: variant.link,
              ...variantQuantity,
            });
          });
        }

        return builder;
      })
      .filter((builder): builder is ProductBuilder<globalThis.Product> => builder !== undefined);
  }

  /**
   * Fuzzy filter search results to improve relevance.
   * Uses string similarity to rank and filter results.
   *
   * @param query - Search term to filter against
   * @param results - Array of search results to filter
   * @returns Filtered and sorted array of search results
   */
  protected fuzzyFilter<T extends { title: string }>(query: string, results: T[]): T[] {
    return results
      .map((item) => ({
        item,
        score: WRatio(query.toLowerCase(), item.title.toLowerCase()),
      }))
      .filter(({ score }) => score > 50)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }
}
