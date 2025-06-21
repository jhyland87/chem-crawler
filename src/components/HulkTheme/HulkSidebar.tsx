import React, { useState } from "react";
import "./HulkSidebar.scss";
// Material-UI Icons
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChatIcon from "@mui/icons-material/Chat";
import ContactsIcon from "@mui/icons-material/Contacts";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import GridOnIcon from "@mui/icons-material/GridOn";
import HelpIcon from "@mui/icons-material/Help";
import InventoryIcon from "@mui/icons-material/Inventory";
import StepperIcon from "@mui/icons-material/LinearScale";
import MenuIcon from "@mui/icons-material/Menu";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TableViewIcon from "@mui/icons-material/TableView";
import TimelineIcon from "@mui/icons-material/Timeline";
import CustomizeIcon from "@mui/icons-material/Tune";
import ViewListIcon from "@mui/icons-material/ViewList";
import WidgetsIcon from "@mui/icons-material/Widgets";

export interface HulkSidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onToggle?: () => void;
  onMobileToggle?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    description: "Dashboard 1, Dashboard 2, Dashboard 3",
    children: [
      {
        id: "dashboard-1",
        label: "Dashboard 1",
        icon: <BarChartIcon fontSize="small" />,
        description: "View dashboard 1 and Widgets related to web analytics",
      },
      {
        id: "dashboard-2",
        label: "Dashboard 2",
        icon: <AssignmentIcon fontSize="small" />,
        description: "Checkout the SAAS dashboard and Widgets like chat and Task List",
      },
      {
        id: "dashboard-3",
        label: "Dashboard 3",
        icon: <BusinessIcon fontSize="small" />,
        description: "Manage your eCommerce dashboard and check out other activities",
      },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    icon: <DescriptionIcon fontSize="small" />,
    description: "Profile, Stepper, Pricing, Timeline, Contact Grid, F...",
    children: [
      {
        id: "profile",
        label: "Profile",
        icon: <PersonIcon fontSize="small" />,
        description: "Check your standard profile page with useful widgets",
      },
      {
        id: "stepper",
        label: "Stepper",
        icon: <StepperIcon fontSize="small" />,
        description: "Go and check the horizontal stepper form design",
      },
      {
        id: "pricing",
        label: "Pricing",
        icon: <AttachMoneyIcon fontSize="small" />,
        description: "Timeline",
      },
      {
        id: "timeline",
        label: "Timeline",
        icon: <TimelineIcon fontSize="small" />,
        description: "Contact Grid",
      },
      {
        id: "contact-grid",
        label: "Contact Grid",
        icon: <ContactsIcon fontSize="small" />,
        description: "FAQ",
      },
      { id: "faq", label: "FAQ", icon: <HelpIcon fontSize="small" />, description: "Payment" },
      {
        id: "payment",
        label: "Payment",
        icon: <CreditCardIcon fontSize="small" />,
        description: "Signature Pad",
      },
    ],
  },
  {
    id: "full-page-menu",
    label: "Full Page Menu",
    icon: <MenuIcon fontSize="small" />,
    description: "Lorem ipsum dolor sit amet",
  },
  {
    id: "ecommerce",
    label: "Ecommerce",
    icon: <ShoppingCartIcon fontSize="small" />,
    description: "Shop, Product Details, Cart, Checkout, Invoice, Si...",
    children: [
      {
        id: "shop",
        label: "Shop",
        icon: <StorefrontIcon fontSize="small" />,
        description: "Shop the new and existing product and also manage all",
      },
      {
        id: "product-details",
        label: "Product Details",
        icon: <InventoryIcon fontSize="small" />,
        description: "Cart",
      },
      {
        id: "cart",
        label: "Cart",
        icon: <ShoppingCartIcon fontSize="small" />,
        description: "Checkout",
      },
      {
        id: "checkout",
        label: "Checkout",
        icon: <PaymentIcon fontSize="small" />,
        description: "Invoice",
      },
      {
        id: "invoice",
        label: "Invoice",
        icon: <ReceiptIcon fontSize="small" />,
        description: "SignUp",
      },
    ],
  },
  {
    id: "tables",
    label: "Tables",
    icon: <TableViewIcon fontSize="small" />,
    expanded: true,
    description: "Basic Table, Search Table, AgGrid, Custom Table",
    children: [
      { id: "basic-table", label: "Basic Table", icon: <ViewListIcon fontSize="small" /> },
      { id: "search-table", label: "Search Table", icon: <SearchIcon fontSize="small" /> },
      { id: "aggrid", label: "AgGrid", icon: <GridOnIcon fontSize="small" /> },
      { id: "custom-table", label: "Custom Table", icon: <CustomizeIcon fontSize="small" /> },
    ],
  },
  {
    id: "user-settings",
    label: "User Settings",
    icon: <SettingsIcon fontSize="small" />,
    description: "Organised Your Staff And Users",
  },
  {
    id: "chat",
    label: "Chat",
    icon: <ChatIcon fontSize="small" />,
    description: "Get connected with your friends and clients",
  },
  {
    id: "email",
    label: "Email",
    icon: <EmailIcon fontSize="small" />,
    description: "Check out your daily emails with our integrated e...",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: <CalendarTodayIcon fontSize="small" />,
    description: "Manage your day to day schedule for staff and cl...",
  },
  {
    id: "video-player",
    label: "Video Player",
    icon: <PlayArrowIcon fontSize="small" />,
    description: "Show your visual content",
  },
  {
    id: "blog",
    label: "Blog",
    icon: <ArticleIcon fontSize="small" />,
    description: "Blog Grid, Blog Details",
  },
  {
    id: "ui-components",
    label: "UI Components",
    icon: <WidgetsIcon fontSize="small" />,
    description: "Basic Typography, Alert, Button, Card, Checkbox...",
  },
];

