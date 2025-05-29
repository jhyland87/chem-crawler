import { type Product } from "@/types";
import { Logger } from "@/utils/Logger";
import { PerformanceContext } from "@/utils/PerformanceContext";
import * as suppliers from ".";
import SupplierBase from "./supplierBase";
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
 *   ["SupplierCarolina", "SupplierLaballey"]
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
  private _query: string;

  // Abort controller for fetch control
  private _controller: AbortController;

  // List of supplier class names to include in query results
  private _suppliers: Array<string>;

  // Maximum number of results for each supplier
  private _limit: number = 5;

  // Logger instance
  private _logger: Logger;

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
    limit: number = this._limit,
    controller: AbortController,
    suppliers: Array<string> = [],
  ) {
    this._logger = new Logger("SupplierFactory");
    PerformanceContext.push("query-factory-init", {
      query,
      limit,
      suppliers,
    });
    this._logger.debug("initialized");
    this._query = query;
    this._logger.debug("Query:", this._query);
    this._limit = limit;
    this._controller = controller;
    this._suppliers = suppliers;
    this._logger.debug("Suppliers:", this._suppliers);
  }

  /**
   * Get the list of available supplier module names.
   * Use these names when specifying which suppliers to query in the constructor.
   *
   * @returns Array of supplier class names that can be queried
   * @example
   * ```typescript
   * const suppliers = SupplierFactory.supplierList();
   * // Returns: ["SupplierCarolina", "SupplierLaballey", "SupplierBioFuranChem", ...]
   *
   * // Use these names to create a targeted factory
   * const factory = new SupplierFactory("acid", controller, suppliers.slice(0, 2));
   * ```
   */
  public static supplierList(): Array<string> {
    return Object.keys(suppliers);
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
    // Push a new context for this query
    try {
      this._logger.debug("Starting search");
      PerformanceContext.push("query-factory-iterator");
      PerformanceContext.mark("search-started");

      const supplierIterator = this._getConsolidatedGenerator();

      for await (const value of supplierIterator) {
        PerformanceContext.mark("product-found", {
          title: value.title,
          supplier: value.supplier,
        });
        yield value as T;
      }

      PerformanceContext.mark("search-completed");
    } catch (err) {
      if (this._controller.signal.aborted === true) {
        PerformanceContext.mark("search-aborted", { error: err });
        this._logger.warn("Search was aborted");
        return;
      }
      PerformanceContext.mark("search-error", { error: err });
      this._logger.error("ERROR in generator fn:", err);
    } finally {
      PerformanceContext.mark("query-factory-iterator-completed");
      // Pop factory context and get its metrics
      const factoryLogger = PerformanceContext.pop();
      // Add a measure for the total duration of the factory query using the logger instance
      factoryLogger?.measure(
        "query-factory-total-duration",
        "context-started",
        "context-completed",
      );
      const factoryMetrics = factoryLogger?.getMetrics();
      this._logger.debug("Factory performance metrics:", factoryMetrics);
    }
  }

  /**
   * Creates a consolidated async generator that yields products from selected suppliers.
   * This method:
   * 1. Filters suppliers based on the names provided in constructor
   * 2. Instantiates selected supplier classes
   * 3. Combines their async iterators into a single stream
   *
   * @returns AsyncGenerator yielding products from all selected suppliers
   * @example
   * ```typescript
   * // Internal use only
   * const generator = this._getConsolidatedGenerator();
   * for await (const product of generator) {
   *   // Process each product
   * }
   * ```
   */
  private _getConsolidatedGenerator(): AsyncGenerator<Product, void, unknown> {
    PerformanceContext.mark("consolidated-generator-init");

    const combineAsyncIterators = async function* (
      this: SupplierFactory<T>,
      asyncIterators: SupplierBase<unknown, Product>[],
    ): AsyncGenerator<Product, void, unknown> {
      PerformanceContext.mark("consolidated-generator-start");

      for (const iterator of asyncIterators) {
        // Push a new context for each supplier

        try {
          PerformanceContext.mark("supplier-started", {
            supplier: iterator.supplierName,
          });

          let supplierProductCount = 0;
          for await (const value of iterator) {
            PerformanceContext.mark("supplier-product-found", {
              title: value.title,
              supplier: value.supplier,
            });
            supplierProductCount++;
            yield value;
          }

          PerformanceContext.mark("supplier-completed", {
            supplierProductCount,
          });
        } finally {
          PerformanceContext.mark("search-completed");
          // Pop supplier context and get its metrics
          const supplierLogger = PerformanceContext.pop();
          // Add a measure for the total duration of the supplier using the logger instance
          supplierLogger?.measure(
            "supplier-total-duration",
            "context-started",
            "context-completed",
          );
          const supplierMetrics = supplierLogger?.getMetrics();
          this._logger.debug("Supplier performance metrics:", {
            supplier: iterator.supplierName,
            metrics: supplierMetrics,
          });
        }
      }
    }.bind(this);

    // Only iterate over the suppliers that are selected (or all if none are selected)
    return combineAsyncIterators(
      Object.entries(suppliers).reduce(
        (result: SupplierBase<unknown, Product>[], [supplierClassName, supplierClass]) => {
          if (this._suppliers.length == 0 || this._suppliers.includes(supplierClassName)) {
            this._logger.debug("Initializing supplier class:", supplierClassName);
            this._logger.debug("this._limit:", this._limit);
            // Cast supplierClass to the correct type to fix type error
            const SupplierClass = supplierClass as new (
              query: string,
              limit: number,
              controller: AbortController,
            ) => SupplierBase<unknown, Product>;
            result.push(new SupplierClass(this._query, this._limit, this._controller));
          }
          return result;
        },
        [] satisfies SupplierBase<unknown, Product>[],
      ),
    );
  }
}
