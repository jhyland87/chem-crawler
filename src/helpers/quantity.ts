import { UOM, UOM_ALIASES } from "@/constants/common";

/**
 * @group Helpers
 * @groupDescription Quantity parsing and unit conversion utilities for handling different units of measurement.
 */

/**
 * Parses a quantity string into a structured object containing the numeric value and unit of measure.
 * Handles various formats including foreign number formats (e.g., 1.234,56).
 * Uses regex pattern matching to extract quantity and unit information.
 * @category Helpers
 * @param  value - The quantity string to parse (e.g., '100g', '120 grams')
 * @returns Object containing quantity and UOM, or undefined if parsing fails
 * @throws  If the quantity string cannot be parsed
 *
 * @example
 * ```typescript
 * parseQuantity('100g') // Returns { quantity: 100, uom: 'g' }
 * parseQuantity('120 grams') // Returns { quantity: 120, uom: 'grams' }
 * parseQuantity('43.4 ounce') // Returns { quantity: 43.4, uom: 'ounce' }
 * parseQuantity('1200 milliliters') // Returns { quantity: 1200, uom: 'milliliters' }
 * parseQuantity('1.2 L') // Returns { quantity: 1.2, uom: 'L' }
 * ```
 *
 * @see https://regex101.com/r/Ruid54/5
 */
export function parseQuantity(value: string): QuantityObject | void {
  if (!value) return;

  const quantityPattern = new RegExp(
    "(?<quantity>\\d+(?:[.,\\s]\\d+)*)\\s?" +
      "(?<uom>(?:milli|kilo|centi)?(?:ounce|g(?:allon|ram|al)" +
      "|pound|quart|qt|piece|pc|lb|(?:met|lit)[re]{2})s?" +
      "|oz|k[mg]?|g|l|[cm]?[glm])s?(?![A-Za-z])",
    "i",
  );
  const quantityMatch = value.match(quantityPattern);

  if (!quantityMatch?.groups?.quantity || !quantityMatch?.groups?.uom) return;

  let parsedQuantity: string | number = quantityMatch.groups.quantity;

  // Handle foreign number formats where commas and decimals are swapped
  if (parsedQuantity.match(/^(\d+\.\d+,\d{1,2}|\d{1,3},\d{1,2}|\d{1,3},\d{1,2})$/))
    parsedQuantity = parsedQuantity
      .replaceAll(".", "xx")
      .replaceAll(",", ".")
      .replaceAll("xx", ",");

  const uom = standardizeUom(quantityMatch.groups.uom);
  const quantity = parseFloat(parsedQuantity.replace(/,/g, ""));

  if (uom && quantity) return { quantity, uom } satisfies QuantityObject;
}

/**
 * Strips the quantity from a string. This is useful for when some suppliers don't have products
 * listed as variants, but instead have multiple products with a quantity in the name. Using this
 * function, we can get the name of the product without the quantity, which may be identical to
 * the other variations. Making it easy to group the products into a single listing with multiple
 * variants.
 * @category Helpers
 * @param value - The string to strip the quantity from
 * @returns The string with the quantity removed
 * @example
 * ```typescript
 * stripQuantityFromString("Some reagent - 100g") // Returns "Some reagent -"
 * stripQuantityFromString("120 grams, of some reagent") // Returns "of some reagent"
 * stripQuantityFromString("43.4 ounce of some reagent") // Returns "ounce of some reagent"
 * stripQuantityFromString("1200 milliliters of some reagent") // Returns "milliliters of some reagent"
 * stripQuantityFromString("1.2 L of some reagent") // Returns "L of some reagent"
 * ```
 * @see https://regex101.com/delete/7/TztEFjdT1JIZPzagNUUUI991RznPQdvbzcgI
 */
export function stripQuantityFromString(value: string): string {
  if (!value || typeof value !== "string") return value;

  const quantityPattern = new RegExp(
    "(?<quantity>[1-9][0-9]*(?:[.,\\s]\\d+)*)\\s?" +
      "(?<uom>(?:milli|kilo|centi)?(?:ounce|g(?:allon|ram|al)" +
      "|pound|quart|qt|piece|pc|lb|(?:met|lit)[re]{2})s?" +
      "|oz|k[mg]?|g|l|[cm]?[glm])s?(?![A-Za-z])",
    "ig",
  );

  return value.replace(quantityPattern, "").trim();
}

