import { createContext, useContext } from "react";
//import "./types.d.ts";

/**
 * React context for managing global application state and settings.
 *
 * @example
 * ```tsx
 * // Provider usage
 * <AppContext.Provider value={appContextValue}>
 *   <App />
 * </AppContext.Provider>
 *
 * // Consumer usage
 * const { userSettings, data } = useAppContext();
 * ```
 */
export const AppContext = createContext<AppContextProps | undefined>(undefined);

/**
 * Custom hook to access the application context.
 *
 * @returns The application context containing global state and settings
 * @throws If used outside of an AppContext.Provider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { userSettings, data } = useAppContext();
 *   return <div>{userSettings.someSetting}</div>;
 * }
 * ```
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContext");
  }
  return context;
}
