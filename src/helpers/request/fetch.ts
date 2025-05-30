import { getRequestHash } from "../request";
import { getResponseStorageConfig } from "./config";

/**
 * Response type that extends the standard Response with additional properties
 * for data and request hash tracking.
 */
export type FetchDecoratorResponse = Response & { data: unknown; _requestHash: string };

/**
 * Generates a simple hash from a string using the djb2 algorithm.
 * This is a non-cryptographic hash function suitable for request identification.
 *
 * @param str - The string to hash
 * @returns A hexadecimal string representing the hash
 * @example
 * ```typescript
 * const hash = generateSimpleHash("test string");
 * console.log(hash); // "a5d7d2a9"
 * ```
 */
export function generateSimpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Generates a unique hash for a request based on its URL, method, headers, and body.
 * This hash can be used to identify and track unique requests.
 *
 * @param input - The request URL or Request object
 * @param options - Optional request configuration
 * @returns A promise that resolves to a unique hash string
 * @example
 * ```typescript
 * // With URL string
 * const hash1 = await generateRequestHash("https://api.example.com/data", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ name: "test" })
 * });
 *
 * // With Request object
 * const request = new Request("https://api.example.com/data", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ name: "test" })
 * });
 * const hash2 = await generateRequestHash(request);
 * ```
 */
export async function generateRequestHash(
  input: RequestInfo | URL,
  options?: RequestInit,
): Promise<string> {
  const url = input instanceof Request ? input.url : input.toString();
  const method = input instanceof Request ? input.method : options?.method || "GET";
  const headers = input instanceof Request ? input.headers : options?.headers || {};
  const body = input instanceof Request ? input.body : options?.body || "";
  const contentType =
    input instanceof Request
      ? input.headers.get("content-type") || ""
      : (headers as Record<string, string>)?.["content-type"] || "";

  const data = {
    url,
    method,
    headers,
    body,
    contentType,
  };

  const dataString = JSON.stringify(data);
  return generateSimpleHash(dataString);
}

/**
 * Stores a response in chrome.storage.local
 * @param requestHash - The hash of the request
 * @param response - The response to store
 */
async function storeResponse(
  requestHash: string,
  response: FetchDecoratorResponse,
  requestUrl: string,
): Promise<void> {
  const config = getResponseStorageConfig();
  if (!config?.storeResponses) return;

  const storageKey = config.storageKeyPrefix
    ? `${config.storageKeyPrefix}_${requestHash}`
    : `response_${requestHash}`;

  const responseData = {
    url: requestUrl,
    hash: requestHash,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    data: response.data,
    timestamp: Date.now(),
  };

  await chrome.storage.local.set({ [storageKey]: responseData });
}

/**
 * A decorator function that wraps the native fetch API with additional features:
 * - Automatic response parsing based on content type
 * - Request hash generation for tracking
 * - Error handling
 * - Response cloning to prevent body stream consumption
 * - Optional response storage in chrome.storage.local (controlled by global config)
 *
 * @param input - The request URL or Request object
 * @param init - Optional request configuration
 * @returns A promise that resolves to a FetchDecoratorResponse
 * @throws Error if the response is not ok (status not in 200-299 range)
 * @example
 * ```typescript
 * // Basic GET request
 * const response = await fetchDecorator("https://api.example.com/data");
 * console.log(response.data); // Parsed response data
 * console.log(response._requestHash); // Unique request hash
 *
 * // POST request with JSON body
 * const response = await fetchDecorator("https://api.example.com/data", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ name: "test" })
 * });
 *
 * // Using Request object
 * const request = new Request("https://api.example.com/data", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ name: "test" })
 * });
 * const response = await fetchDecorator(request);
 * ```
 */
export async function fetchDecorator(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<FetchDecoratorResponse> {
  const requestHash = await generateRequestHash(input, init);
  let requestUrl: string = "";
  if (typeof input === "string") {
    requestUrl = input;
  } else if (input instanceof Request) {
    requestUrl = input.url;
  } else if (input instanceof URL) {
    requestUrl = input.href;
  }
  // If input is a Request, use getRequestHash to get the hash and url (guaranteed accurate)
  if (input instanceof Request) {
    const hashObj = getRequestHash(input);
    requestUrl = hashObj.url.href;
  }
  console.log(`Request Hash: ${requestHash}`);
  console.log(`Request URL for storage: ${requestUrl}`);

  const response = await fetch(input, init);
  const _response = response.clone();

  if (!response.ok) {
    throw new Error(`HTTP Error: ${_response.status} ${_response.statusText}`);
  }

  const contentType = _response.headers.get("content-type") || "";
  let data: unknown;

  if (contentType.includes("application/json")) {
    data = await _response.json();
  } else if (contentType.includes("text/")) {
    data = await _response.text();
  } else {
    data = await _response.blob();
  }

  // Create a new Response object that inherits all prototype methods
  const enhancedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  // Add our custom properties
  Object.defineProperties(enhancedResponse, {
    data: { value: data },
    _requestHash: { value: requestHash },
  });

  // Store response if enabled in global config, always using requestUrl
  await storeResponse(requestHash, enhancedResponse as FetchDecoratorResponse, requestUrl);

  return enhancedResponse as FetchDecoratorResponse;
}
