import { findCAS } from "@/helpers/cas";
import { parsePrice } from "@/helpers/currency";
import { parseQuantity } from "@/helpers/quantity";
import { mapDefined } from "@/helpers/utils";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { extract, WRatio } from "fuzzball";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Strategy implementation for Loudwolf supplier.
 * Handles product queries and data extraction using HTML parsing.
 *
 * @remarks
 * Loudwolf uses a custom HTML-based website that requires parsing HTML responses
 * to extract product information. The strategy uses DOM parsing to extract data
 * from product listings and detail pages.
 */
export class LoudwolfStrategy implements SupplierStrategy<globalThis.Product> {
  private readonly logger: Logger;
  public readonly baseURL: string = "https://www.loudwolf.com";

  constructor() {
    this.logger = new Logger("LoudwolfStrategy");
  }

  /**
   * Filters an array of DOM elements using fuzzy string matching to find items that closely match a query string.
   * Uses the WRatio algorithm from fuzzball for string similarity comparison.
   */
  private fuzzyFilter(query: string, elements: Element[], cutoff: number = 40): Element[] {
    const res = extract(query, elements, {
      scorer: WRatio,
      processor: (element: Element) => {
        const title = element.querySelector("div.caption h4 a")?.textContent?.trim() || "";
        return title;
      },
      cutoff: cutoff,
      sortBySimilarity: true,
    }).reduce((acc, [element, score, idx]) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      (element as any).___fuzz = { score, idx };
      acc[idx] = element;
      return acc;
    }, [] as Element[]);

    this.logger.debug("fuzzed search results:", res);
    return res.filter((item) => !!item);
  }

  /**
   * Query products from Loudwolf's HTML-based search page
   */
  public async queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product>[] | void> {
    try {
      const response = await httpClient.getHtml(`${baseURL}/storefront/index.php`, {
        search: encodeURIComponent(query),
        route: "product/search",
        limit: 100,
      });

      if (!response) {
        this.logger.error("No search response");
        return;
      }

      // Create a new DOM to do the traversing/parsing
      const parser = new DOMParser();
      const parsedHTML = parser.parseFromString(response, "text/html");

      // Select all products by a known selector path
      const products = parsedHTML.querySelectorAll("div.product-layout.product-list");
      const fuzzResults = this.fuzzyFilter(query, Array.from(products));

      this.logger.debug("Mapped response elements:", fuzzResults);

      // Initialize product builders from filtered results
      return this.initProductBuilders(fuzzResults.slice(0, limit));
    } catch (error) {
      this.logger.error("Error querying products:", error);
      return;
    }
  }

  /**
   * Initialize product builders from Loudwolf HTML search response data
   */
  private initProductBuilders(elements: Element[]): ProductBuilder<globalThis.Product>[] {
    return mapDefined(elements, (element: Element) => {
      const builder = new ProductBuilder(this.baseURL);

      const priceElem = element.querySelector("div.caption > p.price");
      const price = parsePrice(priceElem?.textContent?.trim() || "");

      if (price === undefined) {
        this.logger.error("No price for product", element);
        return;
      }

      const href = element.querySelector("div.caption h4 a")?.getAttribute("href");

      if (!href) {
        this.logger.error("No URL for product");
        return;
      }

      const url = new URL(href, this.baseURL);
      const id = url.searchParams.get("product_id");

      if (id === null) {
        this.logger.error("No ID for product");
        return;
      }

      const title = element.querySelector("div.caption h4 a")?.textContent?.trim() || "";

      return builder
        .setBasicInfo(title, url.toString(), "Loudwolf")
        .setDescription(
          element.querySelector("div.caption > p:nth-child(2)")?.textContent?.trim() || "",
        )
        .setId(id)
        .setPricing(price.price, price.currencyCode, price.currencySymbol);
    });
  }

  /**
   * Get detailed product data from Loudwolf's HTML product page
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product> | void> {
    try {
      const productResponse = await httpClient.getHtml(builder.get("url"));

      if (!productResponse) {
        this.logger.warn("No product response");
        return builder;
      }

      const parser = new DOMParser();
      const parsedHTML = parser.parseFromString(productResponse, "text/html");
      const domContent = parsedHTML.querySelector("#content");
      const dataGrid = Array.from(
        domContent?.querySelectorAll("#content .tab-content .MsoTableGrid") || [],
      )
        .find((element) => element.textContent?.trim().match(/CAS/i))
        ?.querySelectorAll("p");

      if (!dataGrid) {
        this.logger.warn("No data grid found for product");
        return builder;
      }

      const dataRows = Array.from(dataGrid).map((n) => n.innerText);
      const datagridInfo = dataRows.reduce((acc, row) => {
        const [key, value] = row.split(": ").map((s) => s.trim());
        if (!key || !value) return acc;

        if (key.match(/CAS/i)) {
          acc.cas = findCAS(value) ?? undefined;
        } else if (key.match(/TOTAL [A-Z]+ OF PRODUCT/i)) {
          const qty = parseQuantity(value);
          if (qty) {
            Object.assign(acc, qty);
          }
        } else if (key.match(/GRADE/i)) {
          acc.grade = value;
        }
        return acc;
      }, {} as Partial<globalThis.Product>);

      return builder.setData(datagridInfo);
    } catch (error) {
      this.logger.error("Error getting product data:", error);
      return builder;
    }
  }
}
