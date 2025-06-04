import { ShopifyStrategy } from "../ShopifyStrategy";

/**
 * Mock Shopify strategy for testing the base ShopifyStrategy implementation.
 * Uses a test API key and inherits all functionality from ShopifyStrategy.
 */
export class MockShopifyStrategy extends ShopifyStrategy {
  /** Base URL for the mock supplier's website */
  public readonly baseURL = "https://mock-shopify-supplier.com";

  /** Display name of the mock supplier */
  public readonly supplierName = "MockShopify";

  constructor() {
    // Test API key
    super("test_api_key_123");
  }
}
