import { ChromeStorageODM } from "@/utils/ChromeStorageODM";

declare global {
  interface Window {
    createLocalStorageODM: () => ChromeStorageODM;
    createSyncStorageODM: () => ChromeStorageODM;
    createSessionStorageODM: () => ChromeStorageODM;
  }
}
