import { HttpClient } from "@/utils/HttpClient";
import ProductBuilder from "@/utils/ProductBuilder";

/**
 * Interface defining the contract for supplier strategies.
 * Each strategy implements specific logic for querying products and getting product details.
 */
export interface SupplierStrategy<T extends globalThis.Product> {
  /**
   * The base URL for the supplier's website/API.
   * This is used to construct full URLs for requests.
   */
  readonly baseURL: string;

  /**
   * Query products from the supplier's API or website.
   * @param query - The search term to query products for
   * @param limit - Maximum number of results to return
   * @param baseURL - Base URL for the supplier
   * @param httpClient - HTTP client for making requests
   * @returns Promise resolving to array of product builders or void if search fails
   */
  queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<T>[] | void>;

  /**
   * Get detailed product data for a specific product.
   * @param builder - The ProductBuilder instance to enrich with details
   * @param baseURL - Base URL for the supplier
   * @param httpClient - HTTP client for making requests
   * @returns Promise resolving to the enriched ProductBuilder or void if fetch fails
   */
  getProductData(
    builder: ProductBuilder<T>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<T> | void>;
}
