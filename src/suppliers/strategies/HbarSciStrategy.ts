import ProductBuilder from "@/utils/ProductBuilder";
import { isValidSearchResponse } from "@/utils/typeGuards/shopify";
import { ShopifyStrategy } from "./ShopifyStrategy";

/**
 * Strategy implementation for HbarSci supplier.
 * Uses Shopify's Searchanise API for product queries and data extraction.
 *
 * @remarks
 * HbarSci is a US-based chemical supplier using Shopify.
 * The website is https://www.hbarsci.com/
 *
 * The supplier uses Searchanise API for product search with the following parameters:
 * - tab: "products" - Filters results to only show products
 * - filter: "Chemicals" - Further filters to only show chemical products
 */
export class HbarSciStrategy extends ShopifyStrategy {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://www.hbarsci.com";

  /** Display name of the supplier */
  public readonly supplierName = "HbarSci";

  constructor() {
    // HbarSci's Searchanise API key
    super("2H3i9C5v0m");
  }

  /**
   * Query products from the Shopify search API with HbarSci-specific filters.
   * Makes a GET request to the Searchanise API endpoint.
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
      // Add HbarSci-specific filters
      url.searchParams.append("tab", "products");
      url.searchParams.append("filter", "Chemicals");

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
}
