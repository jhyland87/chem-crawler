import { useState } from "react";
import "./AppBarMenuExpandable.css"; // Import CSS file

function AppBarMenuExpandable({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`app-bar ${isExpanded ? "expanded" : ""}`}>
      <div className="app-bar-header">
        <button onClick={toggleExpand}>{isExpanded ? "Collapse" : "Expand"}</button>
      </div>
      {isExpanded && (
        <div className="app-bar-content">
          {/* Additional content when expanded */}
          {children}
        </div>
      )}
    </div>
  );
}
export default AppBarMenuExpandable;
