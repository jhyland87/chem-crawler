import { findCAS } from "@/helpers/cas";
import { parsePrice } from "@/helpers/currency";
import { isQuantityObject, parseQuantity } from "@/helpers/quantity";
import { firstMap } from "@/helpers/utils";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import {
  isATGResponse,
  isResponseOk,
  isSearchResultItem,
  isValidProductResponse,
  isValidSearchResponse,
} from "@/utils/typeGuards/carolina";
import { WRatio } from "fuzzball";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Strategy implementation for Carolina Biological Supply Company.
 * Handles product searching and data extraction from Carolina.com.
 *
 * @remarks
 * Carolina.com uses Oracle ATG Commerce as their ecommerce platform.
 * The website is https://www.carolina.com/
 *
 * Product search uses the following endpoints:
 * - Product Search: `/browse/product-search-results?tab=p&q=acid`
 * - Product Search JSON: `/browse/product-search-results?tab=p&format=json&ajax=true&q=acid`
 * - Product Details: `/:category/:productName/:productId.pr`
 * - Product Details JSON: `/:category/:productName/:productId.pr?format=json&ajax=true`
 */
export class CarolinaStrategy implements SupplierStrategy<globalThis.Product> {
  /** Base URL for the supplier's website */
  public readonly baseURL = "https://www.carolina.com";

  /** Display name of the supplier */
  public readonly supplierName = "Carolina";

  /** Logger instance for this strategy */
  private readonly logger = new Logger("CarolinaStrategy");

