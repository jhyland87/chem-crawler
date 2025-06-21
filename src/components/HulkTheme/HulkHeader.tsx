import React, { useState } from "react";
import "./HulkHeader.scss";

interface HulkHeaderProps {
  title: string;
  onMenuToggle: () => void;
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
}

export const HulkHeader: React.FC<HulkHeaderProps> = ({
  title,
  onMenuToggle,
  onSidebarToggle,
  sidebarCollapsed,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifications = [
    { id: 1, message: "New user registered", time: "2 min ago", type: "info" },
    { id: 2, message: "Server backup completed", time: "1 hour ago", type: "success" },
    { id: 3, message: "Database connection warning", time: "3 hours ago", type: "warning" },
  ];

  return (
    <header className="hulk-header">
      <div className="hulk-header__left">
        <button
          className="hulk-header__menu-btn hulk-header__menu-btn--mobile"
          onClick={onMenuToggle}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>

        {sidebarCollapsed && (
          <button
            className="hulk-header__menu-btn hulk-header__menu-btn--desktop"
            onClick={onSidebarToggle}
            aria-label="Expand sidebar"
          >
            ▶
          </button>
        )}

        <div className="hulk-header__breadcrumb">
          <span className="hulk-header__breadcrumb-item">🏠 Home</span>
          <span className="hulk-header__breadcrumb-separator">/</span>
          <span className="hulk-header__breadcrumb-item">Tables</span>
          <span className="hulk-header__breadcrumb-separator">/</span>
          <span className="hulk-header__breadcrumb-item hulk-header__breadcrumb-item--active">
            AG Grid
          </span>
        </div>
      </div>

      <div className="hulk-header__center">
        <h1 className="hulk-header__title">{title}</h1>
      </div>

      <div className="hulk-header__right">
        <div className="hulk-header__search">
          <input type="text" placeholder="Search..." className="hulk-header__search-input" />
          <button className="hulk-header__search-btn">🔍</button>
        </div>

        <div className="hulk-header__actions">
          <div className="hulk-header__action-item">
            <button
              className={`hulk-header__action-btn ${notificationsOpen ? "active" : ""}`}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              🔔
              <span className="hulk-header__action-badge">3</span>
            </button>

            {notificationsOpen && (
              <div className="hulk-header__dropdown hulk-header__notifications">
                <div className="hulk-header__dropdown-header">
                  <h3>Notifications</h3>
                  <button onClick={() => setNotificationsOpen(false)}>✕</button>
                </div>
                <div className="hulk-header__dropdown-body">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`hulk-header__notification hulk-header__notification--${notification.type}`}
                    >
                      <div className="hulk-header__notification-message">
                        {notification.message}
                      </div>
                      <div className="hulk-header__notification-time">{notification.time}</div>
                    </div>
                  ))}
                </div>
                <div className="hulk-header__dropdown-footer">
                  <button className="hulk-header__view-all-btn">View All</button>
                </div>
              </div>
            )}
          </div>

          <div className="hulk-header__action-item">
            <button className="hulk-header__action-btn" aria-label="Messages">
              💬
              <span className="hulk-header__action-badge">5</span>
            </button>
          </div>

          <div className="hulk-header__action-item">
            <button
              className={`hulk-header__user-btn ${userMenuOpen ? "active" : ""}`}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="User menu"
            >
              <div className="hulk-header__user-avatar">👤</div>
              <div className="hulk-header__user-info">
                <span className="hulk-header__user-name">John Doe</span>
                <span className="hulk-header__user-role">Admin</span>
              </div>
              <span className="hulk-header__user-arrow">▼</span>
            </button>

            {userMenuOpen && (
              <div className="hulk-header__dropdown hulk-header__user-menu">
                <div className="hulk-header__dropdown-header">
                  <div className="hulk-header__user-profile">
                    <div className="hulk-header__user-avatar hulk-header__user-avatar--large">
                      👤
                    </div>
                    <div>
                      <div className="hulk-header__user-name">John Doe</div>
                      <div className="hulk-header__user-email">john.doe@example.com</div>
                    </div>
                  </div>
                  <button onClick={() => setUserMenuOpen(false)}>✕</button>
                </div>
                <div className="hulk-header__dropdown-body">
                  <button className="hulk-header__menu-item">👤 Profile</button>
                  <button className="hulk-header__menu-item">⚙️ Settings</button>
                  <button className="hulk-header__menu-item">💰 Billing</button>
                  <hr className="hulk-header__menu-divider" />
                  <button className="hulk-header__menu-item">🌙 Dark Mode</button>
                  <button className="hulk-header__menu-item">🌍 Language</button>
                  <hr className="hulk-header__menu-divider" />
                  <button className="hulk-header__menu-item hulk-header__menu-item--danger">
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay for dropdowns */}
      {(notificationsOpen || userMenuOpen) && (
        <div
          className="hulk-header__overlay"
          onClick={() => {
            setNotificationsOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};
