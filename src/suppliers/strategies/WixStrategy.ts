import { parsePrice } from "@/helpers/currency";
import { parseQuantity } from "@/helpers/quantity";
import { findFormulaInHtml } from "@/helpers/science";
import { firstMap } from "@/helpers/utils";
import { HttpClient } from "@/utils/HttpClient";
import Logger from "@/utils/Logger";
import ProductBuilder from "@/utils/ProductBuilder";
import { isProductItem, isProductSelection, isValidSearchResponse } from "@/utils/typeGuards/wix";
import { extract, WRatio } from "fuzzball";
import merge from "lodash/merge";
import { SupplierStrategy } from "./SupplierStrategy";

/**
 * Abstract base strategy for Wix-based suppliers.
 * Provides common functionality for interacting with Wix's GraphQL API.
 *
 * @remarks
 * Wix has an exposed GraphQL API which can be used to retrieve product data.
 * The queries are mostly listed in the javascript file `CartIconController.bundle.min.js`.
 *
 * @example
 * ```typescript
 * class MyWixSupplierStrategy extends WixStrategy {
 *   public readonly supplierName = "My Wix Supplier";
 *   public readonly baseURL = "https://mywixsupplier.com";
 * }
 * ```
 */
export abstract class WixStrategy implements SupplierStrategy<globalThis.Product> {
  protected readonly logger: Logger;
  protected accessToken: string = "";

  /** Default values for products */
  protected readonly productDefaults = {
    uom: "ea",
    quantity: 1,
    currencyCode: "USD",
    currencySymbol: "$",
  };

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Gets the GraphQL query for fetching filtered products from the Wix API.
   */
  protected getGraphQLQuery(): string {
    return `
    query getFilteredProductsWithHasDiscount(
        $mainCollectionId: String!
        $filters: ProductFilters
        $sort: ProductSort
        $offset: Int
        $limit: Int
        $withOptions: Boolean = false
        $withPriceRange: Boolean = false
      ) {
        catalog {
          category(categoryId: $mainCollectionId) {
            numOfProducts
            productsWithMetaData(
              filters: $filters
              limit: $limit
              sort: $sort
              offset: $offset
              onlyVisible: true
            ) {
              totalCount
              list {
                id
                options {
                  id
                  key
                  title @include(if: $withOptions)
                  optionType @include(if: $withOptions)
                  selections @include(if: $withOptions) {
                    id
                    value
                    description
                    key
                    inStock
                  }
                }
                productItems @include(if: $withOptions) {
                  id
                  optionsSelections
                  price
                  formattedPrice
                }
                productType
                price
                sku
                isInStock
                urlPart
                formattedPrice
                name
                description
                brand
                priceRange(withSubscriptionPriceRange: true) @include(if: $withPriceRange) {
                  fromPriceFormatted
                }
              }
            }
          }
        }
      }
    `;
  }

  /**
   * Get the GraphQL variables for the Wix API
   */
  protected getGraphQLVariables(query: string): GraphQLQueryVariables {
    return {
      mainCollectionId: "00000000-000000-000000-000000000001",
      offset: 0,
      limit: 150,
      sort: null,
      filters: {
        term: {
          field: "name",
          op: "CONTAINS",
          values: [`*${query}*`],
        },
      },
      withOptions: true,
      withPriceRange: false,
    } satisfies GraphQLQueryVariables;
  }

  /**
   * Sets up the Wix API access by retrieving and setting the access token.
   * This method must be called before making any API requests.
   */
  protected async setup(httpClient: HttpClient): Promise<void> {
    const accessTokenResponse = await httpClient.getJson<{
      apps: Record<string, { instance: string }>;
    }>(`${this.baseURL}/_api/v1/access-tokens`, {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.5",
      "cache-control": "no-cache",
      pragma: "no-cache",
      priority: "u=1, i",
      referer: this.baseURL,
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    });

    this.accessToken = accessTokenResponse.apps["1380b703-ce81-ff05-f115-39571d94dfcd"].instance;
  }

