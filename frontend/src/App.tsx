import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ThemeToggle from "./components/ThemeToggle";
import {
  Home,
  Phone,
  BarChart,
  PlusCircle,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Building,
  Users,
  FileText,
  Search,
  TrendingUp,
  MessageSquare,
  Shield,
  Database,
} from "lucide-react";
import "./App.css";

// Main App Layout Component
const AppLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log("AppLayout - user:", user, "role:", user?.role, "isAuthenticated:", isAuthenticated);

  const handleLogout = async () => {
    await logout();
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // If not authenticated, just render the outlet (for login/register pages)
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-icon">
              <Search size={24} />
            </div>
            <div className="logo-text">
              <h1>Find Cargo</h1>
              <span className="logo-subtitle">Logistics Management</span>
            </div>
          </div>
          {user?.organization && (
            <div className="org-badge">
              <Building size={16} />
              <span>{user.organization.name}</span>
            </div>
          )}
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.fullName}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <Link to="/profile" className="header-btn">
              <User size={18} />
            </Link>
            <button className="header-btn">
              <Settings size={18} />
            </button>
            <button className="header-btn logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {/* Main Navigation */}
            <div className="nav-section">
              <h3 className="nav-section-title">Main</h3>
              <ul className="nav-list">
                <li>
                  <Link
                    to="/dashboard"
                    className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                  >
                    <LayoutDashboard className="nav-icon" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Operations */}
            <div className="nav-section">
              <h3 className="nav-section-title">Operations</h3>
              <ul className="nav-list">
                <li>
                  <Link
                    to="/inquiries"
                    className={`nav-link ${isActive("/inquiries") ? "active" : ""}`}
                  >
                    <Search className="nav-icon" />
                    <span>Inquiries</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/salesCalls"
                    className={`nav-link ${isActive("/salesCalls") ? "active" : ""}`}
                  >
                    <Phone className="nav-icon" />
                    <span>Sales Calls</span>
                  </Link>
                </li>
                <li>
                  <Link to="/rates" className={`nav-link ${isActive("/rates") ? "active" : ""}`}>
                    <TrendingUp className="nav-icon" />
                    <span>Rates</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="nav-section">
              <h3 className="nav-section-title">Quick Actions</h3>
              <ul className="nav-list">
                <li>
                  <Link
                    to="/inquiries/add"
                    className={`nav-link ${isActive("/inquiries/add") ? "active" : ""}`}
                  >
                    <PlusCircle className="nav-icon" />
                    <span>New Inquiry</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/salesCalls/add"
                    className={`nav-link ${isActive("/salesCalls/add") ? "active" : ""}`}
                  >
                    <MessageSquare className="nav-icon" />
                    <span>New Sales Call</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/rates/add"
                    className={`nav-link ${isActive("/rates/add") ? "active" : ""}`}
                  >
                    <BarChart className="nav-icon" />
                    <span>Add Rates</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Organization Management (Root only) */}
            {user?.role === "root" && (
              <>
                <div className="nav-section">
                  <h3 className="nav-section-title">System Management</h3>
                  <ul className="nav-list">
                    <li>
                      <Link
                        to="/organizations"
                        className={`nav-link ${isActive("/organizations") ? "active" : ""}`}
                      >
                        <Building className="nav-icon" />
                        <span>Organizations</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/users"
                        className={`nav-link ${isActive("/users") ? "active" : ""}`}
                      >
                        <Users className="nav-icon" />
                        <span>All Users</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/audit"
                        className={`nav-link ${isActive("/audit") ? "active" : ""}`}
                      >
                        <Database className="nav-icon" />
                        <span>Audit Logs</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="nav-section">
                  <h3 className="nav-section-title">Quick Add</h3>
                  <ul className="nav-list">
                    <li>
                      <Link
                        to="/organizations/add"
                        className={`nav-link ${isActive("/organizations/add") ? "active" : ""}`}
                      >
                        <PlusCircle className="nav-icon" />
                        <span>New Organization</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/users/add"
                        className={`nav-link ${isActive("/users/add") ? "active" : ""}`}
                      >
                        <PlusCircle className="nav-icon" />
                        <span>New User</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* User Management (Admin only) */}
            {user?.role === "admin" && (
              <div className="nav-section">
                <h3 className="nav-section-title">User Management</h3>
                <ul className="nav-list">
                  <li>
                    <Link
                      to={`/organizations/${user.organization?.id}/users`}
                      className={`nav-link ${
                        isActive(`/organizations/${user.organization?.id}/users`) ? "active" : ""
                      }`}
                    >
                      <Users className="nav-icon" />
                      <span>Organization Users</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/organizations/${user.organization?.id}/users/add`}
                      className={`nav-link ${
                        isActive(`/organizations/${user.organization?.id}/users/add`)
                          ? "active"
                          : ""
                      }`}
                    >
                      <PlusCircle className="nav-icon" />
                      <span>Add User</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>&copy; 2024 Find Cargo. All rights reserved.</p>
          </div>
          <div className="footer-right">
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Us</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return <AppLayout />;
}

export default App;
