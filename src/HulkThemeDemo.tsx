import React from "react";
import { HulkSamplePage } from "./components/HulkTheme";

/**
 * Hulk Theme Demo
 *
 * This is a complete React theme based on the Hulk admin template
 * from https://hulk.theironnetwork.org/app/tables/ag-grid
 *
 * Features:
 * - Dark Material Design theme
 * - Responsive sidebar navigation
 * - Modern header with search and notifications
 * - TanStack Table integration for data tables
 * - Stats cards and dashboard widgets
 * - Customizable SCSS variables
 * - Full responsive design
 *
 * Usage:
 * Import and use the HulkSamplePage component or individual components
 * from the HulkTheme folder.
 */

export const HulkThemeDemo: React.FC = () => {
  return <HulkSamplePage />;
};

export default HulkThemeDemo;
