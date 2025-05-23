import SupplierBase from "../suppliers/supplierBase";
import { type Product } from "./types";

/**
 * Constructor type for supplier classes
 */
export type SupplierConstructor = new (
  query: string,
  limit: number,
  controller: AbortController,
) => SupplierBase<unknown, Product>;

/**
 * Interface for supplier registry operations
 */
export interface ISupplierRegistry {
  register(name: string, supplierClass: SupplierConstructor): void;
  unregister(name: string): boolean;
  get(name: string): SupplierConstructor | undefined;
  has(name: string): boolean;
  getRegisteredSuppliers(): string[];
  getAllSuppliers(): Map<string, SupplierConstructor>;
  clear(): void;
}
