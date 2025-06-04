import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import ProductBuilder from "../../utils/ProductBuilder";
import searchResults from "../__mocks__/shopify-search.json";
import { MockShopifyStrategy } from "../strategies/__mocks__/MockShopifyStrategy";
import { ShopifyStrategy } from "../strategies/ShopifyStrategy";

describe("MockShopifyStrategy", () => {
  let strategy: ShopifyStrategy;

  beforeAll(() => {
    // Mock fetch to return our mock search data
    global.fetch = vi.fn().mockImplementation((url: string) => {
      // Check if this is a searchserverapi.com request
      if (url.includes("searchserverapi.com/getresults") && url.includes("q=")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(searchResults),
          status: 200,
        } as Response);
      }

      // For any other requests, throw an error
      throw new Error(`Unmocked fetch call to: ${url}`);
    });
  });

  beforeEach(() => {
    strategy = new MockShopifyStrategy();
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  describe("queryProducts", () => {
    it("should return mock search results", async () => {
      const results = await strategy.queryProducts("acid");

      // Verify fetch was called with correct URL and parameters
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/^https:\/\/searchserverapi\.com\/getresults\?.*q=acid.*$/),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Accept: "text/html,application/json",
            "User-Agent": "ChemCrawler/1.0",
          }),
        }),
      );

      expect(results).toBeDefined();
      if (!results) return;

      expect(results).toHaveLength(3);
      expect(results[1]).toBeInstanceOf(ProductBuilder);

      // Verify first product
      const firstProduct = await results[1].build();
      expect(firstProduct).toBeDefined();
      if (!firstProduct) return;

      expect(firstProduct.title).toBe("Acetic Acid Glacial, ACS Grade");
      expect(firstProduct.description).toContain("Acetic Acid Glacial");
      expect(firstProduct.price).toBe(95.62);
      expect(firstProduct.vendor).toBe("Lab Alley");
      expect(firstProduct.sku).toBe("AAA99-1L");
      expect(firstProduct.url).toContain("/products/acetic-acid-glacial-acs-grade");
      expect(firstProduct.variants).toBeDefined();
      if (!firstProduct.variants) return;
      console.log("firstProduct.variants:", firstProduct.variants);
      expect(firstProduct.variants).toHaveLength(1);
      expect(firstProduct.variants[0].sku).toBe("FAL90-500ML");
      expect(firstProduct.variants[0].price).toBe("84.0200");
    });

    it("should handle empty search results", async () => {
      const results = await strategy.queryProducts("nonexistent");
      expect(results).toHaveLength(0);
    });
  });
});
