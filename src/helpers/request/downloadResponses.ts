import { saveAs } from "file-saver";
import JSZip from "jszip";

/**
 * Interface for stored response data
 */
interface StoredResponse {
  url: string;
  hash: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  timestamp: number;
}

/**
 * Downloads all stored responses as a zip file
 * @param prefix - Optional prefix to filter responses by storage key prefix
 * @returns A promise that resolves when the download is complete
 * @example
 * ```typescript
 * // Download all stored responses
 * await downloadStoredResponses();
 *
 * // Download responses with specific prefix
 * await downloadStoredResponses("api_responses");
 * ```
 */
export async function downloadStoredResponses(prefix?: string): Promise<void> {
  try {
    // Get all items from storage
    const items = await chrome.storage.local.get(null);

    // Filter responses by prefix if provided
    const responseKeys = Object.keys(items).filter((key) =>
      prefix ? key.startsWith(prefix) : key.startsWith("response_"),
    );

    if (responseKeys.length === 0) {
      console.warn("No stored responses found");
      return;
    }

    // Create a new zip file
    const zip = new JSZip();

    // Add each response to the zip file
    for (const key of responseKeys) {
      const response = items[key] as StoredResponse;
      const filename = response.hash || key.replace(/^.*_/, "");

      // Create response metadata
      const metadata = {
        url: response.url,
        hash: response.hash,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        timestamp: new Date(response.timestamp).toISOString(),
      };

      // Add the response data
      if (typeof response.data === "string") {
        zip.file(`${filename}.txt`, response.data);
      } else if (response.data instanceof Blob) {
        zip.file(`${filename}.blob`, response.data);
      } else {
        zip.file(`${filename}.json`, JSON.stringify(response.data, null, 2));
      }

      // Add metadata
      zip.file(`${filename}.meta.json`, JSON.stringify(metadata, null, 2));
    }

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // Use file-saver to download the zip
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    saveAs(content, `responses_${timestamp}.zip`);
  } catch (error) {
    console.error("Error downloading responses:", error);
    throw error;
  }
}

/**
 * Clears all stored responses from chrome.storage.local
 * @param prefix - Optional prefix to filter responses by storage key prefix
 * @returns A promise that resolves when the clear operation is complete
 * @example
 * ```typescript
 * // Clear all stored responses
 * await clearStoredResponses();
 *
 * // Clear responses with specific prefix
 * await clearStoredResponses("api_responses");
 * ```
 */
export async function clearStoredResponses(prefix?: string): Promise<void> {
  try {
    // Get all items from storage
    const items = await chrome.storage.local.get(null);

    // Filter responses by prefix if provided
    const responseKeys = Object.keys(items).filter((key) =>
      prefix ? key.startsWith(prefix) : key.startsWith("response_"),
    );

    if (responseKeys.length === 0) {
      console.warn("No stored responses found to clear");
      return;
    }

    // Remove the filtered responses
    await chrome.storage.local.remove(responseKeys);
    console.log(`Cleared ${responseKeys.length} stored responses`);
  } catch (error) {
    console.error("Error clearing responses:", error);
    throw error;
  }
}

// Make downloadStoredResponses available on the window object
declare global {
  interface Window {
    downloadStoredResponses?: typeof downloadStoredResponses;
    clearStoredResponses: typeof clearStoredResponses;
    _autoDownloadResponses?: boolean;
  }
}
window.downloadStoredResponses = downloadStoredResponses;
window.clearStoredResponses = clearStoredResponses;
