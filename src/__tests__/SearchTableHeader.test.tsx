import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { createColumnHelper, Table } from "@tanstack/react-table";
import { SettingsContext } from "../context";
import SearchTableHeader from "../components/SearchTableHeader";
import { Product, Settings } from "../types";

// Mock the table object that would be passed to SearchTableHeader
const createMockTable = (data: Product[] = []) => {
  const columnHelper = createColumnHelper<Product>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      meta: { filterVariant: "text" },
    }),
    columnHelper.accessor("price", {
      header: "Price",
      meta: { filterVariant: "range" },
    }),
    columnHelper.accessor("supplier", {
      header: "Supplier",
      meta: { filterVariant: "select" },
    }),
  ];

  return {
    getHeaderGroups: () => [{
      id: "header-group-1",
      headers: columns.map((col, index) => ({
        id: `header-${index}`,
        column: {
          id: col.id,
          columnDef: col,
          getCanSort: () => true,
          getToggleSortingHandler: () => () => { },
          getIsSorted: () => false,
          getCanFilter: () => true,
          getFilterValue: () => "",
          setFilterValue: jest.fn(),
          getSize: () => 100,
          resetSize: jest.fn(),
          getIsResizing: () => false,
        },
        getResizeHandler: () => () => { },
        getSize: () => 100,
        getContext: () => ({
          column: {
            id: col.id,
            columnDef: col,
            getCanSort: () => true,
            getToggleSortingHandler: () => () => { },
            getIsSorted: () => false,
            getCanFilter: () => true,
            getFilterValue: () => "",
            setFilterValue: jest.fn(),
            getSize: () => 100,
            resetSize: jest.fn(),
            getIsResizing: () => false,
          },
          header: {
            id: `header-${index}`,
            column: {
              id: col.id,
              columnDef: col,
            },
            getSize: () => 100,
          },
        }),
        colSpan: 1,
        isPlaceholder: false,
      })),
    }],
    options: {
      columns,
      data,
    },
  } as unknown as Table<Product>;
};

// Mock the settings context
const mockSettings: Settings = {
  showHelp: false,
  caching: true,
  autocomplete: true,
  currency: "USD",
  location: "",
  shipsToMyLocation: false,
  foo: "",
  jason: false,
  antoine: false,
  popupSize: "medium",
  autoResize: true,
  someSetting: false,
  suppliers: [],
  theme: "light",
  showAllColumns: true,
  hideColumns: [],
  showColumnFilters: true,
};

// Wrapper component to provide context and proper table structure
const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <SettingsContext.Provider value={{ settings: mockSettings, setSettings: jest.fn() }}>
      <table>
        {ui}
        <tbody>
          <tr>
            <td>Test content</td>
          </tr>
        </tbody>
      </table>
    </SettingsContext.Provider>
  );
};

describe("SearchTableHeader", () => {
  const mockData: Product[] = [
    {
      title: "Product 1",
      price: 100,
      supplier: "Supplier A",
      url: "http://example.com/1",
      displayPrice: "$100"
    },
    {
      title: "Product 2",
      price: 200,
      supplier: "Supplier B",
      url: "http://example.com/2",
      displayPrice: "$200"
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all column headers", () => {
    const mockTable = createMockTable(mockData);
    renderWithContext(<SearchTableHeader table={mockTable} />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByText("Supplier")).toBeInTheDocument();
  });

  it("renders filter inputs when showColumnFilters is true", () => {
    const mockTable = createMockTable(mockData);
    renderWithContext(<SearchTableHeader table={mockTable} />);

    // Should find text input for Title column
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();

    // Should find range inputs for Price column
    const numberInputs = screen.getAllByDisplayValue("");
    const rangeInputs = numberInputs.filter(input => input.getAttribute("type") === "number");
    expect(rangeInputs).toHaveLength(2);
    expect(rangeInputs[0]).toHaveAttribute("type", "number");
    expect(rangeInputs[1]).toHaveAttribute("type", "number");

    // Should find select input for Supplier column
    const select = screen.getByText("All").closest("select");
    expect(select).toBeInTheDocument();
  });

  it("does not render filters when showColumnFilters is false", () => {
    const mockTable = createMockTable(mockData);
    mockSettings.showColumnFilters = false;

    renderWithContext(<SearchTableHeader table={mockTable} />);

    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
    const numberInputs = screen.queryAllByDisplayValue("");
    const rangeInputs = numberInputs.filter(input => input.getAttribute("type") === "number");
    expect(rangeInputs).toHaveLength(0);
    expect(screen.queryByText("All")).not.toBeInTheDocument();
  });

  /*
  it("handles text filter input changes", () => {
    const mockTable = createMockTable(mockData);
    renderWithContext(<SearchTableHeader table={mockTable} />);

    const textInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(textInput, { target: { value: "test" } });

    // The actual filter value change is handled by the table instance
    // We just verify the input is interactive
    expect(textInput).toHaveValue("test");
  });

   it("handles range filter input changes", () => {
     const mockTable = createMockTable(mockData);
     renderWithContext(<SearchTableHeader table={mockTable} />);

     const numberInputs = screen.getAllByDisplayValue("");
     const rangeInputs = numberInputs.filter(input => input.getAttribute("type") === "number");
     fireEvent.change(rangeInputs[0], { target: { value: "50" } });
     fireEvent.change(rangeInputs[1], { target: { value: "150" } });

     expect(rangeInputs[0]).toHaveValue(50);
     expect(rangeInputs[1]).toHaveValue(150);
   });

     it("handles select filter changes", () => {
       const mockTable = createMockTable(mockData);
       renderWithContext(<SearchTableHeader table={mockTable} />);

       const select = screen.getByText("All").closest("select");
       fireEvent.change(select!, { target: { value: "Supplier A" } });

       expect(select).toHaveValue("Supplier A");
     });
   */
  /*
  it("populates select options with unique values from data", () => {
    const mockTable = createMockTable(mockData);
    renderWithContext(<SearchTableHeader table={mockTable} />);

    console.log(screen.debug());

    const select = screen.getByText("All").closest("select");
    const options = Array.from(select!.querySelectorAll("option"));

    // Should have "All" option plus unique supplier values
    expect(options).toHaveLength(3); // "All" + "Supplier A" + "Supplier B"
    expect(options[0]).toHaveValue(""); // "All" option
    expect(options[1]).toHaveValue("Supplier A");
    expect(options[2]).toHaveValue("Supplier B");
  });
  */
});