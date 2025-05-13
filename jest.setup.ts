// Import necessary modules
import '@testing-library/jest-dom';
import util from 'util';
import { ChromeStorageItems } from './src/types';
import jestChrome from 'jest-chrome';

// Define the Chrome storage interface
interface ChromeStorage {
  storage: {
    local: {
      set: (items: Partial<ChromeStorageItems>, callback?: () => void) => Promise<void>;
      get: (items: Partial<ChromeStorageItems>, callback?: (items: Partial<ChromeStorageItems>) => void) => Promise<void>;
    };
  };
}

// Extend the global type to include chrome
declare global {
  // eslint-disable-next-line no-var
  var chrome: ChromeStorage;
}

// Initialize chrome storage
global.chrome = {
  storage: {
    local: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set: async (_items: Partial<ChromeStorageItems>, _callback?: () => void) => Promise.resolve(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: async (_items: Partial<ChromeStorageItems>, _callback?: (items: Partial<ChromeStorageItems>) => void) => Promise.resolve()
    }
  }
};

// Assign jest-chrome to the global object
Object.assign(global, jestChrome);

// Promisify chrome.storage.local.set and chrome.storage.local.get
const chromeStorage = global.chrome;

chromeStorage.storage.local.set = util.promisify(
  chromeStorage.storage.local.set
) as (items: Partial<ChromeStorageItems>) => Promise<void>;

chromeStorage.storage.local.get = util.promisify(
  chromeStorage.storage.local.get
) as (items: Partial<ChromeStorageItems>) => Promise<void>;