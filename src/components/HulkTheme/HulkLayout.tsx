import React, { ReactNode, useState } from "react";
import { HulkHeader } from "./HulkHeader";
import "./HulkLayout.scss";
import { HulkSidebar } from "./HulkSidebar";

interface HulkLayoutProps {
  children: ReactNode;
  title?: string;
}

export const HulkLayout: React.FC<HulkLayoutProps> = ({ children, title = "Hulk Admin" }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`hulk-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <HulkSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={toggleSidebar}
        onMobileToggle={toggleMobileMenu}
      />

      <div className="hulk-layout__main">
        <HulkHeader
          title={title}
          onMenuToggle={toggleMobileMenu}
          onSidebarToggle={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="hulk-layout__content">
          <div className="hulk-layout__container">{children}</div>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && <div className="hulk-layout__overlay" onClick={toggleMobileMenu} />}
    </div>
  );
};
