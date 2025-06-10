import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

export default function AppBarMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">App</Typography>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>Option 1</MenuItem>
            <MenuItem onClick={handleClose}>Option 2</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}
