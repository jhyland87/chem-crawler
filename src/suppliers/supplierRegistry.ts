import { type SupplierConstructor } from "types/supplier";

/**
 * Singleton registry for managing supplier class registrations.
 * Provides a central location for registering and retrieving supplier implementations.
 *
 * @example
 * ```typescript
 * // Register a new supplier
 * SupplierRegistry.register("MySupplier", MySupplierClass);
 *
 * // Get a registered supplier
 * const SupplierClass = SupplierRegistry.get("MySupplier");
 *
 * // Check if a supplier is registered
 * const exists = SupplierRegistry.has("MySupplier");
 *
 * // Get list of registered suppliers
 * const suppliers = SupplierRegistry.getRegisteredSuppliers();
 * ```
 */
class SupplierRegistry {
  private static instance: SupplierRegistry;
  private suppliers: Map<string, SupplierConstructor>;

  private constructor() {
    this.suppliers = new Map();
  }

  /**
   * Get the singleton instance of the registry
   */
  public static getInstance(): SupplierRegistry {
    if (!SupplierRegistry.instance) {
      SupplierRegistry.instance = new SupplierRegistry();
    }
    return SupplierRegistry.instance;
  }

  /**
   * Register a supplier class with the registry
   * @param name - Name to register the supplier under
   * @param supplierClass - The supplier class constructor
   */
  public register(name: string, supplierClass: SupplierConstructor): void {
    this.suppliers.set(name, supplierClass);
  }

  /**
   * Get a supplier class by name
   * @param name - Name of the supplier to retrieve
   * @returns The supplier class constructor or undefined if not found
   */
  public get(name: string): SupplierConstructor | undefined {
    return this.suppliers.get(name);
  }

  /**
   * Check if a supplier is registered
   * @param name - Name of the supplier to check
   * @returns true if supplier is registered, false otherwise
   */
  public has(name: string): boolean {
    return this.suppliers.has(name);
  }

  /**
   * Get list of registered supplier names
   * @returns Array of registered supplier names
   */
  public getRegisteredSuppliers(): string[] {
    return Array.from(this.suppliers.keys());
  }

  /**
   * Clear all registered suppliers
   */
  public clear(): void {
    this.suppliers.clear();
  }
}

// Export singleton instance
export default SupplierRegistry.getInstance();
