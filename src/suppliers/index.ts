/**
 * Supplier module that exports various supplier implementations.
 * This module serves as a central point for accessing different chemical supplier classes.
 *
 * Each supplier class implements specific logic for querying and parsing product data
 * from their respective e-commerce sites.
 *
 * @module Suppliers
 *
 * @example
 * ```typescript
 * import { registerSuppliers, supplierRegistry } from './suppliers';
 *
 * // Register all suppliers
 * registerSuppliers();
 *
 * // Get a specific supplier
 * const CarolinaClass = supplierRegistry.get('SupplierCarolina');
 * if (CarolinaClass) {
 *   const carolina = new CarolinaClass('Sodium Hydroxide', 10, new AbortController());
 * }
 * ```
 */

export { default as registerSuppliers } from "./registerSuppliers";
export { default as SupplierBase } from "./supplierBase";
export { default as SupplierFactory } from "./supplierFactory";
export { default as supplierRegistry } from "./supplierRegistry";

// Export supplier implementations for direct access if needed
export { default as SupplierBioFuranChem } from "./supplierBiofuranChem";
export { default as SupplierBunmurraLabs } from "./supplierBunmurraLabs";
export { default as SupplierCarolina } from "./supplierCarolina";
export { default as SupplierFtfScientific } from "./supplierFtfScientific";
export { default as SupplierHbarSci } from "./supplierHbarSci";
export { default as SupplierLaballey } from "./supplierLaballey";
export { default as SupplierLaboratoriumDiscounter } from "./supplierLaboratoriumDiscounter";
