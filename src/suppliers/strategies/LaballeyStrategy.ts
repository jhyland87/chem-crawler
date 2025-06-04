import { ShopifyStrategy } from "./ShopifyStrategy";

/**
 * Strategy implementation for Laballey supplier.
 * Uses Shopify's Searchanise API for product queries and data extraction.
 *
 * @remarks
 * Laballey is a US-based chemical supplier using the Shopify platform.
 * The website is https://www.laballey.com/
 *
 * The supplier uses Searchanise for their search functionality, which provides
 * comprehensive product data including variants, pricing, and inventory information.
 */
export class LaballeyStrategy extends ShopifyStrategy {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://www.laballey.com";

  /** Display name of the supplier */
  public readonly supplierName = "Laballey";

  constructor() {
    // Laballey's Searchanise API key
    super("8B7o0X1o7c");
  }
}
