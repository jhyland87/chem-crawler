import { fetchDecorator } from "@/helpers/fetch";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { extract, WRatio } from "fuzzball";
import { SupplierStrategy } from "./SupplierStrategy";
import { isJsonDecoratorResponse, isTextDecoratorResponse } from "./typeGuards";

/**
 * Base class for supplier strategies that implements common functionality.
 * Provides default implementations for caching and HTTP requests.
 */
export abstract class BaseStrategy<X, T extends globalThis.Product> implements SupplierStrategy<T> {
  protected logger: Logger;
  public abstract readonly baseURL: string;
  protected abstract titleSelector(choice: X): string;

  constructor(supplierName: string) {
    this.logger = new Logger(supplierName);
  }

  /**
   * Get the cache key for a product query.
   * Default implementation combines query and supplier name.
   */
  public getQueryCacheKey(
    query: string,
    supplierName: string,
    params?: Record<string, string>,
  ): string {
    const key = `${supplierName}:query:${query}`;
    if (params) {
      return `${key}:${JSON.stringify(params)}`;
    }
    return key;
  }

  /**
   * Get the cache key for product details.
   * Default implementation combines URL and supplier name.
   */
  public getProductDataCacheKey(
    url: string,
    supplierName: string,
    params?: Record<string, string>,
  ): string {
    const key = `${supplierName}:product:${url}`;
    if (params) {
      return `${key}:${JSON.stringify(params)}`;
    }
    return key;
  }

  /**
   * Make an HTTP GET request and parse the response as JSON.
   * @param url - Full URL to request
   * @param headers - HTTP headers to include
   * @returns Promise resolving to parsed JSON response
   */
  protected async httpGetJson<R>(url: string, headers: HeadersInit = {}): Promise<R | void> {
    const response = await fetchDecorator(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });

    if (isJsonDecoratorResponse<R>(response)) {
      return response.data;
    }
    this.logger.warn("Expected JSON response but got different content type");
    return undefined;
  }

  /**
   * Make an HTTP GET request and return the response as text.
   * @param url - Full URL to request
   * @param headers - HTTP headers to include
   * @returns Promise resolving to response text
   */
  protected async httpGetHtml(url: string, headers: HeadersInit = {}): Promise<string | void> {
    const response = await fetchDecorator(url, {
      method: "GET",
      headers: {
        Accept: "text/html",
        ...headers,
      },
    });

    if (isTextDecoratorResponse(response)) {
      return response.data;
    }
    this.logger.warn("Expected text/HTML response but got different content type");
    return undefined;
  }

  /**
   * Abstract method that must be implemented by concrete strategies to query products.
   */
  public abstract queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<T>[] | void>;

  /**
   * Abstract method that must be implemented by concrete strategies to get product details.
   */
  public abstract getProductData(
    builder: ProductBuilder<T>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<T> | void>;

  /**
   * Fuzzy filter search results to improve relevance.
   * Uses string similarity to rank and filter results.
   *
   * @param query - Search term to filter against
   * @param results - Array of search results to filter
   * @returns Filtered and sorted array of search results
   */
  protected fuzzyFilter(query: string, data: X[], cutoff: number = 40): X[] {
    const res = extract(query, data, {
      scorer: WRatio,
      processor: this.titleSelector as (choice: X) => string,
      cutoff: cutoff,
      sortBySimilarity: true,
    }).reduce(
      (acc, [obj, score, idx]) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acc[idx] = Object.assign(obj, { ___fuzz: { score, idx } });
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      [] as Array<X & { ___fuzz: { score: number; idx: number } }>,
    ) as X[];

    this.logger.debug("fuzzed search results:", res);

    // Get rid of any empty items that didn't match closely enough
    return res.filter((item) => !!item);
  }
}
