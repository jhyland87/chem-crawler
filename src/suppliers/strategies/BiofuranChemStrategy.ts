import { WixStrategy } from "./WixStrategy";

/**
 * Strategy implementation for BiofuranChem supplier.
 * Uses Wix's GraphQL API for product queries and data extraction.
 *
 * @remarks
 * BiofuranChem is a US-based chemical supplier using the Wix ecommerce platform.
 * The website is https://www.biofurancherm.com/
 */
export class BiofuranChemStrategy extends WixStrategy {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://www.biofurancherm.com";

  /** Display name of the supplier */
  public readonly supplierName = "BiofuranChem";
}