  /**
   * Query products from the Wix API
   */
  public async queryProducts(
    query: string,
    limit: number,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product>[] | void> {
    try {
      // Ensure we have an access token
      if (!this.accessToken) {
        await this.setup(httpClient);
      }

      const q = this.getGraphQLQuery();
      const v = this.getGraphQLVariables(query);

      const queryResponse = await httpClient.getJson<unknown>(
        `${baseURL}/_api/wix-ecommerce-storefront-web/api`,
        {
          Authorization: this.accessToken,
          "content-type": "application/json",
          o: "getFilteredProducts",
          s: "WixStoresWebClient",
          q,
          v: JSON.stringify(v),
        },
      );

      if (!isValidSearchResponse(queryResponse)) {
        this.logger.error("Invalid search response:", queryResponse);
        return;
      }

      const products = queryResponse.data.catalog.category.productsWithMetaData.list;
      const fuzzResults = this.fuzzyFilter(query, products);

      this.logger.info("fuzzResults:", fuzzResults);
      return this.initProductBuilders(fuzzResults.slice(0, limit));
    } catch (error) {
      this.logger.error("Error querying products:", error);
      return;
    }
  }

  /**
   * Initialize product builders from Wix search response data
   */
  protected initProductBuilders(results: ProductObject[]): ProductBuilder<globalThis.Product>[] {
    return results
      .map((product) => {
        if (!product.price) {
          return;
        }

        // Generate an object with the products UUID and formatted price, with the option ID as the keys
        const productItems = Object.fromEntries(
          product.productItems
            .map((item: ProductItem) => {
              if (!isProductItem(item)) {
                this.logger.warn("Invalid product item:", item);
                return [];
              }
              return [
                item.optionsSelections[0],
                {
                  ...parsePrice(item.formattedPrice),
                  id: item.id,
                  quantity: item.price,
                },
              ];
            })
            .filter((entry) => entry.length > 0),
        );

        // Generate an object with the product quantity selections and the product selection ID
        const productSelections = Object.fromEntries(
          product.options[0].selections
            .map((selection: ProductSelection) => {
              if (!isProductSelection(selection)) {
                this.logger.warn("Invalid product selection:", selection);
                return [];
              }
              return [selection.id, parseQuantity(selection.value)];
            })
            .filter((entry) => entry.length > 0),
        );

        const productVariants = merge(productItems, productSelections);
        const productPrice = parsePrice(product.formattedPrice);

        if (!productPrice) {
          return;
        }

        const firstVariant = productVariants[Object.keys(productVariants)[0]];
        if (!firstVariant || !("quantity" in firstVariant) || !("uom" in firstVariant)) {
          return;
        }

        const builder = new ProductBuilder<globalThis.Product>(this.baseURL);

        const cas = firstMap(findFormulaInHtml, [
          product.name,
          product.description,
          product.urlPart,
        ]);

        return builder
          .setBasicInfo(
            product.name,
            `${this.baseURL}/product-page/${product.urlPart}`,
            this.supplierName,
          )
          .setPricing(productPrice.price, productPrice.currencyCode, productPrice.currencySymbol)
          .setQuantity(firstVariant.quantity, firstVariant.uom)
          .setId(product.id)
          .setCAS(cas ?? "")
          .setSku(product.sku)
          .setDescription(product.description)
          .setVariants(Object.values(productVariants) as unknown as Variant[]);
      })
      .filter((builder): builder is ProductBuilder<globalThis.Product> => builder !== undefined);
  }

  /**
   * Get detailed product data from Wix
   * Since Wix includes all product data in search results,
   * we can just return the product builder directly
   */
  public async getProductData(
    builder: ProductBuilder<globalThis.Product>,
    baseURL: string,
    httpClient: HttpClient,
  ): Promise<ProductBuilder<globalThis.Product> | void> {
    return builder;
  }

  /**
   * Filters an array of products using fuzzy string matching
   */
  protected fuzzyFilter(query: string, products: ProductObject[]): ProductObject[] {
    const res = extract(query, products, {
      scorer: WRatio,
      processor: (product: ProductObject) => product.name,
      cutoff: 40,
      sortBySimilarity: true,
    }).reduce((acc: ProductObject[], [product, score, idx]: [ProductObject, number, number]) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      (product as any).___fuzz = { score, idx };
      acc[idx] = product;
      return acc;
    }, [] as ProductObject[]);

    this.logger.debug("fuzzed search results:", res);
    return res.filter((item: ProductObject) => !!item);
  }

  /** The display name of the supplier */
  public abstract readonly supplierName: string;

  /** The base URL for the supplier's website */
  public abstract readonly baseURL: string;
}
