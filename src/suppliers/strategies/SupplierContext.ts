import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Context class that uses a supplier strategy to perform operations.
 * This class acts as a wrapper around the strategy, providing a consistent interface
 * for working with different supplier implementations.
 */
export class SupplierContext<T extends globalThis.Product> {
  private readonly logger: Logger;
  private readonly strategy: SupplierStrategy<T>;
  private readonly baseURL: string;
  private readonly headers: HeadersInit;
  private readonly httpClient: HttpClient;

  constructor(strategy: SupplierStrategy<T>, baseURL: string, headers: HeadersInit = {}) {
    this.logger = new Logger("SupplierContext");
    this.strategy = strategy;
    this.baseURL = baseURL;
    this.headers = headers;
    this.httpClient = new HttpClient(headers);
  }

  /**
   * Query products using the current strategy.
   * @param query - The search term to query products for
   * @param limit - Maximum number of results to return
   * @returns Promise resolving to array of product builders or void if search fails
   */
  public async queryProducts(query: string, limit: number): Promise<ProductBuilder<T>[] | void> {
    return this.strategy.queryProducts(query, limit, this.baseURL, this.httpClient);
  }

  /**
   * Get detailed product data using the current strategy.
   * @param builder - The ProductBuilder instance to enrich with details
   * @returns Promise resolving to the enriched ProductBuilder or void if fetch fails
   */
  public async getProductData(builder: ProductBuilder<T>): Promise<ProductBuilder<T> | void> {
    return this.strategy.getProductData(builder, this.baseURL, this.httpClient);
  }

  /**
   * Get the cache key for a product query.
   * @param query - The search query
   * @param params - Optional parameters to include in cache key
   * @returns Cache key string
   */
  public getQueryCacheKey(query: string, params?: Record<string, string>): string {
    const key = `${this.strategy.constructor.name}:query:${query}`;
    if (params) {
      return `${key}:${JSON.stringify(params)}`;
    }
    return key;
  }

  /**
   * Get the cache key for product details.
   * @param url - Product URL
   * @param params - Optional parameters to include in cache key
   * @returns Cache key string
   */
  public getProductDataCacheKey(url: string, params?: Record<string, string>): string {
    const key = `${this.strategy.constructor.name}:product:${url}`;
    if (params) {
      return `${key}:${JSON.stringify(params)}`;
    }
    return key;
  }
}
