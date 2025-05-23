import SupplierBioFuranChem from "./supplierBiofuranChem";
import SupplierBunmurraLabs from "./supplierBunmurraLabs";
import SupplierCarolina from "./supplierCarolina";
import SupplierFtfScientific from "./supplierFtfScientific";
import SupplierHbarSci from "./supplierHbarSci";
import SupplierLaballey from "./supplierLaballey";
import SupplierLaboratoriumDiscounter from "./supplierLaboratoriumDiscounter";
import supplierRegistry from "./supplierRegistry";

// Keep track of registration state
let _isRegistered = false;

/**
 * Register all available suppliers with the registry.
 * This function should be called during application initialization.
 *
 * @example
 * ```typescript
 * // In your app's entry point
 * import { registerSuppliers } from './suppliers/registerSuppliers';
 *
 * // Make sure to call this before using any supplier functionality
 * registerSuppliers();
 * ```
 */
export function registerSuppliers(): void {
  if (_isRegistered) {
    return;
  }

  // Clear any existing registrations to prevent duplicates
  supplierRegistry.clear();

  // Register suppliers in a predictable order
  const suppliers = [
    ["SupplierBioFuranChem", SupplierBioFuranChem],
    ["SupplierBunmurraLabs", SupplierBunmurraLabs],
    ["SupplierCarolina", SupplierCarolina],
    ["SupplierFtfScientific", SupplierFtfScientific],
    ["SupplierHbarSci", SupplierHbarSci],
    ["SupplierLaballey", SupplierLaballey],
    ["SupplierLaboratoriumDiscounter", SupplierLaboratoriumDiscounter],
  ] as const;

  // Register each supplier
  for (const [name, SupplierClass] of suppliers) {
    supplierRegistry.register(name, SupplierClass);
  }

  _isRegistered = true;
}

/**
 * Check if suppliers have been registered
 * @returns true if suppliers are registered, false otherwise
 */
export function isRegistered(): boolean {
  return _isRegistered;
}

// Export a function to reset registration state (useful for testing)
export function resetRegistration(): void {
  _isRegistered = false;
  supplierRegistry.clear();
}

export default registerSuppliers;
