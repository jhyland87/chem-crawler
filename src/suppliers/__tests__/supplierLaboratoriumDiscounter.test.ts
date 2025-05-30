import type { Product } from "@/types";
import eur_to_usd_rate from "../__fixtures__/common/eur-to-usd-rate.json";
import SupplierLaboratoriumDiscounter from "../supplierLaboratoriumDiscounter";

jest.mock("@/helpers/currency", () => ({
  toUSD: jest.fn(() => Promise.resolve(eur_to_usd_rate)),
  isParsedPrice: jest.fn(),
}));

// laboratoriumdiscounter/search-borohydride-limit-2.json
// laboratoriumdiscounter/search-borohydride-limit-4-raw-http-response.json
/**
 * @param fixture_name - The name of the fixture
 * @returns The fixture data
 */
const fixtureData = (supplier_name: string) => {
  return {
    httpGetJson: async (path: string) => {
      const fixtureName = path.replace(/^\//, "").replaceAll("/", "__") + ".json";
      const fixtueFile = `../__fixtures__/${supplier_name}/${fixtureName}`;
      const result = await import(fixtueFile);
      return result.default;
    },
    search: (query: string) => {
      return async (fixture_name?: string) => {
        try {
          const fixtueFile = `../__fixtures__/${supplier_name}/search-${query}-${fixture_name}.json`;
          console.log("looking for fixture", fixtueFile);
          const result = await import(fixtueFile);
          return result.default;
        } catch (error) {
          console.error("Error in search", error);
          return null;
        }
      };
    },
  };
};

process.env.LOG_LEVEL = "DEBUG";
const mockStorage: any = {};

const mockChromeStorage = {
  storage: {
    local: {
      set: jest.fn().mockImplementation((key, value) => {
        console.log("mock chrome.storage.local.set", key, value);
        mockStorage[key] = value;
      }),
      get: jest.fn().mockImplementation((key) => {
        console.log("mock chrome.storage.local.get", key);
        if (key in mockStorage) {
          return Promise.resolve(mockStorage[key]);
        }
        return Promise.resolve({});
      }),
    },
  },
};

Object.assign(global, { chrome: mockChromeStorage });

describe("SupplierLaboratoriumDiscounter", () => {
  const laboratoriumiscounter_fixtures = fixtureData("laboratoriumdiscounter");
  let borohydride_search: any;
  let borohydride_search_raw: any;

  let supplier: SupplierLaboratoriumDiscounter;
  let mockAbortController: AbortController;
  let getCachedResultsSpy: any;
  let httpGetJsonMock: any;

  beforeAll(() => {
    jest.spyOn(global.chrome.storage.local, "set").mockImplementation((data: any) => {
      const key = Object.keys(data)[0] as string;
      const value = (data as any)[key];
      mockStorage[key] = value as any;
    });
    jest.spyOn(global.chrome.storage.local, "get").mockImplementation((key: any) => {
      if (key in mockStorage) {
        return Promise.resolve(mockStorage);
      }
      return Promise.resolve({});
    });
  });
  beforeEach(() => {
    // Mock the global fetch function to handle both search and product detail requests
    global.fetch = jest.fn().mockImplementation((url) => {
      throw new Error("Fetch not mocked");
    });

    getCachedResultsSpy = jest.spyOn(SupplierLaboratoriumDiscounter.prototype, "_getCachedResults");
    httpGetJsonMock = jest
      .spyOn(SupplierLaboratoriumDiscounter.prototype, "_httpGetJson" as any)
      .mockImplementation(async (data: unknown) => {
        return await laboratoriumiscounter_fixtures.httpGetJson(data?.path as string);
      });

    mockAbortController = new AbortController();
  });

  describe("search", () => {
    beforeEach(async () => {
      borohydride_search = laboratoriumiscounter_fixtures.search("borohydride");
      borohydride_search_raw = await borohydride_search("results");
    });
    //supplier_search = laboratoriumiscounter_fixtures.search("borohydride", 4);

    describe("_getCachedResults", () => {
      it("should not have cached result on first call", async () => {
        supplier = new SupplierLaboratoriumDiscounter("borohydride", 4, mockAbortController);

        const results: Product[] = [];
        for await (const product of supplier) {
          results.push(product);
        }

        expect(getCachedResultsSpy).toHaveBeenCalledTimes(1);
        expect(httpGetJsonMock).toHaveBeenCalledTimes(5);
        expect(results).toHaveLength(4);
        expect(results.map((r) => r.id)).toEqual(borohydride_search_raw.map((r: any) => r.id));
        expect(results[0].title).toBeDefined();
      });

      it("should use cached result on second call", async () => {
        supplier = new SupplierLaboratoriumDiscounter("borohydride", 4, mockAbortController);

        const results: Product[] = [];
        for await (const product of supplier) {
          results.push(product);
        }

        expect(getCachedResultsSpy).toHaveBeenCalledTimes(2);
        expect(httpGetJsonMock).toHaveBeenCalledTimes(5);
        expect(results).toHaveLength(4);
      });
    });
  });
});
