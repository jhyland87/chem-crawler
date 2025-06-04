import Logger from "@/utils/Logger";

/**
 * Utility class for making HTTP requests.
 * Provides common functionality for making HTTP requests with consistent headers and error handling.
 */
export class HttpClient {
  private readonly logger: Logger;
  private readonly defaultHeaders: HeadersInit;

  constructor(defaultHeaders: HeadersInit = {}) {
    this.logger = new Logger("HttpClient");
    this.defaultHeaders = {
      Accept: "text/html,application/json",
      "User-Agent": "ChemCrawler/1.0",
      ...defaultHeaders,
    };
  }

  /**
   * Make an HTTP GET request and parse the response as JSON.
   * @param url - The URL to request
   * @param headers - Additional headers to include in the request
   * @returns Promise resolving to the parsed JSON response
   * @throws Error if the request fails or response is not OK
   */
  public async getJson<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Makes a GET request and returns the response as HTML text.
   * @param url - The URL to request
   * @param params - Query parameters to include in the URL
   * @param headers - Additional headers to include in the request
   * @returns Promise resolving to the HTML response text
   */
  public async getHtml(
    url: string,
    params: Record<string, string> = {},
    headers: HeadersInit = {},
  ): Promise<string> {
    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });

    const response = await fetch(urlObj.toString(), {
      method: "GET",
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
  }
}
