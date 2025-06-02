/**
 * Example Usage:
 *
 * // Define your data type
 * interface UserSettings {
 *   theme: 'light' | 'dark';
 *   fontSize: number;
 *   notifications: boolean;
 *   lastUpdated: string;
 * }
 *
 * // Create an ODM instance for user settings
 * const settingsODM = createLocalStorageODM<UserSettings>('user-settings', {
 *   theme: 'light',
 *   fontSize: 14,
 *   notifications: true,
 *   lastUpdated: new Date().toISOString()
 * });
 *
 * // Get all settings
 * const settings = settingsODM.getData();
 * console.log('Current settings:', settings);
 *
 * // Update specific fields
 * await settingsODM.update({
 *   theme: 'dark',
 *   fontSize: 16
 * });
 *
 * // Get a specific setting
 * const currentTheme = settingsODM.get('theme');
 *
 * // Set a specific field
 * await settingsODM.setField('notifications', false);
 *
 * // Subscribe to changes
 * const unsubscribe = settingsODM.subscribe((newSettings) => {
 *   console.log('Settings changed:', newSettings);
 * });
 *
 * // Later, unsubscribe from changes
 * unsubscribe();
 *
 * // Clear all settings
 * await settingsODM.clear();
 *
 * // Example with array data
 * interface TodoItem {
 *   id: string;
 *   text: string;
 *   completed: boolean;
 * }
 *
 * interface TodoList {
 *   items: TodoItem[];
 *   filter: 'all' | 'active' | 'completed';
 * }
 *
 * const todoODM = createSyncStorageODM<TodoList>('todos', {
 *   items: [],
 *   filter: 'all'
 * });
 *
 * // Add a todo
 * await todoODM.update({
 *   items: [...todoODM.getData().items, {
 *     id: Date.now().toString(),
 *     text: 'Learn Chrome Storage ODM',
 *     completed: false
 *   }]
 * });
 *
 * // Toggle todo completion
 * const todos = todoODM.getData();
 * await todoODM.update({
 *   items: todos.items.map(item =>
 *     item.id === '123'
 *       ? { ...item, completed: !item.completed }
 *       : item
 *   )
 * });
 */

/**
 * Example Usage for User Settings:
 *
 * // Define the settings interface with all possible user preferences
 * interface UserPreferences {
 *   // Display settings
 *   theme: 'light' | 'dark' | 'system';
 *   fontSize: number;
 *   language: string;
 *   timezone: string;
 *
 *   // Location and currency
 *   location: {
 *     country: string;
 *     state?: string;
 *     city?: string;
 *     postalCode?: string;
 *   };
 *   currency: {
 *     code: string;  // e.g., 'USD', 'EUR'
 *     symbol: string; // e.g., '$', '€'
 *     decimals: number;
 *   };
 *
 *   // Search preferences
 *   searchSettings: {
 *     defaultSupplier: string;
 *     maxResults: number;
 *     autoSearch: boolean;
 *     showPrices: boolean;
 *     sortBy: 'price' | 'name' | 'relevance';
 *   };
 *
 *   // Notification settings
 *   notifications: {
 *     enabled: boolean;
 *     priceAlerts: boolean;
 *     stockUpdates: boolean;
 *     emailDigest: boolean;
 *   };
 *
 *   // Last updated timestamp
 *   lastUpdated: string;
 * }
 *
 * // Create a settings manager
 * const userSettings = createSyncStorageODM<UserPreferences>('user-preferences', {
 *   theme: 'system',
 *   fontSize: 14,
 *   language: 'en-US',
 *   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
 *   location: {
 *     country: 'US',
 *   },
 *   currency: {
 *     code: 'USD',
 *     symbol: '$',
 *     decimals: 2
 *   },
 *   searchSettings: {
 *     defaultSupplier: 'all',
 *     maxResults: 20,
 *     autoSearch: true,
 *     showPrices: true,
 *     sortBy: 'relevance'
 *   },
 *   notifications: {
 *     enabled: true,
 *     priceAlerts: true,
 *     stockUpdates: false,
 *     emailDigest: false
 *   },
 *   lastUpdated: new Date().toISOString()
 * });
 *
 * // Usage examples:
 *
 * // 1. Update multiple settings at once
 * await userSettings.update({
 *   theme: 'dark',
 *   fontSize: 16,
 *   'searchSettings.maxResults': 50
 * });
 *
 * // 2. Update nested settings
 * await userSettings.update({
 *   searchSettings: {
 *     ...userSettings.getData().searchSettings,
 *     sortBy: 'price',
 *     autoSearch: false
 *   }
 * });
 *
 * // 3. Update location and currency together
 * await userSettings.update({
 *   location: {
 *     country: 'CA',
 *     state: 'ON',
 *     city: 'Toronto'
 *   },
 *   currency: {
 *     code: 'CAD',
 *     symbol: 'C$',
 *     decimals: 2
 *   }
 * });
 *
 * // 4. Toggle notification settings
 * const currentSettings = userSettings.getData();
 * await userSettings.update({
 *   notifications: {
 *     ...currentSettings.notifications,
 *     priceAlerts: !currentSettings.notifications.priceAlerts
 *   }
 * });
 *
 * // 5. Subscribe to settings changes
 * const unsubscribe = userSettings.subscribe((newSettings) => {
 *   // Update UI when settings change
 *   document.documentElement.setAttribute('data-theme', newSettings.theme);
 *   document.documentElement.style.fontSize = `${newSettings.fontSize}px`;
 *
 *   // Update currency display
 *   updateCurrencyDisplay(newSettings.currency);
 *
 *   // Update search behavior
 *   updateSearchBehavior(newSettings.searchSettings);
 * });
 *
 * // 6. Get specific settings
 * const currentTheme = userSettings.get('theme');
 * const searchPrefs = userSettings.get('searchSettings');
 * const isDarkMode = currentTheme === 'dark' ||
 *   (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
 *
 * // 7. Reset to defaults
 * const defaultSettings: UserPreferences = {
 *   // ... default values ...
 * };
 * await userSettings.set(defaultSettings);
 *
 * // 8. Clear all settings
 * await userSettings.clear();
 */

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