/**
 * Checks if a value is a QuantityObject.
 *
 * @category Helpers
 * @param value - The value to check
 * @returns True if the value is a QuantityObject, false otherwise
 */
export function isQuantityObject(value: unknown): value is QuantityObject {
  return (
    value !== null &&
    typeof value === "object" &&
    "quantity" in value &&
    "uom" in value &&
    typeof value.quantity === "number" &&
    typeof value.uom === "string"
  );
}

/**
 * Standardizes a unit of measure (UOM) to its canonical form.
 * Uses the uomAliases mapping to convert various representations to standard forms.
 * @category Helpers
 * @param uom - The unit of measure to standardize
 * @returns The standardized UOM, or undefined if not recognized
 *
 * @example
 * ```typescript
 * standardizeUom('qt') // Returns 'quart'
 * standardizeUom('kg') // Returns 'kilogram'
 * standardizeUom('kilograms') // Returns 'kilogram'
 * standardizeUom('lb') // Returns 'pound'
 * standardizeUom('Grams') // Returns 'gram'
 * ```
 */
export function standardizeUom(uom: string): UOM | void {
  const uomMap = Object.entries(UOM_ALIASES).reduce(
    (acc, [uom, aliases]) => {
      aliases.forEach((alias: string) => {
        acc[alias] = uom;
      });
      return acc;
    },
    { [uom]: uom } as Record<string, string>,
  );

  if (uom.toLowerCase() in uomMap) return uomMap[uom.toLowerCase()] as UOM;
}

/**
 * Converts a quantity from its current unit to a common unit of mass or volume.
 * This is to make it easier to compare quantities of different units.
 * @category Helpers
 * @param quantity - The quantity to convert
 * @param unit - The unit of measure of the quantity
 * @returns The converted quantity in its base unit
 *
 * @example
 * ```typescript
 * toBaseQuantity(1, UOM.KM) // Returns 1000 (meters)
 * toBaseQuantity(1, UOM.LB) // Returns 453.592 (grams)
 * toBaseQuantity(1, UOM.G) // Returns 1 (no conversion needed)
 * ```
 */
export function toBaseQuantity(quantity: number, unit: UOM): number | void {
  if (typeof quantity !== "number") return;

  switch (unit) {
    // Solids, convert all to milligrams
    case UOM.MG:
      console.debug(`${quantity} ${UOM.MG} -> ${quantity} ${UOM.MG} (no conversion needed)`);
      return quantity;
    case UOM.G:
      console.debug(`${quantity} ${UOM.G} -> ${quantity * 1000} ${UOM.MG}`);
      return quantity * 1000;
    case UOM.KG:
      console.debug(`${quantity} ${UOM.KG} -> ${quantity * 1000000} ${UOM.MG}`);
      return quantity * 1000000;
    case UOM.LB:
      console.debug(`${quantity} ${UOM.LB} -> ${quantity * 453592} ${UOM.MG}`);
      return quantity * 453592;
    case UOM.OZ:
      console.debug(`${quantity} ${UOM.OZ} -> ${quantity * 28349.5} ${UOM.MG}`);
      return quantity * 28349.5;

    // Liquids, convert all to milliliters
    case UOM.ML:
      console.debug(`${quantity} ${UOM.ML} -> ${quantity} ${UOM.ML}`);
      return quantity;
    case UOM.L:
      console.debug(`${quantity} ${UOM.L} -> ${quantity * 1000} ${UOM.ML}`);
      return quantity * 1000;
    case UOM.QT:
      console.debug(`${quantity} ${UOM.QT} -> ${quantity * 946.353} ${UOM.ML}`);
      return quantity * 946.353;
    case UOM.GAL:
      console.debug(`${quantity} ${UOM.GAL} -> ${quantity * 3785.41} ${UOM.ML}`);
      return quantity * 3785.41;

    // Unsupported units
    default:
      console.debug(`${quantity} ${unit} -> ${quantity} ${unit} (no conversion found)`);
      return quantity;
  }
}
