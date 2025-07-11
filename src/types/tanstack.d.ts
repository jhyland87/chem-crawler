import "@tanstack/react-table";
import { UserSettings } from "./common";

declare module "@tanstack/react-table" {
  interface TableMeta {
    userSettings: UserSettings;
  }

  interface Table {
    /** User settings associated with this table */
    userSettings?: UserSettings;
    /** Function to update user settings */
    setUserSettings?: (settings: UserSettings) => void;
    /** Function to sort table rows by match percentage */
    sortByMatchPercentage?: (order?: "asc" | "desc") => void;
    /** Function to check if table is currently sorted by match percentage */
    isSortedByMatchPercentage?: () => boolean;
    /** Function to get current match percentage sort order */
    getMatchPercentageSortOrder?: () => "asc" | "desc" | null;
    /** Internal state for custom sorting */
    _customSort?: { type: string; order: "asc" | "desc" };
    /** Function to update the badge with current row count */
    updateBadgeCount?: () => void;
  }

  interface Column<TValue> {
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
     * Sets the visibility of the column.
     * @param visible - Whether the column should be visible
     */
    setColumnVisibility: (visible: boolean) => void;

    /** User settings associated with this column */
    userSettings?: UserSettings;
  }

  // interface ColumnMeta {
  //   /** The type of filter to use for this column */
  //   filterVariant?: "text" | "range" | "select";
  //   /** Array of unique values for select-type filters */
  //   uniqueValues?: string[];
  //   /** Array of range values for range-type filters */
  //   rangeValues?: number[];
  //   /** CSS properties to apply to the column */
  //   style?: CSSProperties;

  // }

  /**
   * Configuration metadata for table columns.
   * Used to customize column behavior and appearance.
   *
   * @example
   * ```typescript
   * const columnMeta: ColumnMeta = {
   *   filterVariant: "range",
   *   uniqueValues: ["ACS", "Technical", "USP"],
   *   rangeValues: [0, 1000],
   *   style: { width: "200px" }
   * };
   * ```
   */
  interface ColumnMeta {
    /**
     * Type of filter to use for this column
     * @example "range"
     */
    filterVariant?: "range" | "select" | "text";

    /**
     * List of all possible unique values for select filters
     * @example ["ACS", "Technical", "USP"]
     */
    uniqueValues?: string[];

    /**
     * Minimum and maximum values for range filters
     * @example [0, 1000]
     */
    rangeValues?: number[];

    /**
     * Custom CSS styles to apply to the column
     * @example \{ width: "200px" \}
     */
    style?: CSSProperties;

    /**
     * Size of the filter input
     * @example 6
     */
    filterInputSize?: number;
  }

  // Extend the SortingFnOption type to include our custom sorting functions
  type SortingFnOption<TData> =
    | "alphanumeric"
    | "alphanumericCaseSensitive"
    | "basic"
    | "datetime"
    | "matchPercentage"
    | "priceSortingFn"
    | "quantitySortingFn"
    | "quantityStringSortingFn"
    | "weightSortingFn"
    | "volumeSortingFn"
    | SortingFn<TData>;

  // Extend the FilterFnOption type to include our custom filter functions
  type FilterFnOption<TData> =
    | "includesString"
    | "includesStringSensitive"
    | "equalsString"
    | "equalsStringSensitive"
    | "arrIncludes"
    | "arrIncludesAll"
    | "arrIncludesSome"
    | "between"
    | "betweenInclusive"
    | "inNumberRange"
    | "multiSelect"
    | FilterFn<TData>;
}

declare global {
  interface Window {
    resultsTable?: object;
  }
}

export {};
