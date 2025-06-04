import { HttpClient } from "@/utils/HttpClient";
import { beforeEach, describe, expect, it, vi } from "vitest";
import mockSearchResponse from "../../__mocks__/shopify-search.json";
import { MockShopifyStrategy } from "../__mocks__/MockShopifyStrategy";

// Mock the HttpClient
vi.mock("@/utils/HttpClient", () => ({
  HttpClient: vi.fn().mockImplementation(() => ({
    getJson: vi.fn().mockImplementation(() => Promise.resolve(mockSearchResponse)),
  })),
}));

describe("MockShopifyStrategy", () => {
  let strategy: MockShopifyStrategy;
  let httpClient: HttpClient;

  beforeEach(() => {
    strategy = new MockShopifyStrategy();
    httpClient = new HttpClient();
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with correct base URL and supplier name", () => {
      expect(strategy.baseURL).toBe("https://mock-shopify-supplier.com");
      expect(strategy.supplierName).toBe("MockShopify");
    });
  });

  describe("queryProducts", () => {
    it("should query products and return ProductBuilder instances", async () => {
      const results = await strategy.queryProducts("acid", 3);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results?.length).toBeLessThanOrEqual(3);

      // Verify the first product's basic info
      const firstProduct = results?.[0];
      expect(firstProduct).toBeDefined();
      if (firstProduct) {
        const builtProduct = (await firstProduct.build()) as globalThis.Product;
        expect(builtProduct.title).toBe("Formic Acid 90% Solution, Lab Grade");
        expect(builtProduct.price).toBe(100.1);
        expect(builtProduct.currency).toBe("USD");
        expect(builtProduct.sku).toBe("C7997-100g");
        expect(builtProduct.vendor).toBe("Post Apple");
        expect(builtProduct.supplier).toBe("MockShopify");
        expect(builtProduct.url).toBe(
          "https://mock-shopify-supplier.com/products/sulfamic-acid-acs",
        );
      }
    });

    it("should handle variants correctly", async () => {
      const results = await strategy.queryProducts("sulfuric acid", 1);

      expect(results).toBeDefined();
      const firstProduct = results?.[0];
      if (firstProduct) {
        const builtProduct = (await firstProduct.build()) as globalThis.Product;
        expect(builtProduct.variants).toBeDefined();
        expect(Array.isArray(builtProduct.variants)).toBe(true);

        // Check variant properties
        const variant = builtProduct.variants?.[0];
        expect(variant).toBeDefined();
        if (variant) {
          expect(variant.sku).toBeDefined();
          expect(variant.price).toBeDefined();
          expect(variant.title).toBeDefined();
          expect(variant.url).toBeDefined();
        }
      }
    });

    it("should handle empty search results", async () => {
      // Mock empty response
      vi.mocked(httpClient.getJson).mockResolvedValueOnce({
        totalItems: 0,
        startIndex: 0,
        itemsPerPage: 6,
        currentItemCount: 0,
        categoryStartIndex: 0,
        totalCategories: 0,
        pageStartIndex: 0,
        totalPages: 0,
        suggestions: [],
        categories: [],
        pages: [],
        items: [],
      });

      const results = await strategy.queryProducts("nonexistent product");
      expect(results).toHaveLength(0);
    });

    it("should handle invalid search responses", async () => {
      // Mock invalid response
      vi.mocked(httpClient.getJson).mockResolvedValueOnce({
        invalid: "response",
      } as unknown as typeof mockSearchResponse);

      const results = await strategy.queryProducts("thisshouldnotexist");
      expect(results).toHaveLength(0);
    });

    it("should apply fuzzy filtering to improve relevance", async () => {
      const results = await strategy.queryProducts("sulfuric", 5);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      // Verify that results are ordered by relevance
      if (results && results.length > 1) {
        const firstProduct = (await results[0].build()) as globalThis.Product;
        const secondProduct = (await results[1].build()) as globalThis.Product;

        // The first result should have a higher relevance score
        expect(firstProduct.title.toLowerCase()).toContain("sulfuric");
      }
    });
  });

  describe("getProductData", () => {
    it("should return the same ProductBuilder instance", async () => {
      const results = await strategy.queryProducts("sulfuric acid", 1);
      expect(results).toBeDefined();

      if (results && results.length > 0) {
        const builder = results[0];
        const enhancedBuilder = await strategy.getProductData(builder);

        expect(enhancedBuilder).toBe(builder); // Should be the same instance
        if (enhancedBuilder) {
          const product = (await enhancedBuilder.build()) as globalThis.Product;
          expect(product).toBeDefined();
        }
      }
    });
  });
});
