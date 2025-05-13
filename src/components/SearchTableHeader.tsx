import {
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

import { Column, ColumnDef, flexRender, Header, Table, HeaderGroup, RowData, ColumnMeta } from "@tanstack/react-table";
import DebouncedInput from "./Debounce";
import { CSSProperties } from "react";
import { Product, SettingsContextProps } from "../types";
import { useSettings } from "../context";

// Define our custom column metadata type
interface CustomColumnMeta<TData extends RowData, TValue> extends ColumnMeta<TData, TValue> {
  filterVariant?: "range" | "select" | "text";
  uniqueValues?: string[];
}

// Define the type for our filterable columns object
interface FilterableColumns {
  [key: string]: string[];
}

function Filter({ column }: { column: Column<Product> }) {
  const columnFilterValue = column.getFilterValue();

  const { filterVariant = "text" } = (column.columnDef.meta as CustomColumnMeta<Product, unknown>) ?? {};

  const baseInputStyle: CSSProperties = {
    colorScheme: "light",
  };

  return (
    filterVariant === "range" ?
      <div>
        <div className="flex space-x-2">
          {/* See faceted column filters example for min max values functionality */}
          <DebouncedInput
            type="number"
            color="secondary.light"
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                value,
                old?.[1],
              ])
            }
            placeholder={"Min"}
            className="w-24 border shadow rounded half-width-input"
            style={{
              ...baseInputStyle,
            }}
          />
          <DebouncedInput
            type="number"
            color="secondary.light"
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value,
              ])
            }
            placeholder={"Max"}
            className="w-24 border shadow rounded half-width-input"
            style={{
              ...baseInputStyle,
            }}
          />
        </div>
        <div className="h-1" />
      </div>
      : filterVariant === "select" ?
        <select
          className="full-width-input"
          color="secondary.light"
          onChange={(e) => column.setFilterValue(e.target.value)}
          value={columnFilterValue?.toString()}
          style={baseInputStyle}
        >
          {/* See faceted column filters example for dynamic select options */}
          <option value="">All</option>
          {(
            column.columnDef.meta as { uniqueValues?: string[] }
          )?.uniqueValues?.map((value: string) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        : <DebouncedInput
          className="w-36 border shadow rounded full-width-input"
          color="secondary.light"
          onChange={(value) => column.setFilterValue(value)}
          placeholder={"Search..."}
          type="text"
          style={baseInputStyle}
          value={(columnFilterValue ?? "") as string}
        />
    // See faceted column filters example for datalist search suggestions
  );
}

export default function SearchTableHeader({ table }: { table: Table<Product> }) {
  const settingsContext: SettingsContextProps = useSettings();
  // Get the columns that have filterable values (range, select)
  const filterableColumns = table.options.columns.reduce<FilterableColumns>(
    (accu, col: ColumnDef<Product, unknown>) => {
      const meta = col.meta as CustomColumnMeta<Product, unknown>;
      if (meta?.filterVariant && ["range", "select"].includes(meta.filterVariant)) {
        accu[col.id ?? ''] = [];
      }
      return accu;
    },
    {}
  );

  // Get the unique values for the filterable columns
  for (const row of table.options.data) {
    for (const col of Object.keys(filterableColumns)) {
      // Safely access the property by first converting to unknown
      const value = (row as unknown as Record<string, unknown>)[col];
      if (value && typeof value === 'string' && filterableColumns[col].indexOf(value) === -1) {
        filterableColumns[col].push(value);
      }
    }
  }

  return (
    <thead>
      {table
        .getHeaderGroups()
        .map((headerGroup: HeaderGroup<Product>) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: Header<Product, unknown>) => {
              // If the column has filterable values, populate the unique values for the column
              if (
                filterableColumns[header.id] !== undefined &&
                filterableColumns[header.id].length > 0
              ) {
                header.column.columnDef.meta = {
                  ...header.column.columnDef.meta,
                  uniqueValues: filterableColumns[header.id],
                } as CustomColumnMeta<Product, unknown>;
              }

              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={
                    {
                      width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      "--header-size": `${header.getSize()}px`,
                      "--col-size": `${header.column.getSize()}px`,
                    } as CSSProperties
                  }
                >
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        style={{ cursor: "col-resize" }}
                        onDoubleClick={header.column.resetSize}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                      />
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                        {{
                          asc: (
                            <ArrowDropUpIcon
                              fontSize="small"
                              style={{
                                fontSize: "1rem",
                                position: "absolute",
                              }}
                            />
                          ),
                          desc: (
                            <ArrowDropDownIcon
                              fontSize="small"
                              style={{
                                fontSize: "1rem",
                                position: "absolute",
                              }}
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>

                      {(
                        settingsContext.settings.showColumnFilters &&
                        header.column.getCanFilter()
                      ) ?
                        <div>
                          <Filter column={header.column} />
                        </div>
                        : null}
                    </>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
    </thead>
  );
}
