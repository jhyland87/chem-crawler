import { FetchDecoratorResponse } from "@/helpers/fetch";
import { isHttpResponse, isJsonResponse } from "@/utils/typeGuards/common";

/**
 * Type guard to check if a response contains JSON data.
 * @param response - The fetch decorator response to check
 * @returns True if the response contains JSON data
 */
export function isJsonDecoratorResponse<T>(
  response: FetchDecoratorResponse,
): response is FetchDecoratorResponse & { data: T } {
  return isJsonResponse(response) && typeof response.data === "object";
}

/**
 * Type guard to check if a response contains text/HTML data.
 * @param response - The fetch decorator response to check
 * @returns True if the response contains text data
 */
export function isTextDecoratorResponse(
  response: FetchDecoratorResponse,
): response is FetchDecoratorResponse & { data: string } {
  return isHttpResponse(response) && typeof response.data === "string";
}

/**
 * Type guard to check if a response contains blob data.
 * @param response - The fetch decorator response to check
 * @returns True if the response contains blob data
 */
export function isBlobDecoratorResponse(
  response: FetchDecoratorResponse,
): response is FetchDecoratorResponse & { data: Blob } {
  return response.data instanceof Blob;
}
