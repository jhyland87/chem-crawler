import HistoryIcon from "@/icons/HistoryIcon";
import MenuIcon from "@/icons/MenuIcon";
import ScienceIcon from "@/icons/ScienceIcon";
import SearchIcon from "@/icons/SearchIcon";
import StoreIcon from "@/icons/StoreIcon";
import { IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";

interface AppbarHeaderProps {
  children?: React.ReactNode;
}

export default function AppbarHeader({ children }: AppbarHeaderProps) {
  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {children}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <SearchIcon />
            </Badge>
          </IconButton>
          <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={17} color="error">
              <HistoryIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            color="inherit"
          >
            <ScienceIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            color="inherit"
          >
            <StoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
