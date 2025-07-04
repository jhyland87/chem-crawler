import SupplierBaseShopify from "./SupplierBaseShopify";

/**
 * SupplierLaballey class that extends SupplierBaseShopify and implements AsyncIterable<T>.
 *
 * @category Suppliers
 */
export default class SupplierLaballey extends SupplierBaseShopify implements ISupplier {
  // Name of supplier (for display purposes)
  public readonly supplierName: string = "Laballey";

  // Base URL for HTTP(s) requests
  public readonly baseURL: string = "https://www.laballey.com";

  // Shipping scope for Laballey
  public readonly shipping: ShippingRange = "international";

  // The country code of the supplier.
  public readonly country: CountryCode = "US";

  // API key for Typesense search API
  protected apiKey: string = "8B7o0X1o7c";

  // The payment methods accepted by the supplier.
  public readonly paymentMethods: PaymentMethod[] = ["mastercard", "visa"];
}
