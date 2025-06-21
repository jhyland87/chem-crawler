import BookmarkIcon from "@/icons/BookmarkIcon";
import HistoryIcon from "@/icons/HistoryIcon";
import SearchIcon from "@/icons/SearchIcon";
import SettingsIcon from "@/icons/SettingsIcon";
import StoreIcon from "@/icons/StoreIcon";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { SyntheticEvent } from "react";
import IconTextFader from "./IconTextFader";

// Simple theme icon component
const ThemeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

/**
 * Generates props for a tab component.
 * @param index - The index of the tab
 * @param name - The name of the tab panel
 * @returns Tab props including id, panel, and aria-controls
 */
function tabProps(index: number, name: string) {
  return {
    id: `full-width-tab-${index}`,
    panel: name,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

/**
 * TabHeader component that renders a navigation bar with tabs for different sections of the application.
 * Each tab includes an icon and text that fades based on the active state.
 *
 * @component
 * @category Components
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <TabHeader page={currentPage} setPage={setCurrentPage} />
 * ```
 */
export default function TabHeader({ page, setPage }: TabHeaderProps) {
  const handleChange = (e: SyntheticEvent, newValue: number) => setPage(newValue);

  return (
    <Tabs
      sx={{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "& .MuiTabs-indicator": {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
        borderRadius: 0,
      }}
      value={page}
      onChange={handleChange}
      indicatorColor="secondary"
      textColor="inherit"
      variant="fullWidth"
      aria-label="full width tabs example"
    >
      <Tab
        label={
          <IconTextFader text="Search" active={page === 0}>
            <SearchIcon />
          </IconTextFader>
        }
        {...tabProps(0, "search-panel")}
      />
      <Tab
        label={
          <IconTextFader text="Suppliers" active={page === 1}>
            <StoreIcon />
          </IconTextFader>
        }
        {...tabProps(1, "suppliers-panel")}
      />
      <Tab
        label={
          <IconTextFader text="Favorites" active={page === 2}>
            <BookmarkIcon />
          </IconTextFader>
        }
        {...tabProps(2, "favorites-panel")}
      />
      <Tab
        label={
          <IconTextFader text="History" active={page === 3}>
            <HistoryIcon />
          </IconTextFader>
        }
        {...tabProps(3, "history-panel")}
      />
      <Tab
        label={
          <IconTextFader text="Settings" active={page === 4}>
            <SettingsIcon />
          </IconTextFader>
        }
        {...tabProps(4, "settings-panel")}
      />
      <Tab
        label={
          <IconTextFader text="Hulk Theme" active={page === 5}>
            <ThemeIcon />
          </IconTextFader>
        }
        {...tabProps(5, "hulk-theme-panel")}
      />
    </Tabs>
  );
}
