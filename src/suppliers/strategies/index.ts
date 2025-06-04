import { BiofuranChemStrategy } from "./BiofuranChemStrategy";
import { CarolinaChemicalStrategy } from "./CarolinaChemicalStrategy";
import { CarolinaStrategy } from "./CarolinaStrategy";
import { ChemsaversStrategy } from "./ChemsaversStrategy";
import { FtfScientificStrategy } from "./FtfScientificStrategy";
import { LaboratoriumDiscounterStrategy } from "./LaboratoriumDiscounterStrategy";
import { LibertySciStrategy } from "./LibertySciStrategy";
import { LoudwolfStrategy } from "./LoudwolfStrategy";
import { OnyxmetStrategy } from "./OnyxmetStrategy";
import type { SupplierStrategy } from "./SupplierStrategy";

/**
 * Registry mapping supplier names to their strategy classes.
 * This allows for dynamic creation of supplier strategies based on name.
 */
export const strategyRegistry = new Map<string, new () => SupplierStrategy<globalThis.Product>>([
  ["LaboratoriumDiscounter", LaboratoriumDiscounterStrategy],
  ["Chemsavers", ChemsaversStrategy],
  ["Loudwolf", LoudwolfStrategy],
  ["BiofuranChem", BiofuranChemStrategy],
  ["FTF Scientific", FtfScientificStrategy],
  ["Carolina Chemical", CarolinaChemicalStrategy],
  ["Liberty Scientific", LibertySciStrategy],
  ["Onyxmet", OnyxmetStrategy],
  ["Carolina", CarolinaStrategy],
]);

/**
 * Create a new strategy instance for the given supplier name.
 * @param supplierName - Name of the supplier to create a strategy for
 * @returns New strategy instance or undefined if supplier not found
 */
export function createStrategy(
  supplierName: string,
): SupplierStrategy<globalThis.Product> | undefined {
  const StrategyClass = strategyRegistry.get(supplierName);
  if (!StrategyClass) return undefined;
  return new StrategyClass();
}

export {
  BiofuranChemStrategy,
  CarolinaChemicalStrategy,
  CarolinaStrategy,
  ChemsaversStrategy,
  FtfScientificStrategy,
  LaboratoriumDiscounterStrategy,
  LibertySciStrategy,
  LoudwolfStrategy,
  OnyxmetStrategy,
};
export type { SupplierStrategy };