  /** Default headers for HTTP requests */
  private readonly headers: HeadersInit = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.6",
    "cache-control": "no-cache",
    pragma: "no-cache",
    "sec-ch-ua": '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
  };

  /**
   * Query products from Carolina's search API.
   * Makes a GET request to the search endpoint and parses the JSON response.
   */
  public async queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product>[] | void> {
    this.logger.debug("Querying products:", query);

    const searchUrl = new URL("/browse/product-search-results", baseURL);
    searchUrl.searchParams.append("tab", "p");
    searchUrl.searchParams.append("product.type", "Product");
    searchUrl.searchParams.append("product.productTypes", "chemicals");
    searchUrl.searchParams.append("facetFields", "product.productTypes");
    searchUrl.searchParams.append("format", "json");
    searchUrl.searchParams.append("ajax", "true");
    searchUrl.searchParams.append("viewSize", "300");
    searchUrl.searchParams.append("q", query);

    const response = await httpClient.getJson(searchUrl.toString(), this.headers);

    if (!isResponseOk(response)) {
      this.logger.warn("Response status:", response);
      return;
    }

    const results = this.extractSearchResults(response);
    if (!results.length) {
      this.logger.warn("No search results found");
      return;
    }

    const fuzzResults = this.fuzzyFilter(query, results);
    this.logger.debug("Fuzzy filtered results:", fuzzResults);

    return this.initProductBuilders(fuzzResults.slice(0, limit));
  }

  /**
   * Get detailed product data from Carolina's product page.
   * Fetches the product page and extracts additional information from ATG response.
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product> | void> {
    this.logger.debug("Getting product data for:", builder.get("url"));

    const productUrl = new URL(builder.get("url"), baseURL);
    productUrl.searchParams.append("format", "json");
    productUrl.searchParams.append("ajax", "true");

    const productResponse = await httpClient.getJson(productUrl.toString(), this.headers);

    if (!isResponseOk(productResponse)) {
      this.logger.warn("Response status:", productResponse);
      return;
    }

    const atgResponse = this.extractATGResponse(productResponse);
    if (!atgResponse) {
      this.logger.warn("No ATG response found");
      return;
    }

    const productId = atgResponse.dataLayer.productDetail.productId;
    if (!productId) {
      this.logger.warn("No product ID found");
      return;
    }
    builder.setId(productId);

    let productPrice;
    if (atgResponse?.dataLayer?.productPrice?.[0]) {
      productPrice = parsePrice(atgResponse.dataLayer.productPrice[0]);
    } else if (
      atgResponse?.familyVariyantProductDetails?.schemaJson?.schemaJson?.offers?.length > 0
    ) {
      const productVariantEntry =
        atgResponse.familyVariyantProductDetails.schemaJson.schemaJson.offers.find(
          (offer) => offer.sku === productId,
        );
      if (productVariantEntry) {
        productPrice = {
          currencyCode: productVariantEntry.priceCurrency,
          price: productVariantEntry.price,
          currencySymbol: "$",
        };
      }
    }

    if (!productPrice) {
      this.logger.warn("No product price found");
      return;
    }

    builder.setPricing(productPrice);

    const quantity = firstMap(parseQuantity, [
      atgResponse.displayName,
      atgResponse.shortDescription,
    ]);

    if (!isQuantityObject(quantity)) {
      this.logger.warn("No quantity object found");
      return;
    }

    builder.setQuantity(quantity);

    const casNo = firstMap(findCAS, [
      atgResponse.displayName,
      atgResponse.shortDescription,
      atgResponse.longDescription,
    ]);

    if (casNo) builder.setCAS(casNo);
    builder.setDescription(atgResponse.shortDescription);

    return builder;
  }

  /**
   * Initialize product builders from search results.
   * Transforms Carolina search results into ProductBuilder instances.
   */
  private initProductBuilders(data: CarolinaSearchResult[]): ProductBuilder<globalThis.Product>[] {
    return data.map((result) => {
      const builder = new ProductBuilder<globalThis.Product>(this.baseURL)
        .setBasicInfo(result.productName, result.productUrl, this.supplierName)
        .setPricing(parsePrice(result.itemPrice) as ParsedPrice);

      const casNo = findCAS(result["product.shortDescription"]);
      if (typeof casNo === "string") builder.setCAS(casNo);

      return builder;
    });
  }

  /**
   * Filter search results using fuzzy matching.
   * Uses WRatio from fuzzball to find the best matches for the query.
   */
  private fuzzyFilter(query: string, data: CarolinaSearchResult[]): CarolinaSearchResult[] {
    return data
      .map((item) => {
        const score = WRatio(query.toLowerCase(), item.productName.toLowerCase());
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((result) => result.item);
  }

  /**
   * Extracts product search results from a response object.
   * Navigates through nested response structure to find product listings.
   */
  private extractSearchResults(response: unknown): CarolinaSearchResult[] {
    try {
      if (!isValidSearchResponse(response)) {
        this.logger.warn("Invalid response structure");
        return [];
      }

      const contentFolder = response.contents.ContentFolderZone[0];
      if (!contentFolder?.childRules?.[0]?.ContentRuleZone) {
        this.logger.warn("No content rules found");
        return [];
      }

      const pageContent = contentFolder.childRules[0].ContentRuleZone[0];
      if (!pageContent?.contents?.MainContent) {
        this.logger.warn("No MainContent found");
        return [];
      }

      const mainContentItems = pageContent.contents.MainContent;
      const pluginSlotContainer = mainContentItems.find((item: MainContentItem) =>
        item.contents?.ContentFolderZone?.some(
          (folder: ContentFolder) => folder.folderPath === "Products - Search",
        ),
      );

      if (!pluginSlotContainer?.contents?.ContentFolderZone) {
        this.logger.warn("No Products - Search folder found");
        return [];
      }

      const productsFolder = pluginSlotContainer.contents.ContentFolderZone.find(
        (folder: ContentFolder) => folder.folderPath === "Products - Search",
      );

      if (!productsFolder?.childRules?.[0]?.ContentRuleZone) {
        this.logger.warn("No content rules in Products folder");
        return [];
      }

      const resultsContainer = productsFolder.childRules[0].ContentRuleZone.find(
        (zone: ContentRuleZoneItem): zone is ResultsContainer => {
          return (
            zone["@type"] === "ResultsContainer" &&
            Array.isArray((zone as Partial<ResultsContainer>).results)
          );
        },
      );

      if (!resultsContainer) {
        this.logger.warn("No results container found");
        return [];
      }

      return resultsContainer.results.filter(isSearchResultItem);
    } catch (error) {
      this.logger.error("Error extracting search results:", error);
      return [];
    }
  }

  /**
   * Extracts the relevant product data from an ATG response object.
   * Navigates through the nested response structure to find product information.
   */
  private extractATGResponse(productResponse: unknown): ATGResponse["response"] | null {
    if (!isValidProductResponse(productResponse)) {
      return null;
    }

    try {
      const atgResponse = productResponse.contents.MainContent[0].atgResponse;

      if (!isATGResponse(atgResponse)) {
        return null;
      }

      return atgResponse.response.response;
    } catch (error) {
      this.logger.warn("Error extracting ATG response:", error);
      return null;
    }
  }
}
