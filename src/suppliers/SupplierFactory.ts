import Logger from "@/utils/Logger";
import { createStrategy, strategyRegistry, SupplierContext, SupplierStrategy } from "./strategies";

/**
 * Factory class for querying multiple chemical suppliers simultaneously.
 * This class provides a unified interface to search across multiple supplier implementations.
 *
 * @category Suppliers
 * @example
 * ```typescript
 * // Create a factory to search all suppliers
 * const factory = new SupplierFactory("sodium chloride", new AbortController());
 *
 * // Create a factory to search specific suppliers
 * const factory = new SupplierFactory(
 *   "sodium chloride",
 *   new AbortController(),
 *   ["Carolina", "LaboratoriumDiscounter"]
 * );
 *
 * // Iterate over results from all selected suppliers
 * for await (const product of factory) {
 *   console.log(product.supplier, product.title, product.price);
 * }
 * ```
 */
export default class SupplierFactory<T extends Product> implements AsyncIterable<T> {
  // Term being queried
  private query: string;

  // Abort controller for fetch control
  private controller: AbortController;

  // List of supplier names to include in query results
  private suppliers: Array<string>;

  // Maximum number of results for each supplier
  private limit: number = 5;

  // Logger instance
  private logger: Logger;

  // Map of supplier contexts
  private contexts: Map<string, SupplierContext<T>>;

  /**
   * Factory class for querying all suppliers.
   *
   * @param query - Value to query for
   * @param limit - Maximum number of results for each supplier
   * @param controller - Fetch controller (can be used to terminate the query)
   * @param suppliers - Array of suppliers to query (empty is the same as querying all)
   */
  constructor(
    query: string,
    limit: number = this.limit,
    controller: AbortController,
    suppliers: Array<string> = [],
  ) {
    this.logger = new Logger("SupplierFactory");
    this.logger.debug("initialized");
    this.query = query;
    this.logger.debug("Query:", this.query);
    this.limit = limit;
    this.controller = controller;
    this.suppliers = suppliers;
    this.logger.debug("Suppliers:", this.suppliers);
    this.contexts = new Map();
    this.initializeContexts();
  }

  /**
   * Initialize supplier contexts for each selected supplier.
   */
  private initializeContexts(): void {
    const supplierNames =
      this.suppliers.length > 0 ? this.suppliers : Array.from(strategyRegistry.keys());

    for (const supplierName of supplierNames) {
      const strategy = createStrategy(supplierName);
      if (strategy && "baseURL" in strategy) {
        const typedStrategy = strategy as unknown as SupplierStrategy<T>;
        const context = new SupplierContext<T>(
          typedStrategy,
          (strategy as { baseURL: string }).baseURL,
          this.getDefaultHeaders(),
        );
        this.contexts.set(supplierName, context);
      } else {
        this.logger.warn(`No strategy found for supplier: ${supplierName}`);
      }
    }
  }

  /**
   * Get default headers for supplier requests.
   */
  private getDefaultHeaders(): HeadersInit {
    return {
      Accept: "application/json",
      "User-Agent": "ChemCrawler/1.0",
    };
  }

  /**
   * Get the list of available supplier names.
   * Use these names when specifying which suppliers to query in the constructor.
   *
   * @returns Array of supplier names that can be queried
   * @example
   * ```typescript
   * const suppliers = SupplierFactory.supplierList();
   * // Returns: ["Carolina", "LaboratoriumDiscounter", ...]
   *
   * // Use these names to create a targeted factory
   * const factory = new SupplierFactory("acid", controller, suppliers.slice(0, 2));
   * ```
   */
  public static supplierList(): Array<string> {
    return Array.from(strategyRegistry.keys());
  }

  /**
   * Implements the AsyncIterable interface to allow for-await-of iteration over products.
   * Yields products from all selected suppliers in sequence.
   *
   * @returns AsyncGenerator yielding products of type T
   * @throws Error if a supplier query fails (unless due to abort)
   * @example
   * ```typescript
   * const factory = new SupplierFactory("acid", new AbortController());
   *
   * try {
   *   for await (const product of factory) {
   *     console.log(product.title);
   *   }
   * } catch (err) {
   *   console.error("Search failed:", err);
   * }
   * ```
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, unknown> {
    try {
      this.logger.debug("Starting search");

      for (const [supplierName, context] of this.contexts) {
        if (this.controller.signal.aborted) {
          this.logger.warn("Search was aborted");
          return;
        }

        try {
          const results = await context.queryProducts(this.query, this.limit);
          if (!results) continue;

          for (const builder of results) {
            if (this.controller.signal.aborted) {
              this.logger.warn("Search was aborted");
              return;
            }

            try {
              const product = await context.getProductData(builder);
              if (product) {
                const finishedProduct = await product.build();
                if (finishedProduct) {
                  yield finishedProduct as T;
                }
              }
            } catch (err) {
              this.logger.error(`Error processing product from ${supplierName}:`, err);
              continue;
            }
          }
        } catch (err) {
          this.logger.error(`Error querying ${supplierName}:`, err);
          continue;
        }
      }
    } catch (err) {
      if (this.controller.signal.aborted) {
        this.logger.warn("Search was aborted");
        return;
      }
      this.logger.error("ERROR in generator fn:", err);
      throw err;
    }
  }
}
