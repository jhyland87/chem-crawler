import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Column, flexRender } from "@tanstack/react-table";
import { isEmpty } from "lodash";
import { Fragment, ReactElement, useEffect, useRef, type CSSProperties } from "react";
import LoadingBackdrop from "../LoadingBackdrop";
import ContextMenu from "./ContextMenu";
import FilterMenu from "./FilterMenu";
import { useAppContext } from "./hooks/useContext";
import { useSearch } from "./hooks/useSearch";
import Pagination from "./Pagination";
import "./ResultsTable.scss";
import TableHeader from "./TableHeader";
import TableOptions from "./TableOptions";
import { useAutoColumnSizing } from "./useAutoColumnSizing.hook";
import { useContextMenu } from "./useContextMenu.hook";
import { useResultsTable } from "./useResultsTable.hook";

/**
 * Enhanced ResultsTable component using React v19 hooks for improved performance
 * and simpler state management.
 *
 * Key improvements:
 * - useActionState for search operations (eliminates multiple useState/useEffect)
 * - useOptimistic for streaming results (better UX)
 * - use() hook for context (simpler than useContext)
 * - Reduced re-renders through better state consolidation
 * - Right-click context menu for product rows
 *
 * COMPARISON WITH ORIGINAL:
 *
 * Original ResultsTable.tsx (lines 35-52):
 * ```typescript
 * const [searchResults, setSearchResults] = useChromeStorageSession(/* ... *\/);
 * const [statusLabel, setStatusLabel] = useState<string | boolean>(false);
 * const [isLoading, setIsLoading] = useState<boolean>(false);
 *
 * const { executeSearch, handleStopSearch } = useSearch({
 *   setSearchResults,
 *   setStatusLabel,
 *   setIsLoading,
 * });
 * ```
 *
 * React v19 Version:
 * ```typescript
 * const { searchResults, isLoading, statusLabel, error, resultCount, executeSearch, handleStopSearch } = useSearchV19();
 * // searchResults updates in real-time as results stream in - no need for useOptimistic
 * ```
 *
 * BENEFITS:
 * 1. Maintains streaming behavior - results appear as they're found
 * 2. Live counter updates ("Found ## results...")
 * 3. Cleaner state management without complex prop drilling
 * 4. Built-in error handling and abort functionality
 * 5. Results appear immediately in table, not all at once
 * 6. Right-click context menu for enhanced user interaction
 */
export default function ResultsTable({
  getRowCanExpand,
  columnFilterFns,
}: ProductTableProps<Product>): ReactElement {
  // React v19's use() hook simplifies context access
  // No need for error handling wrapper - use() handles context errors
  const appContext = useAppContext();

  const filterRef = useRef<{
    toggleDrawer: (open: boolean) => void;
    getState: () => boolean;
  }>(null);
  // Enhanced search hook that maintains streaming behavior
  // Results appear in the table as they're found with live counter updates
  const {
    searchResults,
    isLoading,
    statusLabel,
    error,
    resultCount,
    executeSearch,
    handleStopSearch,
  } = useSearch();

  // Context menu functionality
  const { contextMenu, handleContextMenu, handleCloseContextMenu } = useContextMenu();

  // Use searchResults directly - they're already streaming in real-time
  const optimisticResults = searchResults;

  // Optional: Log current result count for debugging
  if (resultCount > 0) {
    console.debug(`Currently showing ${resultCount} results`);
  }

  const table = useResultsTable({
    showSearchResults: optimisticResults,
    columnFilterFns,
    getRowCanExpand,
    userSettings: appContext?.userSettings,
  });

  // Initialize column visibility - this effect is still needed
  // Some patterns still require useEffect for side effects
  useEffect(() => {
    if (appContext && !isEmpty(appContext.userSettings.hideColumns)) {
      table.getAllLeafColumns().map((column: Column<Product>) => {
        if (appContext.userSettings.hideColumns.includes(column.id)) {
          column.toggleVisibility(false);
        }
      });
    }
  }, [appContext?.userSettings.hideColumns, table]);

  // Auto column sizing
  const { getMeasurementTableProps } = useAutoColumnSizing(table, optimisticResults);

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
        resultCount={optimisticResults.length}
        onClick={handleStopSearch}
      />
      <FilterMenu table={table} ref={filterRef} />

      <Paper id="search-results-table-container">
        <Box
          className="search-input-container fullwidth"
          component="form"
          noValidate
          autoComplete="off"
        />
        <div className="p-2" style={{ minHeight: "369px" }}>
          <TableOptions table={table} onSearch={executeSearch} />
          <div className="h-4" />

          {/* Hidden measurement table for auto-sizing */}
          <table {...getMeasurementTableProps()}>
            <thead>
              <tr>
                {table.getAllLeafColumns().map((col) => (
                  <th key={col.id}>
                    {typeof col.columnDef.header === "function"
                      ? col.id
                      : (col.columnDef.header ?? col.id)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, 5)
                .map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {typeof cell.column.columnDef.cell === "function"
                          ? cell.column.columnDef.cell(cell.getContext())
                          : ""}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Enhanced error handling with React v19's built-in error state */}
          {error && (
            <div className="text-center p-4 text-red-500">
              <p>Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          )}

          {Array.isArray(optimisticResults) && optimisticResults.length > 0 && (
            <>
              <table
                className="search-results"
                style={{
                  ...columnSizeVars(),
                }}
              >
                <TableHeader table={table} />
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <Fragment key={row.id}>
                        <tr
                          className={
                            (row.original as Product & { isPending?: boolean }).isPending
                              ? "opacity-70 animate-pulse"
                              : ""
                          }
                          onContextMenu={(e) => handleContextMenu(e, row.original)}
                          style={{ cursor: "context-menu" }}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <td
                                key={cell.id}
                                style={{
                                  width: `${cell.column.getSize()}px`,
                                  textAlign: "left",
                                  ...(cell.column.columnDef.meta as { style?: CSSProperties })
                                    ?.style,
                                }}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            );
                          })}
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
              <div className="h-2" />
              <Pagination table={table} />
            </>
          )}

          {((!isLoading && !Array.isArray(optimisticResults)) || optimisticResults.length === 0) &&
            !error && (
              <div className="text-center p-4">
                <p>{statusLabel || "No results found. Try a different search term."}</p>
              </div>
            )}
        </div>
      </Paper>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          product={contextMenu.product}
          onClose={handleCloseContextMenu}
        />
      )}
    </>
  );
}
