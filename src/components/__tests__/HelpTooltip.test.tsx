import "@testing-library/jest-dom";
import HelpTooltip from "../HelpTooltip";
import { render } from "@testing-library/react";
//import userEvent from '@testing-library/user-event'
import { SettingsContext } from "../../context";
import SearchIcon from "@mui/icons-material/Search";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { SettingsContextProps } from "../../types";

const defaultSettings = {
  settings: {
    showHelp: false,
    caching: true,
    autocomplete: true,
    currency: "usd",
    location: "",
    shipsToMyLocation: false,
    foo: "bar",
    jason: false,
    antoine: true,
    popupSize: "small",
    autoResize: true,
    someSetting: false,
    suppliers: [],
    theme: "light",
    showColumnFilters: true,
    showAllColumns: false,
    hideColumns: [],
  },
  setSettings: () => { },
};

const renderWithContext = (
  ui: ReactNode,
  { providerProps = {}, ...renderOptions }: { providerProps?: Partial<SettingsContextProps> } = {}
) => {
  return render(
    <SettingsContext.Provider value={{ ...defaultSettings, ...providerProps }}>
      {ui}
    </SettingsContext.Provider>,
    renderOptions
  );
};

describe("HelpTooltip", () => {
  describe("wrapping SearchIcon in HelpTooltip", () => {
    it("should be visible", () => {
      const providerProps = {
        settings: {
          ...defaultSettings.settings,
          showHelp: true
        },
        setSettings: () => { },
      };

      const { getByTestId, getByLabelText } = renderWithContext(
        <HelpTooltip text="foobar">
          <SearchIcon id="test-icon" />
        </HelpTooltip>,
        { providerProps }
      );

      const iconElement = getByTestId("SearchIcon");
      expect(iconElement).toBeInTheDocument();
      userEvent.hover(iconElement);
      expect(getByLabelText("foobar")).toBeInTheDocument();
      //console.log(getByLabelText("foobar"));
    });
  });
});
