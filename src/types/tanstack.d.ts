import "@tanstack/react-table";
import { CSSProperties } from "react";

declare global {
  /**
   * Extends the \@tanstack/react-table module with custom column methods and metadata.
   * These extensions provide additional functionality for column filtering, visibility,
   * and value range operations.
   */
  namespace TanStackTable {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Column<TData extends RowData, TValue> {
      /**
       * Returns a sorted array of unique values from the currently visible rows in the column.
       * This excludes values from rows that are filtered out by other column filters.
       * @returns Array of unique string or number values, sorted in ascending order
       */
      getVisibleUniqueValues: () => (string | number)[];

      /**
       * Returns the minimum and maximum values from the currently visible rows in the column.
       * This excludes values from rows that are filtered out by other column filters.
       * @returns Tuple containing [min, max] values
       */
      getVisibleRange: () => [number, number];

      /**
       * Returns a sorted array of all unique values in the column, regardless of current filters.
       * @returns Array of unique string or number values, sorted in ascending order
       */
      getAllUniqueValues: () => (string | number)[];

      /**
       * Returns the minimum and maximum values from all rows in the column, regardless of current filters.
       * @returns Tuple containing [min, max] values
       */
      getFullRange: () => [number, number];

      /**
       * Returns the display text of the column header.
       * Handles cases where the header might be a string, function, or React element.
       * @returns The header text as a string, or undefined if no header text is available
       */
      getHeaderText: () => string | undefined;

      /**
       * Sets the filter value for the column with a 500ms debounce.
       * Useful for text input filters to prevent excessive filtering operations.
       * @param value - The new filter value to set
       */
      setFilterValueDebounced: (value: TValue) => void;

      /**
       * Sets the filter value for the column with a 500ms throttle.
       * Useful for range filters to limit the frequency of filter updates.
       * @param value - The new filter value to set
       */
      setFilterValueThrottled: (value: TValue) => void;

      /**
       * Explicitly sets the visibility state of the column.
       * Only works if the column is configured to be hideable.
       * @param visible - Whether the column should be visible
       */
      setColumnVisibility: (visible: boolean) => void;
    }

    interface ColumnMeta {
      /** The type of filter to use for this column */
      filterVariant?: "text" | "range" | "select";
      /** Array of unique values for select-type filters */
      uniqueValues?: string[];
      /** Array of range values for range-type filters */
      rangeValues?: number[];
      /** CSS properties to apply to the column */
      style?: CSSProperties;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData = unknown, TValue = unknown> {
    /** The type of filter to use for this column */
    filterVariant?: "text" | "range" | "select";
    /** Array of unique values for select-type filters */
    uniqueValues?: string[];
    /** Array of range values for range-type filters */
    rangeValues?: number[];
    /** CSS properties to apply to the column */
    style?: CSSProperties;
  }
}

/*
declare module "@tanstack/react-table" {
  interface Column {
    getHeaderText?: () => string;
    getVisibleUniqueValues?: () => (string | number)[];
    getAllUniqueValues?: () => (string | number)[];
    getFullRange?: () => [number, number];
    getVisibleRange?: () => [number, number];
    setFilterValueDebounced?: (value: unknown) => void;
    setFilterValueThrottled?: (value: unknown) => void;
    setColumnVisibility?: (visible: boolean) => void;
  }
}
*/
// This export is needed to make the file a module

interface ColumnUniqueValues {
  getHeaderText?: () => string;
  getVisibleUniqueValues?: () => (string | number)[];
  getAllUniqueValues?: () => (string | number)[];
  getFullRange?: () => [number, number];
  getVisibleRange?: () => [number, number];
  setFilterValueDebounced?: (value: unknown) => void;
  setFilterValueThrottled?: (value: unknown) => void;
  setColumnVisibility?: (visible: boolean) => void;
}

declare module "@tanstack/react-table" {
  interface Column extends ColumnUniqueValues {}
}

export {};
