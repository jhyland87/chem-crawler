import { type ProductObject, type QueryResponse } from "@/types/wix";
import SupplierBaseWix from "../supplierBaseWix";

// Mock implementation of SupplierBaseWix for testing
class MockWixSupplier extends SupplierBaseWix {
  public readonly supplierName = "Mock Wix Supplier";
  protected _baseURL = "https://mock-wix-supplier.com";
}

describe("SupplierBaseWix", () => {
  let mockSupplier: MockWixSupplier;
  let mockAbortController: AbortController;

  beforeEach(() => {
    global.fetch = jest.fn();
    mockAbortController = new AbortController();
    mockSupplier = new MockWixSupplier("test", 5, mockAbortController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("_setup", () => {
    it("should set access token from API response", async () => {
      const mockResponse = {
        apps: {
          ["1380b703-ce81-ff05-f115-39571d94dfcd"]: {
            instance: "mock-access-token",
          },
        },
      };

      // Note: content-type header must be kebab-case to match HTTP spec and for content-type package parsing
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { "content-type": "application/json" },
        }),
      );

      await mockSupplier["_setup"]();

      expect(mockSupplier["_accessToken"]).toBe("mock-access-token");
      expect(mockSupplier["_headers"]).toHaveProperty("Authorization", "mock-access-token");
    });
  });

  describe("_isValidSearchResponse", () => {
    it("should return true for valid Wix query response", () => {
      const validResponse: QueryResponse = {
        data: {
          catalog: {
            category: {
              numOfProducts: 0,
              productsWithMetaData: {
                list: [],
                totalCount: 0,
              },
            },
          },
        },
      };

      expect(mockSupplier["_isValidSearchResponse"](validResponse)).toBe(true);
    });

    it("should return false for invalid response", () => {
      const invalidResponse = {
        data: {
          catalog: {
            category: {},
          },
        },
      };

      expect(mockSupplier["_isValidSearchResponse"](invalidResponse)).toBe(false);
    });

    it("should return false for null response", () => {
      expect(mockSupplier["_isValidSearchResponse"](null)).toBe(false);
    });
  });

  describe("_isWixProduct", () => {
    it("should return true for valid Wix product", () => {
      const validProduct = {
        price: 10.99,
        name: "Test Product",
      };

      expect(mockSupplier["_isWixProduct"](validProduct)).toBe(true);
    });

    it("should return false for invalid product", () => {
      const invalidProduct = {
        name: "Test Product",
      };

      expect(mockSupplier["_isWixProduct"](invalidProduct)).toBe(false);
    });

    it("should return false for null product", () => {
      expect(mockSupplier["_isWixProduct"](null)).toBe(false);
    });
  });

  describe("_getGraphQLQuery", () => {
    it("should return the correct GraphQL query string", () => {
      const query = mockSupplier["_getGraphQLQuery"]();
      expect(typeof query).toBe("string");
      expect(query).toContain("getFilteredProductsWithHasDiscount");
      expect(query).toContain("productsWithMetaData");
      expect(query).toMatch(/mainCollectionId:\s?String!/);
    });
  });

  describe("_getGraphQLVariables", () => {
    it("should return correct correct datatype with correct values", () => {
      const variables = mockSupplier["_getGraphQLVariables"]("test");
      expect(variables).toBeDefined();
      expect(variables).toHaveProperty("mainCollectionId", "00000000-000000-000000-000000000001");
      expect(variables).toHaveProperty("limit", mockSupplier["_limit"]);
      expect(variables).toHaveProperty("filters");
      expect(variables).toHaveProperty("filters.term");
      expect(variables).toHaveProperty("filters.term.values[0]", "*test*");
    });

    it("should return object variables with custom limit", () => {
      const variables = mockSupplier["_getGraphQLVariables"]("test", 10);

      expect(variables).toBeDefined();
      expect(variables).toHaveProperty("mainCollectionId");
      expect(variables).toHaveProperty("limit", 10);
      expect(variables).toHaveProperty("filters.term.values[0]", "*test*");
    });
  });

  describe("_queryProducts", () => {
    it("should return products from valid API response", async () => {
      const mockProducts: ProductObject[] = [
        {
          id: "1",
          name: "Product 1",
          price: 10.99,
          productType: "physical",
          sku: "SKU1",
          isInStock: true,
          urlPart: "product-1",
          formattedPrice: "$10.99",
          brand: null,
          description: "Product 1 description",
          productItems: [],
          options: [],
        },
        {
          id: "2",
          name: "Product 2",
          price: 20.99,
          productType: "physical",
          sku: "SKU2",
          isInStock: true,
          urlPart: "product-2",
          formattedPrice: "$20.99",
          brand: null,
          description: "Product 2 description",
          productItems: [],
          options: [],
        },
      ];

      const mockResponse: QueryResponse = {
        data: {
          catalog: {
            category: {
              numOfProducts: mockProducts.length,
              productsWithMetaData: {
                list: mockProducts,
                totalCount: mockProducts.length,
              },
            },
          },
        },
      };

      // Note: content-type header must be kebab-case to match HTTP spec and for content-type package parsing
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { "content-type": "application/json" },
        }),
      );

      const products = await mockSupplier["_queryProducts"]("test");
      expect(products).toEqual(mockProducts);
    });

    it("should throw error for invalid API response", async () => {
      const invalidResponse = {
        data: {
          catalog: {
            category: {},
          },
        },
      };

      // Note: content-type header must be kebab-case to match HTTP spec and for content-type package parsing
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(invalidResponse), {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          headers: { "content-type": "application/json" },
        }),
      );

      await expect(mockSupplier["_queryProducts"]("test")).rejects.toThrow(
        "Invalid or empty Wix query response for test",
      );
    });
  });

  describe("_getProductData", () => {
    it("should return undefined for product without price", async () => {
      const product: ProductObject = {
        id: "1",
        price: 0,
        productItems: [],
        options: [],
        name: "Test Product",
        urlPart: "test-product",
        productType: "physical",
        sku: "SKU1",
        isInStock: true,
        formattedPrice: "$0.00",
        brand: null,
        description: "",
      };

      const result = await mockSupplier["_getProductData"](product);
      expect(result).toBeUndefined();
    });

    it("should process product with valid data", async () => {
      const product: ProductObject = {
        id: "1",
        price: 10.99,
        formattedPrice: "$10.99",
        name: "Test Product",
        urlPart: "test-product",
        description: "Test Description",
        productType: "physical",
        sku: "SKU1",
        isInStock: true,
        brand: null,
        productItems: [
          {
            id: "item1",
            optionsSelections: [1],
            price: 10.99,
            formattedPrice: "$10.99",
          },
        ],
        options: [
          {
            id: "option1",
            key: "quantity",
            title: "Quantity",
            optionType: "dropdown",
            selections: [
              {
                id: 1,
                key: "1",
                value: "1 g",
                description: "1 gram",
                inStock: true,
              },
            ],
          },
        ],
      };

      const result = await mockSupplier["_getProductData"](product);

      expect(result).toBeDefined();
      if (result) {
        expect(result.title).toBe("Test Product");
        expect(result.price).toBe(10.99);
        expect(result.description).toBe("Test Description");
        expect(result.url).toBe("https://mock-wix-supplier.com/product-page/test-product");
        expect(Array.isArray(result.variants)).toBe(true);
        expect(result.variants?.length).toBe(1);
        expect(result.variants?.[0]).toEqual(
          expect.objectContaining({
            quantity: 1,
            uom: "g",
          }),
        );
      }
    });
  });
});
