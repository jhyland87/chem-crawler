import { PerformanceLogger } from "./PerformanceLogger";

/**
 * A singleton class that manages performance logging contexts across the application.
 * Allows different parts of the application to log performance metrics without
 * passing logger instances around.
 *
 * @category Utils
 * @example
 * ```typescript
 * // In SupplierFactory
 * PerformanceContext.push("query-factory", { query: "sodium chloride" });
 * try {
 *   // Log factory-level metrics
 *   PerformanceContext.mark("search-started");
 *
 *   // When creating suppliers, push a new context
 *   for (const supplier of suppliers) {
 *     PerformanceContext.push("supplier", { name: supplier.name });
 *     try {
 *       // Log supplier-level metrics
 *       PerformanceContext.mark("supplier-started");
 *       // ... supplier operations ...
 *       PerformanceContext.mark("supplier-completed");
 *     } finally {
 *       PerformanceContext.pop(); // Pop supplier context
 *     }
 *   }
 * } finally {
 *   PerformanceContext.pop(); // Pop factory context
 * }
 * ```
 */
export class PerformanceContext {
  private static _stack: Array<{
    logger: PerformanceLogger;
    context: string;
    query?: string; // Track the current query
  }> = [];

  /**
   * Pushes a new performance logging context onto the stack.
   *
   * @param context - The context name (e.g., "query-factory", "supplier")
   * @param detail - Optional detail data to include with the context
   * @returns The created PerformanceLogger instance
   * @example
   * ```typescript
   * // Push a new context for a query
   * PerformanceContext.push("query-factory", { query: "sodium chloride" });
   *
   * // Push a new context for a supplier
   * PerformanceContext.push("supplier", { name: "ChemSupplier" });
   * ```
   */
  public static push(context: string, detail?: Record<string, unknown>): PerformanceLogger {
    const logger = new PerformanceLogger(context);
    // Extract query from detail if it exists
    const query = detail?.query as string | undefined;
    this._stack.push({ logger, context, query });

    // Create an initial mark for the context
    logger.mark("context-started", detail);

    return logger;
  }

  /**
   * Pops the current performance logging context from the stack.
   * Creates a final mark and measures the total duration of the context.
   *
   * @returns The popped PerformanceLogger instance
   * @example
   * ```typescript
   * // Pop the current context
   * const logger = PerformanceContext.pop();
   * const metrics = logger.getMetrics();
   * console.log("Context metrics:", metrics);
   * ```
   */
  public static pop(): PerformanceLogger | undefined {
    const context = this._stack.pop();
    if (!context) return undefined;

    const { logger } = context;

    // Create a final mark and measure total duration
    logger.mark("context-completed");
    logger.measure("total-duration", "context-started", "context-completed");

    return logger;
  }

  /**
   * Gets the current performance logging context.
   *
   * @returns The current PerformanceLogger instance or undefined if no context exists
   * @example
   * ```typescript
   * const currentLogger = PerformanceContext.current();
   * if (currentLogger) {
   *   currentLogger.mark("some-event");
   * }
   * ```
   */
  public static current(): PerformanceLogger | undefined {
    return this._stack[this._stack.length - 1]?.logger;
  }

  /**
   * Gets the current query from the stack.
   * Searches up the stack to find the most recent query.
   */
  private static _getCurrentQuery(): string | undefined {
    // Search from top to bottom of stack to find most recent query
    for (let i = this._stack.length - 1; i >= 0; i--) {
      if (this._stack[i].query) {
        return this._stack[i].query;
      }
    }
    return undefined;
  }

  /**
   * Creates a mark in the current context.
   * Automatically includes the current query in the detail object if available.
   *
   * @param name - Name of the mark
   * @param detail - Optional detail data
   * @returns The created PerformanceMark or undefined if no context exists
   * @example
   * ```typescript
   * // Create a mark in the current context
   * PerformanceContext.mark("search-started", { query: "sodium chloride" });
   * ```
   */
  public static mark(name: string, detail?: Record<string, unknown>): PerformanceMark | undefined {
    const currentQuery = this._getCurrentQuery();
    const enhancedDetail = {
      ...detail,
      ...(currentQuery ? { query: currentQuery } : {}),
    };
    return this.current()?.mark(name, enhancedDetail);
  }

  /**
   * Creates a measure in the current context.
   * Automatically includes the current query in the detail object if available.
   *
   * @param name - Name of the measure
   * @param startMark - Name of the start mark
   * @param endMark - Name of the end mark
   * @param detail - Optional detail data
   * @returns The created PerformanceMeasure or undefined if no context exists
   * @example
   * ```typescript
   * // Create a measure in the current context
   * PerformanceContext.measure(
   *   "search-duration",
   *   "search-started",
   *   "search-completed",
   *   { resultCount: 10 }
   * );
   * ```
   */
  public static measure(
    name: string,
    startMark: string,
    endMark: string,
    detail?: Record<string, unknown>,
  ): PerformanceMeasure | undefined {
    const currentQuery = this._getCurrentQuery();
    const enhancedDetail = {
      ...detail,
      ...(currentQuery ? { query: currentQuery } : {}),
    };
    return this.current()?.measure(name, startMark, endMark, enhancedDetail);
  }

  /**
   * Gets metrics from all contexts in the stack.
   *
   * @returns Array of context metrics
   * @example
   * ```typescript
   * const allMetrics = PerformanceContext.getAllMetrics();
   * console.log("All context metrics:", allMetrics);
   * ```
   */
  public static getAllMetrics(): Array<{
    context: string;
    metrics: ReturnType<PerformanceLogger["getMetrics"]>;
    summary: ReturnType<PerformanceLogger["getSummary"]>;
  }> {
    return this._stack.map(({ logger, context }) => ({
      context,
      metrics: logger.getMetrics(),
      summary: logger.getSummary(),
    }));
  }

  /**
   * Clears all performance contexts and their data.
   *
   * @example
   * ```typescript
   * // Clear all performance data
   * PerformanceContext.clear();
   * ```
   */
  public static clear(): void {
    for (const { logger } of this._stack) {
      logger.clear();
    }
    this._stack = [];
  }
}

if (typeof window !== "undefined") {
  window.PerformanceContext = PerformanceContext;
}
