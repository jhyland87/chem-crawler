import "@testing-library/jest-dom";
import HelpTooltip from "../HelpTooltip";
import { render } from "@testing-library/react";
//import userEvent from '@testing-library/user-event'
import { SettingsContext } from "../../context";
import SearchIcon from "@mui/icons-material/Search";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";

const renderWithContext = (
  ui: ReactNode,
  { providerProps = {}, ...renderOptions }: { providerProps?: object } = {}
) => {
  return render(
    <SettingsContext {...providerProps}>{ui}</SettingsContext>,
    renderOptions
  );
};

describe("HelpTooltip", () => {
  describe("wrapping SearchIcon in HelpTooltip", () => {
    it("should be visible", () => {
      const providerProps = { value: { settings: { showHelp: true } } };

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
