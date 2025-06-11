import { useAppContext } from "@/context";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import clm from "country-locale-map";
import { currencySymbolMap } from "currency-symbol-map";
import { ChangeEvent, MouseEvent } from "react";
const inputStyle = {
  width: 120,
  size: "small",
};

// Show the setting helper text only when that listitem is hovered over.
// Just trying to be fancy with the hover effect
const displayHelperOnHover = {
  /* eslint-disable */
  "& > .MuiFormHelperText-root": {
    transition: "visibility 0s, opacity 0.5s linear",
    visibility: "hidden",
    paddingRight: 3,
    opacity: 0,
  },
  "&:hover > .MuiFormHelperText-root": {
    visibility: "visible",
    opacity: 1,
  },
  "&:focus > .MuiFormHelperText-root": {
    visibility: "visible",
    opacity: 1,
  },
  /* eslint-enable */
};

/**
 * SettingsPanel component that displays a list of settings.
 * @category Components
 */
export default function SettingsPanel() {
  const appContext = useAppContext();

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log({
      appContext,
      event,
      name: event.target.name,
      checked: event.target.checked,
      value: event.target.value,
    });
    appContext.setUserSettings({
      ...appContext.userSettings,
      [event.target.name]: event.target.checked,
    });
  };

  /*
  const handleSelectChange = (event: SelectChangeEvent) => {
    console.log({ appContext, event, name: event.target.name, value: event.target.value });
    appContext.setSettings({
      ...appContext.settings,
      [event.target.name]: event.target.value,
    });
  };
  */

  const handleInputChange = (
    event: SelectChangeEvent | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log({ appContext, event, name: event.target.name, value: event.target.value });
    appContext.setUserSettings({
      ...appContext.userSettings,
      [event.target.name]: event.target.value,
    });
  };

  const handleButtonClick = (event: MouseEvent<HTMLDivElement>) => {
    const button = event.target as HTMLButtonElement;
    const size = button.textContent?.toLowerCase();
    console.log({ appContext, event, name: button.name, size, target: button });
    if (size) {
      appContext.setUserSettings({
        ...appContext.userSettings,
        [button.name]: size,
      });
    }
  };

  return (
    <FormGroup>
      <List
        sx={{ width: "100%", bgcolor: "background.paper", color: "text.primary" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="label" id="nested-list-subheader">
            Behavior
          </ListSubheader>
        }
      >
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Cache Search Results" />
          <FormHelperText>Improves performance</FormHelperText>
          <FormControlLabel
            control={
              <Switch
                checked={appContext.userSettings.caching}
                onChange={handleSwitchChange}
                name="caching"
              />
            }
            labelPlacement="start"
            label=""
          />
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="AutoComplete" />
          <FormHelperText>Autocomplete search input</FormHelperText>
          <FormControlLabel
            control={
              <Switch
                checked={appContext.userSettings.autocomplete}
                onChange={handleSwitchChange}
                name="autocomplete"
              />
            }
            labelPlacement="start"
            label=""
          />
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Location" />
          <FormHelperText>Your country</FormHelperText>
          <FormControl>
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              value={appContext.userSettings.location}
              onChange={handleInputChange}
              name="location"
              label="location"
              size="small"
              sx={{ ...inputStyle }}
            >
              <MenuItem value="">
                <i>None</i>
              </MenuItem>
              {clm.getAllCountries().map((country) => (
                <MenuItem key={country.alpha3} value={country.alpha3}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Currency" />
          <FormHelperText>Convert all currency to this</FormHelperText>
          <FormControl>
            <InputLabel id="currency-select-label">Currency</InputLabel>
            <Select
              labelId="currency-select-label"
              value={appContext.userSettings.currency}
              onChange={handleInputChange}
              name="currency"
              label="currency"
              size="small"
              sx={{ ...inputStyle }}
            >
              {clm.getAllCountries().map((country) => (
                <MenuItem key={country.currency} value={country.currency}>
                  {country.currency} ({currencySymbolMap[country.currency]})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Ships to Location" />
          <FormHelperText>Only show products that ship to your location</FormHelperText>
          <FormControl>
            <Switch
              checked={
                !!appContext.userSettings.location && appContext.userSettings.shipsToMyLocation
              }
              disabled={appContext.userSettings.location === ""}
              onChange={handleSwitchChange}
              name="shipsToMyLocation"
            />
          </FormControl>
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Foo" />
          <FormHelperText>Just an input example</FormHelperText>
          <FormControl>
            <TextField
              value={appContext.userSettings.foo}
              label="Foo"
              name="foo"
              onChange={handleInputChange}
              //hiddenLabel
              variant="filled"
              size="small"
              sx={{ ...inputStyle }}
            />
          </FormControl>
        </ListItem>
        <Divider variant="middle" component="li" />
        <ListSubheader component="label" id="nested-list-subheader">
          Display
        </ListSubheader>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Popup Size" />
          <FormHelperText>Popup size</FormHelperText>
          <FormControl>
            <ButtonGroup
              variant="contained"
              aria-label="Basic button group"
              onClick={handleButtonClick}
            >
              <Button
                name="popupSize"
                value="small"
                size="small"
                variant={appContext.userSettings.popupSize === "small" ? "contained" : "text"}
              >
                Small
              </Button>
              <Button
                name="popupSize"
                value="medium"
                size="small"
                variant={appContext.userSettings.popupSize === "medium" ? "contained" : "text"}
              >
                Medium
              </Button>
              <Button
                name="popupSize"
                value="large"
                size="small"
                variant={appContext.userSettings.popupSize === "large" ? "contained" : "text"}
              >
                Large
              </Button>
            </ButtonGroup>
          </FormControl>
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Auto-Resize" />
          <FormHelperText>More results = larger window</FormHelperText>
          <Switch
            checked={appContext.userSettings.autoResize}
            onChange={handleSwitchChange}
            name="autoResize"
          />
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Some Setting" />
          <FormHelperText id="some-setting-helper-text">Disabled by default</FormHelperText>
          <Switch
            checked={appContext.userSettings.someSetting}
            onChange={handleSwitchChange}
            name="someSetting"
          />
        </ListItem>
        <ListItem sx={displayHelperOnHover}>
          <ListItemText primary="Show Helpful Tips" />
          <FormHelperText id="some-setting-helper-text">Show help in tooltips</FormHelperText>
          <Switch
            checked={appContext.userSettings.showHelp}
            onChange={handleSwitchChange}
            name="showHelp"
          />
        </ListItem>
        <Divider component="li" />
        <ListItem>
          <Stack
            spacing={2}
            direction="row"
            sx={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          >
            <Button variant="outlined">Restore Defaults</Button>
          </Stack>
        </ListItem>
      </List>
    </FormGroup>
  );
}
