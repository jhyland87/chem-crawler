import { WooCommerceStrategy } from "./WooCommerceStrategy";

/**
 * Strategy implementation for Liberty Scientific supplier.
 * Uses WooCommerce's REST API for product queries and data extraction.
 *
 * @remarks
 * Liberty Scientific is a US-based chemical supplier using the WooCommerce platform.
 * The website is https://www.libertyscientific.com/
 */
export class LibertySciStrategy extends WooCommerceStrategy {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://www.libertyscientific.com";

  /** Display name of the supplier */
  public readonly supplierName = "Liberty Scientific";

  constructor() {
    // TODO: Get API key from environment or configuration
    super("wc_key_123456789");
  }
}
