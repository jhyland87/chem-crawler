/**
 * Global configuration for response storage
 */
export interface ResponseStorageConfig {
  /** Whether to store responses in chrome.storage.local */
  storeResponses: boolean;
  /** Optional prefix for storage keys */
  storageKeyPrefix?: string;
}

// Declare the global window interface extension
declare global {
  interface Window {
    responseStorageConfig?: ResponseStorageConfig;
  }
}

/**
 * Sets the global response storage configuration
 * @param config - The configuration to set
 * @example
 * ```typescript
 * // Enable response storage
 * setResponseStorageConfig({ storeResponses: true });
 *
 * // Enable with prefix
 * setResponseStorageConfig({
 *   storeResponses: true,
 *   storageKeyPrefix: "api_responses"
 * });
 *
 * // Disable response storage
 * setResponseStorageConfig({ storeResponses: false });
 * ```
 */
export function setResponseStorageConfig(config: ResponseStorageConfig): void {
  window.responseStorageConfig = config;
}

/**
 * Gets the current response storage configuration
 * @returns The current configuration or undefined if not set
 */
export function getResponseStorageConfig(): ResponseStorageConfig | undefined {
  return window.responseStorageConfig;
}
