import { findCAS } from "@/helpers/cas";
import { parsePrice } from "@/helpers/currency";
import { parseQuantity } from "@/helpers/quantity";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { isSearchResultItem } from "@/utils/typeGuards/onyxmet";
import { WRatio } from "fuzzball";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Strategy implementation for Onyxmet supplier.
 * Handles product searching and data extraction from Onyxmet's website.
 *
 * @remarks
 * Onyxmet is a Canadian chemical supplier that uses a custom search API.
 * The website is https://onyxmet.com/
 */
export class OnyxmetStrategy implements SupplierStrategy<globalThis.Product> {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://onyxmet.com";

  /** Display name of the supplier */
  public readonly supplierName = "Onyxmet";

  /** Logger instance for this strategy */
  private readonly logger = new Logger("OnyxmetStrategy");

  /**
   * Query products from Onyxmet's search API.
   * Makes a GET request to the search endpoint and parses the JSON response.
   */
  public async queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product>[] | void> {
    this.logger.debug("Querying products:", query);

    const searchUrl = new URL("index.php", baseURL);
    searchUrl.searchParams.append("term", query);
    searchUrl.searchParams.append("route", "product/search/json");

    const searchResponse = await httpClient.getHtml(searchUrl.toString());

    if (!searchResponse) {
      this.logger.error("No search response");
      return;
    }

    const data = JSON.parse(searchResponse);
    this.logger.debug("Search results:", data);

    // Filter results using fuzzy matching
    const fuzzResults = this.fuzzyFilter(query, data);
    return this.initProductBuilders(fuzzResults.slice(0, limit));
  }

  /**
   * Get detailed product data from Onyxmet's product page.
   * Fetches the product page HTML and extracts additional information.
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product> | void> {
    this.logger.debug("Getting product data for:", builder.get("url"));

    const productUrl = new URL(builder.get("url"), baseURL);
    const productResponse = await httpClient.getHtml(productUrl.toString());

    if (!productResponse) {
      this.logger.warn("No product response");
      return;
    }

    const parser = new DOMParser();
    const parsedHTML = parser.parseFromString(productResponse, "text/html");
    const content = parsedHTML.querySelector("#content");

    if (!content) {
      this.logger.warn("No content for product");
      return;
    }

    // Extract product information from the page
    const productData = Array.from(content.querySelectorAll(".desc"))
      .find((element: Element) => element.textContent?.includes("Availability"))
      ?.closest("ul")
      ?.querySelectorAll("li");

    const productInfo = Array.from(productData || []).reduce(
      (acc, element) => {
        const [key, value] = element.textContent?.split(": ") || [];
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const cas = findCAS(builder.get("description"));
    const title = content?.querySelector("h3.product-title")?.textContent?.trim() || "";
    const statusTxt = productInfo.Availability || "";
    const productPrice = content.querySelector(".product-price")?.textContent?.trim() || "";

    const price = parsePrice(productPrice);
    if (!price) {
      this.logger.warn("No price for product");
      return;
    }

    const quantity = parseQuantity(title);
    if (!quantity) {
      this.logger.warn("No quantity for product");
      return;
    }

    return builder
      .setPricing(price.price, price.currencyCode, price.currencySymbol)
      .setQuantity(quantity.quantity, quantity.uom)
      .setCAS(cas ?? "")
      .setAvailability(statusTxt ?? "");
  }

  /**
   * Initialize product builders from search results.
   * Transforms raw search results into ProductBuilder instances.
   */
  private initProductBuilders(data: any[]): ProductBuilder<globalThis.Product>[] {
    return data
      .map((item) => {
        if (!isSearchResultItem(item)) {
          this.logger.warn("Invalid search result item:", item);
          return;
        }

        const builder = new ProductBuilder<globalThis.Product>(this.baseURL);
        builder
          .setBasicInfo(item.label, item.href, this.supplierName)
          .setDescription(item.description);

        return builder;
      })
      .filter((builder): builder is ProductBuilder<globalThis.Product> => builder !== undefined);
  }

  /**
   * Filter search results using fuzzy matching.
   * Uses WRatio from fuzzball to find the best matches for the query.
   */
  private fuzzyFilter(query: string, data: any[]): any[] {
    return data
      .map((item) => {
        if (!isSearchResultItem(item)) return null;
        const score = WRatio(query.toLowerCase(), item.label.toLowerCase());
        return { item, score };
      })
      .filter((result): result is { item: any; score: number } => result !== null)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.item);
  }
}
