import { type Product } from "@/types";
import SupplierBaseWoocommerce from "./supplierBaseWoocommerce";

/**
 * Supplier class for Carolina Chemical, a chemical supplier using the WooCommerce platform.
 * Implements product fetching and parsing functionality specific to Carolina Chemical's website.
 *
 * @example
 * ```typescript
 * const supplier = new SupplierCarolinaChemical();
 *
 * // Iterate over all products
 * for await (const product of supplier) {
 *   console.log(product.name, product.cas, product.price);
 * }
 *
 * // Search for specific products
 * const products = await supplier.search("acetone");
 * console.log(`Found ${products.length} products`);
 * ```
 *
 * @see https://www.carolinachemical.com/
 * @see https://carolinachemical.com/wp-json/wc/store/v1/products
 */
export default class SupplierCarolinaChemical
  extends SupplierBaseWoocommerce
  implements AsyncIterable<Product>
{
  /**
   * The display name of the supplier.
   * Used for identifying the supplier in product listings and user interfaces.
   *
   * @example
   * ```typescript
   * const supplier = new SupplierCarolinaChemical();
   * console.log(`Products from ${supplier.supplierName}`);
   * // Output: "Products from Carolina Chemical"
   * ```
   */
  public readonly supplierName: string = "Carolina Chemical";

  /**
   * The base URL for the supplier's website.
   * Used as the root URL for all HTTP requests to the supplier's API.
   *
   * @example
   * ```typescript
   * class CustomCarolinaChemical extends SupplierCarolinaChemical {
   *   constructor() {
   *     super();
   *     // Use staging environment
   *     this._baseURL = "https://staging.carolinachemical.com";
   *   }
   * }
   * ```
   */
  protected _baseURL: string = "https://carolinachemical.com";
}
