import { useAppContext } from "@/context";
import Paper from "@mui/material/Paper";
import { Column } from "@tanstack/react-table";
import { isEmpty } from "lodash";
import { ReactElement, useEffect, useState } from "react";
import AnimatedSearchDemo from "../AnimatedSearchDemo";
import LoadingBackdrop from "../LoadingBackdrop";
import { useAutoColumnSizing } from "./hooks/useAutoColumnSizing";
import { useResultsTable } from "./hooks/useResultsTable";
import { useSearch } from "./hooks/useSearch";
import "./ResultsTable.scss";
/**
 * ResultsTable component that displays search results in a table format with filtering,
 * sorting, and pagination capabilities. It also handles the search execution and
 * manages the loading state.
 *
 * @component
 *
 * @example
 * ```tsx
 * <ResultsTable
 *   renderVariants={DetailsContainer}
 *   getRowCanExpand={() => true}
 *   columnFilterFns={[filters, setFilters]}
 * />
 * ```
 */
export default function ResultsTable({
  getRowCanExpand,
  columnFilterFns,
}: ProductTableProps<Product>): ReactElement {
  const appContext = useAppContext();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [statusLabel, setStatusLabel] = useState<string | boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { executeSearch, handleStopSearch } = useSearch({
    setSearchResults,
    setStatusLabel,
    setIsLoading,
  });

  // If the storage is cleared, then update the table (if the change hasn't been picked up already)
  chrome.storage.session.onChanged.addListener((changes) => {
    if (searchResults.length === changes.searchResults.newValue.length) return;
    setSearchResults(changes.searchResults.newValue as Product[]);
  });

  // Initializes the table by loading saved search results and column visibility settings.
  useEffect(() => {
    if (!isEmpty(appContext.userSettings.hideColumns)) {
      table.getAllLeafColumns().map((column: Column<Product>) => {
        if (appContext.userSettings.hideColumns.includes(column.id)) column.toggleVisibility(false);
      });
    }
    chrome.storage.session.get(["searchResults"]).then((data) => {
      const storedSearchResults = data.searchResults || [];

      if (!storedSearchResults) {
        setStatusLabel("Type a product name and hit enter");
        return;
      }

      setSearchResults(Array.isArray(storedSearchResults) ? storedSearchResults : []);
      setStatusLabel("");
    });
  }, []);

  /**
   * Updates the search results in storage and displayed results when results change.
   */
  useEffect(() => {
    console.log(searchResults.length + " search results");
    chrome.storage.session.set({ searchResults }).then(() => {
      if (!searchResults.length) {
        setStatusLabel(isLoading ? "Searching..." : "Type a product name and hit enter");
        return;
      }
      setStatusLabel(false);
    });
  }, [searchResults, isLoading]);

  const table = useResultsTable({
    showSearchResults: searchResults,
    columnFilterFns,
    getRowCanExpand,
  });

  // Integrate auto column sizing
  const autoSizer = useAutoColumnSizing(table, searchResults);

  function columnSizeVars() {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }

  return (
    <>
      <LoadingBackdrop
        open={isLoading}
        resultCount={searchResults.length}
        onClick={handleStopSearch}
      />

      <Paper id="search-results-table-container">
        <AnimatedSearchDemo />
      </Paper>
    </>
  );
}
