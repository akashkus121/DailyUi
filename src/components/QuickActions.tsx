import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Wallet, MessageSquare } from "lucide-react";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOn = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleHealthClick = () => {
    console.log("QuickActions: handleHealthClick", { path: location.pathname, isOn: isOn("/daily-health") });
    if (isOn("/daily-health")) {
      // already on health -> go back to dashboard
      console.log("QuickActions: navigating to /dashboard");
      navigate("/dashboard");
      setTimeout(() => {
        if (window.location.pathname === "/daily-health") {
          console.warn("QuickActions: SPA navigate didn't change pathname, falling back to full redirect");
          window.location.href = "/dashboard";
        }
      }, 300);
    } else {
      // navigate to health; include state flag if pages want to auto-open UI
      console.log("QuickActions: navigate -> /daily-health");
      navigate("/daily-health", { state: { fromQuickActions: true } });
      setTimeout(() => {
        if (window.location.pathname !== "/daily-health") {
          // nothing — navigation worked or user is elsewhere
        }
      }, 300);
    }
  };

  const handleExpenseClick = () => {
    console.log("QuickActions: handleExpenseClick", { path: location.pathname, isOn: isOn("/expense") });
    if (isOn("/expense")) {
      console.log("QuickActions: navigating to /dashboard");
      navigate("/dashboard");
      setTimeout(() => {
        if (window.location.pathname === "/expense") {
          console.warn("QuickActions: SPA navigate didn't change pathname, falling back to full redirect");
          window.location.href = "/dashboard";
        }
      }, 300);
    } else {
      console.log("QuickActions: navigate -> /expense");
      navigate("/expense", { state: { fromQuickActions: true } });
    }
  };

  return (
    <div className="quick-actions global-quick-actions">
      <button type="button" className="glass-action" onClick={handleHealthClick}>
        <Heart size={16} /> {isOn("/daily-health") ? "Dashboard" : "Health"}
      </button>

      <button type="button" className="glass-action" onClick={handleExpenseClick}>
        <Wallet size={16} /> {isOn("/expense") ? "Dashboard" : "Expense"}
      </button>

      
    </div>
  );
};

export default QuickActions;