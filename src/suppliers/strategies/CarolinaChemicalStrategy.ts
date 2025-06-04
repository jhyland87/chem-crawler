import { WooCommerceStrategy } from "./WooCommerceStrategy";

/**
 * Strategy implementation for Carolina Chemical supplier.
 * Uses WooCommerce's REST API for product queries and data extraction.
 *
 * @remarks
 * Carolina Chemical is a US-based chemical supplier using the WooCommerce platform.
 * The website is https://www.carolinachemical.com/
 */
export class CarolinaChemicalStrategy extends WooCommerceStrategy {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://www.carolinachemical.com";

  /** Display name of the supplier */
  public readonly supplierName = "Carolina Chemical";

  constructor() {
    // TODO: Get API key from environment or configuration
    super("wc_key_123456789");
  }
}
