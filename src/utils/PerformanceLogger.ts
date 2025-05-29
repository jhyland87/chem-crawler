import "@/types/globals.d";
import { Logger } from "./Logger";

/**
 * A utility class for tracking performance metrics across the application.
 * Uses the browser's Performance API to measure and log timing information.
 *
 * @category Utils
 * @example
 * ```typescript
 * // Initialize the logger
 * const perfLogger = new PerformanceLogger("query-search");
 *
 * // Start measuring
 * perfLogger.start("search-init");
 *
 * // Add a mark
 * perfLogger.mark("search-started", { query: "sodium chloride" });
 *
 * // Measure time between marks
 * perfLogger.measure("search-duration", "search-started", "search-complete");
 *
 * // Get all measurements
 * const metrics = perfLogger.getMetrics();
 * console.log(metrics);
 * ```
 */
export class PerformanceLogger {
  private readonly _logger: Logger;
  private readonly _prefix: string;
  private readonly _marks: Map<string, PerformanceMark> = new Map();
  private readonly _measures: Map<string, PerformanceMeasure> = new Map();
  private readonly _query?: string;

  /**
   * Creates a new PerformanceLogger instance.
   *
   * @param prefix - A prefix to use for all performance marks and measures
   * @param loggerName - Optional name for the logger (defaults to "PerformanceLogger")
   * @param query - Optional query string to include in all marks and measures
   */
  constructor(prefix: string, loggerName: string = "PerformanceLogger", query?: string) {
    this._logger = new Logger(loggerName);
    this._prefix = prefix;
    this._query = query;
  }

  /**
   * Creates a performance mark with optional detail data.
   * Always includes the query if available.
   *
   * @param name - Name of the mark
   * @param detail - Optional detail object to attach to the mark
   * @returns The created PerformanceMark
   * @example
   * ```typescript
   * // Create a simple mark
   * perfLogger.mark("search-started");
   *
   * // Create a mark with detail data
   * perfLogger.mark("search-started", {
   *   query: "sodium chloride",
   *   supplier: "ChemSupplier"
   * });
   * ```
   */
  public mark(name: string, detail?: Record<string, unknown>): PerformanceMark {
    const markName = `${this._prefix}-${name}`;
    try {
      const mark = performance.mark(markName, {
        detail: {
          timestamp: Date.now(),
          ...(this._query ? { query: this._query } : {}),
          ...detail,
        },
      });
      this._marks.set(markName, mark);
      this._logger.debug(`Created mark: ${markName}`, detail);
      return mark;
    } catch (error) {
      this._logger.error(`Failed to create mark: ${markName}`, { error, detail });
      throw error;
    }
  }

  /**
   * Measures the time between two marks.
   * Always includes the query if available.
   *
   * @param name - Name of the measure
   * @param startMark - Name of the start mark
   * @param endMark - Name of the end mark
   * @param detail - Optional detail object to attach to the measure
   * @returns The created PerformanceMeasure
   * @example
   * ```typescript
   * // Create marks
   * perfLogger.mark("search-start");
   * // ... do some work ...
   * perfLogger.mark("search-end");
   *
   * // Measure the duration
   * perfLogger.measure("search-duration", "search-start", "search-end");
   *
   * // Measure with detail data
   * perfLogger.measure("search-duration", "search-start", "search-end", {
   *   resultCount: 10,
   *   supplier: "ChemSupplier"
   * });
   * ```
   */
  public measure(
    name: string,
    startMark: string,
    endMark: string,
    detail?: Record<string, unknown>,
  ): PerformanceMeasure {
    const measureName = `${this._prefix}-${name}`;
    const startMarkName = `${this._prefix}-${startMark}`;
    const endMarkName = `${this._prefix}-${endMark}`;

    try {
      // Create measure with start and end marks
      const measure = performance.measure(measureName, {
        start: startMarkName,
        end: endMarkName,
        detail: {
          startMark,
          endMark,
          ...(this._query ? { query: this._query } : {}),
          ...detail,
        },
      });
      this._measures.set(measureName, measure);
      this._logger.debug(`Created measure: ${measureName}`, {
        duration: measure.duration,
        startMark,
        endMark,
        detail,
      });
      return measure;
    } catch (error) {
      this._logger.error(`Failed to create measure: ${measureName}`, {
        error,
        startMark,
        endMark,
        detail,
      });
      throw error;
    }
  }

  /**
   * Gets all performance marks and measures created by this logger.
   *
   * @returns Object containing arrays of marks and measures
   * @example
   * ```typescript
   * const metrics = perfLogger.getMetrics();
   * console.log("Marks:", metrics.marks);
   * console.log("Measures:", metrics.measures);
   * ```
   */
  public getMetrics(): {
    marks: Array<{ name: string; timestamp: number; detail?: Record<string, unknown> }>;
    measures: Array<{
      name: string;
      duration: number;
      startTime: number;
      detail?: Record<string, unknown>;
    }>;
  } {
    const marks = Array.from(this._marks.values()).map((mark) => ({
      name: mark.name,
      timestamp: mark.startTime,
      detail: (mark as PerformanceMark & { detail?: Record<string, unknown> }).detail,
    }));

    const measures = Array.from(this._measures.values()).map((measure) => ({
      name: measure.name,
      duration: measure.duration,
      startTime: measure.startTime,
      detail: (measure as PerformanceMeasure & { detail?: Record<string, unknown> }).detail,
    }));

    return { marks, measures };
  }

  /**
   * Clears all marks and measures created by this logger.
   *
   * @example
   * ```typescript
   * // Clear all performance data
   * perfLogger.clear();
   * ```
   */
  public clear(): void {
    try {
      // Clear marks
      for (const mark of this._marks.values()) {
        performance.clearMarks(mark.name);
      }
      this._marks.clear();

      // Clear measures
      for (const measure of this._measures.values()) {
        performance.clearMeasures(measure.name);
      }
      this._measures.clear();

      this._logger.debug("Cleared all performance data");
    } catch (error) {
      this._logger.error("Failed to clear performance data", { error });
      throw error;
    }
  }

  /**
   * Gets a summary of all performance metrics.
   *
   * @returns Object containing summary statistics
   * @example
   * ```typescript
   * const summary = perfLogger.getSummary();
   * console.log("Total duration:", summary.totalDuration);
   * console.log("Average duration:", summary.averageDuration);
   * console.log("Number of operations:", summary.operationCount);
   * ```
   */
  public getSummary(): {
    totalDuration: number;
    averageDuration: number;
    operationCount: number;
    marks: number;
    measures: number;
  } {
    const measures = Array.from(this._measures.values());
    const totalDuration = measures.reduce((sum, measure) => sum + measure.duration, 0);
    const operationCount = measures.length;

    return {
      totalDuration,
      averageDuration: operationCount > 0 ? totalDuration / operationCount : 0,
      operationCount,
      marks: this._marks.size,
      measures: this._measures.size,
    };
  }
}

if (typeof window !== "undefined") {
  window.PerformanceLogger = PerformanceLogger;
}
