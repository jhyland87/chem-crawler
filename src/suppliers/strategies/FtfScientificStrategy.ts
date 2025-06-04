import { WixStrategy } from "./WixStrategy";

/**
 * Strategy implementation for FTF Scientific supplier.
 * Uses Wix's GraphQL API for product queries and data extraction.
 *
 * @remarks
 * FTF Scientific is a US-based chemical supplier using the Wix ecommerce platform.
 * The website is https://www.ftfscientific.com/
 */
export class FtfScientificStrategy extends WixStrategy {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://www.ftfscientific.com";

  /** Display name of the supplier */
  public readonly supplierName = "FTF Scientific";
}