export const HulkSidebar: React.FC<HulkSidebarProps> = ({
  collapsed = false,
  mobileOpen = false,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["tables"]));

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id) || item.expanded;
    const isActive = item.id === "aggrid"; // Highlight AgGrid as active

    return (
      <div key={item.id} className="hulk-sidebar__menu-item-wrapper">
        <div
          className={`hulk-sidebar__menu-item ${isActive ? "active" : ""} ${level > 0 ? "sub-item" : ""}`}
          onClick={() => (hasChildren ? toggleExpanded(item.id) : undefined)}
          style={{ paddingLeft: `${16 + level * 20}px` }}
        >
          <span className="hulk-sidebar__menu-icon">{item.icon}</span>
          {!collapsed && (
            <>
              <div className="hulk-sidebar__menu-content">
                <span className="hulk-sidebar__menu-label">{item.label}</span>
                {item.description && level === 0 && (
                  <span className="hulk-sidebar__menu-description">{item.description}</span>
                )}
              </div>
              {hasChildren && (
                <span className={`hulk-sidebar__menu-arrow ${isExpanded ? "expanded" : ""}`}>
                  ▼
                </span>
              )}
            </>
          )}
        </div>

        {hasChildren && isExpanded && !collapsed && (
          <div className="hulk-sidebar__submenu">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={`hulk-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="hulk-sidebar__header">
          <div className="hulk-sidebar__logo">
            <span className="hulk-sidebar__logo-icon">💪</span>
            {!collapsed && <span className="hulk-sidebar__logo-text">HULK</span>}
          </div>
        </div>

        {/* Navigation */}
        <div className="hulk-sidebar__nav">{menuItems.map((item) => renderMenuItem(item))}</div>

        {/* Footer */}
        <div className="hulk-sidebar__footer">
          <div className="hulk-sidebar__upgrade-card">
            <div className="hulk-sidebar__upgrade-content">
              <span className="hulk-sidebar__upgrade-label">Basic</span>
              <span className="hulk-sidebar__upgrade-price">$100 / month</span>
              <button className="hulk-sidebar__upgrade-btn">Upgrade</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
