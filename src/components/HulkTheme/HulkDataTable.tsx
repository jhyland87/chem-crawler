import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import "./HulkDataTable.scss";

interface TableData {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  salary: number;
}

const sampleData: TableData[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    joinDate: "2022-01-15",
    salary: 85000,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Product Manager",
    department: "Product",
    status: "active",
    joinDate: "2021-08-22",
    salary: 95000,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "UI/UX Designer",
    department: "Design",
    status: "active",
    joinDate: "2023-03-10",
    salary: 70000,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "DevOps Engineer",
    department: "Engineering",
    status: "pending",
    joinDate: "2023-11-05",
    salary: 80000,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Marketing Specialist",
    department: "Marketing",
    status: "inactive",
    joinDate: "2020-06-18",
    salary: 60000,
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Data Analyst",
    department: "Analytics",
    status: "active",
    joinDate: "2022-09-30",
    salary: 75000,
  },
  {
    id: 7,
    name: "Chris Taylor",
    email: "chris.taylor@example.com",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    joinDate: "2021-12-08",
    salary: 90000,
  },
  {
    id: 8,
    name: "Amanda White",
    email: "amanda.white@example.com",
    role: "HR Specialist",
    department: "Human Resources",
    status: "active",
    joinDate: "2023-02-14",
    salary: 65000,
  },
];

const StatusBadge: React.FC<{ status: TableData["status"] }> = ({ status }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "hulk-badge--success";
      case "inactive":
        return "hulk-badge--error";
      case "pending":
        return "hulk-badge--warning";
      default:
        return "hulk-badge--info";
    }
  };

  return (
    <span className={`hulk-badge ${getStatusClass(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const HulkDataTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<TableData>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <div className="hulk-table__name-cell">
            <div className="hulk-table__avatar">👤</div>
            <span>{getValue() as string}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <a href={`mailto:${getValue()}`} className="hulk-table__email-link">
            {getValue() as string}
          </a>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as TableData["status"]} />,
      },
      {
        accessorKey: "joinDate",
        header: "Join Date",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
      {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ getValue }) => (
          <span className="hulk-table__salary">${(getValue() as number).toLocaleString()}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="hulk-table__actions">
            <button
              className="hulk-btn-sm hulk-btn-primary"
              onClick={() => console.log("Edit:", row.original)}
            >
              ✏️
            </button>
            <button
              className="hulk-btn-sm hulk-btn-error"
              onClick={() => console.log("Delete:", row.original)}
            >
              🗑️
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: sampleData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="hulk-data-table">
      <div className="hulk-data-table__header">
        <div className="hulk-data-table__title-section">
          <h2 className="hulk-data-table__title">Employee Data</h2>
          <p className="hulk-data-table__subtitle">
            Manage your team members and their information
          </p>
        </div>

        <div className="hulk-data-table__controls">
          <div className="hulk-data-table__search">
            <input
              type="text"
              placeholder="Search employees..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="hulk-input hulk-data-table__search-input"
            />
            <span className="hulk-data-table__search-icon">🔍</span>
          </div>

          <button className="hulk-btn-gradient hulk-data-table__add-btn">➕ Add Employee</button>
        </div>
      </div>

      <div className="hulk-data-table__container">
        <table className="hulk-data-table__table">
          <thead className="hulk-data-table__thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="hulk-data-table__header-row">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="hulk-data-table__header-cell"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`hulk-data-table__header-content ${
                          header.column.getCanSort() ? "sortable" : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="hulk-data-table__sort-icon">
                            {{
                              asc: " ↑",
                              desc: " ↓",
                            }[header.column.getIsSorted() as string] ?? " ↕️"}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="hulk-data-table__tbody">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hulk-data-table__row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="hulk-data-table__cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="hulk-data-table__footer">
        <div className="hulk-data-table__info">
          <span>
            Showing{" "}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getPrePaginationRowModel().rows.length,
            )}{" "}
            of {table.getPrePaginationRowModel().rows.length} entries
          </span>
        </div>

        <div className="hulk-data-table__pagination">
          <button
            className="hulk-btn hulk-data-table__page-btn"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            ⏮️
          </button>

          <button
            className="hulk-btn hulk-data-table__page-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ⬅️
          </button>

          <div className="hulk-data-table__page-info">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>

          <button
            className="hulk-btn hulk-data-table__page-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ➡️
          </button>

          <button
            className="hulk-btn hulk-data-table__page-btn"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            ⏭️
          </button>
        </div>
      </div>
    </div>
  );
};
