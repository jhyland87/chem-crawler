import { parseQuantity } from "@/helpers/quantity";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { isMacklinProductDetails, isMacklinSearchResult } from "@/utils/typeGuards/macklin";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Strategy for Macklin supplier using their JSON API and custom token/signature logic.
 */
export class MacklinStrategy implements SupplierStrategy<globalThis.Product> {
  public readonly baseURL = "https://www.macklin.cn";
  public readonly supplierName = "Macklin";
  private readonly logger = new Logger("MacklinStrategy");
  private setupPromise: Promise<void> | null = null;
  private timestamp: string | null = null;
  private deviceId: string | null = null;
  private userToken: string | null = null;
  private lastSignature: string | null = null;
  private readonly SALT = "ndksyr9834@#$32ndsfu";

  /**
   * Ensure setup is called only once before any API request.
   */
  private async setup(): Promise<void> {
    if (this.setupPromise) return this.setupPromise;
    this.setupPromise = (async () => {
      // Fetch timestamp from /api/timestamp
      const url = new URL("/api/timestamp", this.baseURL);
      const response = await fetch(url.toString());
      const data = await response.json();
      this.timestamp = String(data?.data?.timestamp ?? Date.now());
      // Generate deviceId and userToken if not present
      this.deviceId = this.deviceId || this.generateString(16);
      this.userToken = this.userToken || "";
    })();
    return this.setupPromise;
  }

  /**
   * Query products from Macklin's search API.
   */
  public async queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product>[] | undefined> {
    await this.setup();
    const url = new URL("/api/item/search", baseURL);
    url.searchParams.append("q", query);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("lang", "en");
    url.searchParams.append("currency", "USD");
    url.searchParams.append("sort", "relevance");
    // Add timestamp and signature headers
    const headers = this.makeHeaders();
    const response = await fetch(url.toString(), { headers });
    const json = await response.json();
    if (!isMacklinSearchResult(json)) {
      this.logger.error("Invalid Macklin search response", json);
      return;
    }
    const products = json.list;
    if (!Array.isArray(products) || products.length === 0) {
      this.logger.info("No products found for query", query);
      return;
    }
    return this.initProductBuilders(products.slice(0, limit));
  }

  /**
   * Get detailed product data from Macklin's product details API.
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product> | undefined> {
    await this.setup();
    const sku = builder.get("sku");
    if (!sku) return builder;
    const url = new URL(`/api/product/list`, baseURL);
    url.searchParams.append("code", sku);
    url.searchParams.append("lang", "en");
    url.searchParams.append("currency", "USD");
    const headers = this.makeHeaders();
    const response = await fetch(url.toString(), { headers });
    const json = await response.json();
    if (!isMacklinProductDetails(json)) {
      this.logger.warn("Invalid Macklin product details response", json);
      return builder;
    }
    // Optionally, set more details on builder here
    return builder;
  }

  /**
   * Initialize product builders from Macklin search results.
   */
  protected initProductBuilders(products: any[]): ProductBuilder<globalThis.Product>[] {
    return products.map((item) => {
      const builder = new ProductBuilder<globalThis.Product>(this.baseURL);
      builder
        .setBasicInfo(item.item_en_name, `/product/${item.product_id}`, this.supplierName)
        .setSku(item.item_code)
        .setPricing(parseFloat(item.product_price), "USD", "$")
        .setDescription(item.product_pack)
        .setQuantity(
          parseQuantity(item.product_pack)?.quantity ?? 1,
          parseQuantity(item.product_pack)?.uom ?? "ea",
        );
      if (item.chem_cas) builder.setCAS(item.chem_cas);
      return builder;
    });
  }

  /**
   * Generate headers for Macklin API requests, including signature and timestamp.
   */
  private makeHeaders(): Record<string, string> {
    // This is a simplified version; in production, you should generate the signature as in SupplierMacklin.ts
    return {
      "X-Agent": "web",
      "X-User-Token": this.userToken || "",
      "X-Device-Id": this.deviceId || "",
      "X-Language": "en",
      "X-Timestamp": this.timestamp || String(Date.now()),
      // 'sign': this.signRequest(...),
    };
  }

  /**
   * Generate a random string for device ID.
   */
  private generateString(length: number): string {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }
}
