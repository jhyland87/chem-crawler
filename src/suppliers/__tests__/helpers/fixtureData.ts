/**
 * Helper function to load fixture data for supplier tests
 * @param supplier_name - The name of the supplier directory containing fixtures
 * @returns Object with methods to load fixture data
 */
export const fixtureData = (supplier_name: string) => {
  return {
    httpGetJson: async (path: string) => {
      const fixtureName = path.replace(/^\//, "").replaceAll("/", "__") + ".json";
      const fixtueFile = `../../__fixtures__/${supplier_name}/${fixtureName}`;
      const result = await import(fixtueFile);
      return result.default;
    },
    search: (query: string) => {
      return async (fixture_name?: string) => {
        try {
          const fixtueFile = `../../__fixtures__/${supplier_name}/search-${query}-${fixture_name}.json`;
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
