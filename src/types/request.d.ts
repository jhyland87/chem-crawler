declare global {
  /**
   * Represents a serialized response from a supplier with content type and optional content.
   * This type is used to standardize the format of responses across different supplier implementations.
   */
  interface SerializedResponse {
    /** The MIME type of the content (e.g., 'application/json', 'text/html') */
    contentType: string;
    /** The serialized content of the response. Optional as some responses may not have content. */
    content?: string;
  }

  /**
   * Represents a request object with associated hash and file information.
   * This type is used to track and manage requests with their corresponding file data.
   */
  interface RequestHashObject {
    /**
     * The unique hash identifier for the request
     * This is generated by the getRequestHash function which takes some unique identifying
     * attributes of the request (method, path, search params and body) and returns an md5sum
     * of them.
     */
    hash: string;
    /** The file path associated with the request */
    file: string;
    /** The URL object representing the request endpoint */
    url: URL;
  }

  /**
   * Just an object with both of the above
   */
  interface CacheResponse {
    hash: RequestHashObject;
    data: SerializedResponse;
  }

  /**
   * Represents the options for a request.
   * This type is used to standardize the format of request options across different supplier implementations.
   */
  interface RequestOptions {
    path: string | URL;
    host?: string | undefined;
    body?: object | string;
    params?: Maybe<RequestParams>;
    headers?: Maybe<Record<string, string | number | boolean>>;
  }

  /**
   * @description Type for request parameters.
   * @example
   * ```typescript
   * const params: RequestParams = {
   *   limit: 10,
   *   offset: 0,
   *   sort: "name",
   *   filter: "category:chemicals",
   * };
   * ```
   */
  interface RequestParams extends Record<string, unknown> {
    [key: string]: unknown;
  }
}

// This export is needed to make the file a module
export {};