export class ChromeStorageODM<T extends Record<string, unknown>> {
  private storage: StorageArea;
  private promisified: ReturnType<typeof promisifiedStorage>;
  private storageKey: string;
  private data: T;

  constructor(storageArea: StorageArea, storageKey: string, initialData: T) {
    this.storage = storageArea;
    this.promisified = promisifiedStorage(storageArea);
    this.storageKey = storageKey;
    this.data = initialData;
    this.load();
  }

  private async load(): Promise<void> {
    try {
      const result = await this.promisified.get(this.storageKey);
      if (result[this.storageKey]) {
        this.data = result[this.storageKey] as T;
      }
    } catch (error) {
      console.error(`Failed to load data for ${this.storageKey}:`, error);
    }
  }

  private async save(): Promise<void> {
    try {
      await this.promisified.set({ [this.storageKey]: this.data });
    } catch (error) {
      console.error(`Failed to save data for ${this.storageKey}:`, error);
      throw error;
    }
  }

  /**
   * Get the current data
   */
  getData(): T {
    return this.data;
  }

  /**
   * Update specific fields in the data
   */
  async update(updates: Partial<T>): Promise<void> {
    this.data = { ...this.data, ...updates };
    await this.save();
  }

  /**
   * Set the entire data object
   */
  async set(data: T): Promise<void> {
    this.data = data;
    await this.save();
  }

  /**
   * Get a specific field from the data
   */
  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  /**
   * Set a specific field in the data
   */
  async setField<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    this.data[key] = value;
    await this.save();
  }

  /**
   * Clear all data and reset to initial state
   */
  async clear(): Promise<void> {
    this.data = {} as T;
    await this.save();
  }

  /**
   * Subscribe to changes in the data
   */
  subscribe(callback: (newData: T) => void): () => void {
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[this.storageKey]) {
        this.data = changes[this.storageKey].newValue as T;
        callback(this.data);
      }
    };
    this.storage.onChanged.addListener(listener);
    return () => this.storage.onChanged.removeListener(listener);
  }
}

// Create promisified versions of storage methods
const promisifiedStorage = (storage: StorageArea) => ({
  set: chromePromisify<void>(storage.set.bind(storage)),
  get: chromePromisify<Record<string, unknown>>(storage.get.bind(storage)),
  remove: chromePromisify<void>(storage.remove.bind(storage)),
  clear: chromePromisify<void>(storage.clear.bind(storage)),
});

// Factory functions with type parameters
export const createLocalStorageODM = <T extends Record<string, unknown>>(
  key: string,
  initialData: T,
) => new ChromeStorageODM<T>(chrome.storage.local, key, initialData);

export const createSyncStorageODM = <T extends Record<string, unknown>>(
  key: string,
  initialData: T,
) => new ChromeStorageODM<T>(chrome.storage.sync, key, initialData);

export const createSessionStorageODM = <T extends Record<string, unknown>>(
  key: string,
  initialData: T,
) => new ChromeStorageODM<T>(chrome.storage.session, key, initialData);
