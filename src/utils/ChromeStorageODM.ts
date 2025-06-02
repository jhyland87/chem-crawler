type StorageArea = chrome.storage.StorageArea;

// Custom promisify for Chrome storage
const chromePromisify = <T>(fn: (...args: any[]) => void): ((...args: any[]) => Promise<T>) => {
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      fn(...args, (result: T) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
};

// Create promisified versions of storage methods
const promisifiedStorage = (storage: StorageArea) => ({
  set: chromePromisify<void>(storage.set.bind(storage)),
  get: chromePromisify<Record<string, unknown>>(storage.get.bind(storage)),
  remove: chromePromisify<void>(storage.remove.bind(storage)),
  clear: chromePromisify<void>(storage.clear.bind(storage)),
  getBytesInUse: chromePromisify<number>(storage.getBytesInUse.bind(storage)),
});

export class ChromeStorageODM {
  private storage: StorageArea;
  private promisified: ReturnType<typeof promisifiedStorage>;

  constructor(storageArea: StorageArea) {
    this.storage = storageArea;
    this.promisified = promisifiedStorage(storageArea);
  }

  /**
   * Set a value in storage
   * @param key The key to store the value under
   * @param value The value to store
   * @returns Promise that resolves when the operation is complete
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await this.promisified.set({ [key]: value });
    } catch (error) {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      throw error;
    }
  }

  /**
   * Get a value from storage
   * @param key The key to retrieve
   * @returns Promise that resolves with the value, or undefined if not found
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const result = await this.promisified.get(key);
      return result[key] as T;
    } catch (error) {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      throw error;
    }
  }

  /**
   * Remove a value from storage
   * @param key The key to remove
   * @returns Promise that resolves when the operation is complete
   */
  async remove(key: string): Promise<void> {
    try {
      await this.promisified.remove(key);
    } catch (error) {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      throw error;
    }
  }

  /**
   * Clear all values from storage
   * @returns Promise that resolves when the operation is complete
   */
  async clear(): Promise<void> {
    try {
      await this.promisified.clear();
    } catch (error) {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      throw error;
    }
  }

  /**
   * Get all values from storage
   * @returns Promise that resolves with all stored values
   */
  async getAll<T>(): Promise<Record<string, T>> {
    try {
      const result = await this.promisified.get(null);
      return result as Record<string, T>;
    } catch (error) {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      throw error;
    }
  }

  /**
   * Get the number of bytes being used by storage
   * @returns Promise that resolves with the number of bytes used
   */
  async getBytesInUse(): Promise<number> {
    try {
      return await this.promisified.getBytesInUse(null);
    } catch (error) {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      throw error;
    }
  }
}

// Convenience factory functions to create ODM instances
export const createLocalStorageODM = () => new ChromeStorageODM(chrome.storage.local);
export const createSyncStorageODM = () => new ChromeStorageODM(chrome.storage.sync);
export const createSessionStorageODM = () => new ChromeStorageODM(chrome.storage.session);
