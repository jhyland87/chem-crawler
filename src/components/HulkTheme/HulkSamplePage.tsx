import React from "react";
import { HulkDataTable } from "./HulkDataTable";
import { HulkHeader } from "./HulkHeader";
import { HulkLayout } from "./HulkLayout";
import "./HulkSamplePage.scss";
import { HulkSidebar } from "./HulkSidebar";

const StatsCard: React.FC<{
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  gradient?: string;
}> = ({ title, value, change, changeType, icon, gradient }) => {
  return (
    <div className={`hulk-stats-card ${gradient ? `hulk-stats-card--${gradient}` : ""}`}>
      <div className="hulk-stats-card__content">
        <div className="hulk-stats-card__info">
          <h3 className="hulk-stats-card__title">{title}</h3>
          <div className="hulk-stats-card__value">{value}</div>
          <div className={`hulk-stats-card__change hulk-stats-card__change--${changeType}`}>
            <span className="hulk-stats-card__change-icon">
              {changeType === "positive" ? "↗️" : changeType === "negative" ? "↘️" : "➡️"}
            </span>
            {change}
          </div>
        </div>
        <div className="hulk-stats-card__icon">{icon}</div>
      </div>
    </div>
  );
};

const QuickActionsCard: React.FC = () => {
  const actions = [
    { label: "Add Employee", icon: "👤", color: "primary" },
    { label: "Generate Report", icon: "📊", color: "success" },
    { label: "Send Message", icon: "💬", color: "info" },
    { label: "Backup Data", icon: "💾", color: "warning" },
  ];

  return (
    <div className="hulk-card hulk-quick-actions">
      <div className="hulk-quick-actions__header">
        <h3 className="hulk-quick-actions__title">Quick Actions</h3>
        <p className="hulk-quick-actions__subtitle">Common tasks and shortcuts</p>
      </div>
      <div className="hulk-quick-actions__grid">
        {actions.map((action, index) => (
          <button key={index} className={`hulk-quick-actions__item hulk-btn-${action.color}`}>
            <span className="hulk-quick-actions__icon">{action.icon}</span>
            <span className="hulk-quick-actions__label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      user: "John Doe",
      action: "updated profile information",
      time: "2 minutes ago",
      type: "update",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: 'created new project "Mobile App"',
      time: "15 minutes ago",
      type: "create",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: 'completed task "UI Design Review"',
      time: "1 hour ago",
      type: "complete",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "joined the Engineering team",
      time: "2 hours ago",
      type: "join",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "update":
        return "✏️";
      case "create":
        return "➕";
      case "complete":
        return "✅";
      case "join":
        return "👋";
      default:
        return "📝";
    }
  };

  return (
    <div className="hulk-card hulk-activity-feed">
      <div className="hulk-activity-feed__header">
        <h3 className="hulk-activity-feed__title">Recent Activity</h3>
        <button className="hulk-activity-feed__view-all">View All</button>
      </div>
      <div className="hulk-activity-feed__list">
        {activities.map((activity) => (
          <div key={activity.id} className="hulk-activity-feed__item">
            <div className="hulk-activity-feed__icon">{getActivityIcon(activity.type)}</div>
            <div className="hulk-activity-feed__content">
              <div className="hulk-activity-feed__text">
                <strong>{activity.user}</strong> {activity.action}
              </div>
              <div className="hulk-activity-feed__time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartCard: React.FC = () => {
  return (
    <div className="hulk-card hulk-chart-card">
      <div className="hulk-chart-card__header">
        <h3 className="hulk-chart-card__title">Performance Overview</h3>
        <div className="hulk-chart-card__period">
          <select className="hulk-input hulk-chart-card__select">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>
      <div className="hulk-chart-card__content">
        {/* Placeholder for actual chart */}
        <div className="hulk-chart-placeholder">
          <div className="hulk-chart-placeholder__bars">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="hulk-chart-placeholder__bar"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              />
            ))}
          </div>
          <div className="hulk-chart-placeholder__label">📈 Chart visualization would go here</div>
        </div>
      </div>
      <div className="hulk-chart-card__footer">
        <div className="hulk-chart-card__legend">
          <div className="hulk-chart-card__legend-item">
            <span className="hulk-chart-card__legend-color hulk-chart-card__legend-color--primary"></span>
            Revenue
          </div>
          <div className="hulk-chart-card__legend-item">
            <span className="hulk-chart-card__legend-color hulk-chart-card__legend-color--success"></span>
            Profit
          </div>
        </div>
      </div>
    </div>
  );
};

interface HulkSamplePageProps {
  onClose?: () => void;
}

export const HulkSamplePage: React.FC<HulkSamplePageProps> = ({ onClose }) => {
  return (
    <div className="hulk-theme">
      {/* Close button for returning to main app */}
      {onClose && (
        <button className="hulk-close-btn" onClick={onClose} title="Return to main app">
          ✕
        </button>
      )}

      <HulkLayout>
        <HulkSidebar />
        <HulkHeader />
        <div className="hulk-sample-page">
          {/* Header Section */}
          <div className="hulk-sample-page__header">
            <div className="hulk-sample-page__title-section">
              <h1 className="hulk-sample-page__title">Dashboard Overview</h1>
              <p className="hulk-sample-page__subtitle">
                Welcome to the Hulk Admin Theme - A powerful dark Material Design dashboard
              </p>
            </div>
            <div className="hulk-sample-page__actions">
              <button className="hulk-btn-gradient">📥 Export Data</button>
              <button className="hulk-btn hulk-btn-primary">⚙️ Settings</button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="hulk-sample-page__stats">
            <StatsCard
              title="Total Users"
              value="2,847"
              change="+12.5%"
              changeType="positive"
              icon="👥"
              gradient="primary"
            />
            <StatsCard
              title="Revenue"
              value="$54,329"
              change="+8.2%"
              changeType="positive"
              icon="💰"
              gradient="success"
            />
            <StatsCard
              title="Orders"
              value="1,423"
              change="-2.4%"
              changeType="negative"
              icon="📦"
              gradient="warning"
            />
            <StatsCard
              title="Conversion"
              value="3.24%"
              change="0.0%"
              changeType="neutral"
              icon="📊"
              gradient="info"
            />
          </div>

          {/* Dashboard Grid */}
          <div className="hulk-sample-page__grid">
            <div className="hulk-sample-page__left-column">
              <ChartCard />
              <QuickActionsCard />
            </div>
            <div className="hulk-sample-page__right-column">
              <ActivityFeed />
            </div>
          </div>

          {/* Data Table Section */}
          <div className="hulk-sample-page__table-section">
            <HulkDataTable />
          </div>

          {/* Feature Showcase */}
          <div className="hulk-sample-page__features">
            <div className="hulk-card">
              <div className="hulk-sample-page__feature-header">
                <h2>🎨 Theme Features</h2>
                <p>Explore the capabilities of the Hulk Admin Theme</p>
              </div>
              <div className="hulk-sample-page__feature-grid">
                <div className="hulk-sample-page__feature">
                  <div className="hulk-sample-page__feature-icon">🌙</div>
                  <h4>Dark Theme</h4>
                  <p>Beautiful dark Material Design with purple accents</p>
                </div>
                <div className="hulk-sample-page__feature">
                  <div className="hulk-sample-page__feature-icon">📱</div>
                  <h4>Responsive</h4>
                  <p>Fully responsive design that works on all devices</p>
                </div>
                <div className="hulk-sample-page__feature">
                  <div className="hulk-sample-page__feature-icon">⚡</div>
                  <h4>Fast Performance</h4>
                  <p>Optimized React components with smooth animations</p>
                </div>
                <div className="hulk-sample-page__feature">
                  <div className="hulk-sample-page__feature-icon">🎯</div>
                  <h4>TanStack Table</h4>
                  <p>Powerful data tables with sorting, filtering, and pagination</p>
                </div>
                <div className="hulk-sample-page__feature">
                  <div className="hulk-sample-page__feature-icon">🎨</div>
                  <h4>Material Design</h4>
                  <p>Following Google's Material Design guidelines</p>
                </div>
                <div className="hulk-sample-page__feature">
                  <div className="hulk-sample-page__feature-icon">🔧</div>
                  <h4>Customizable</h4>
                  <p>Easy to customize with SCSS variables and mixins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HulkLayout>
    </div>
  );
};
