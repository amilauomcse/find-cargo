import { Outlet, Link } from "react-router-dom";
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
} from "lucide-react";
import "./App.css";

// Main App Layout Component
const AppLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();

  console.log("AppLayout - user:", user, "role:", user?.role, "isAuthenticated:", isAuthenticated);

  const handleLogout = async () => {
    await logout();
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
          <img src="logo.svg" alt="Logo" className="header-logo" />
          <h1>Find Cargo</h1>
          {user?.organization && <span className="org-name">- {user.organization.name}</span>}
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <ThemeToggle />
          <Link to="/profile" className="header-btn">
            <User size={20} />
            <span>Profile</span>
          </Link>
          <button className="header-btn">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="header-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="menu">
            <ul>
              <li>
                <Link to="/dashboard" className="menu-link">
                  <LayoutDashboard className="icon" /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/inquiries" className="menu-link">
                  <Home className="icon" /> Inquiries Dashboard
                </Link>
              </li>
              <li>
                <Link to="/inquiries/add" className="menu-link">
                  <PlusCircle className="icon" /> Add Inquiry
                </Link>
              </li>
              <li>
                <Link to="/salesCalls" className="menu-link">
                  <Phone className="icon" /> Sales Calls Dashboard
                </Link>
              </li>
              <li>
                <Link to="/salesCalls/add" className="menu-link">
                  <PlusCircle className="icon" /> Add Sales Call
                </Link>
              </li>
              <li>
                <Link to="/rates" className="menu-link">
                  <BarChart className="icon" /> Rates Dashboard
                </Link>
              </li>
              <li>
                <Link to="/rates/add" className="menu-link">
                  <PlusCircle className="icon" /> Add Rates
                </Link>
              </li>

              {/* Organization Management (Root only) */}
              {user?.role === "root" && (
                <>
                  <li className="menu-separator">
                    <span>Organization Management</span>
                  </li>
                  <li>
                    <Link to="/organizations" className="menu-link">
                      <Building className="icon" /> Organizations
                    </Link>
                  </li>
                  <li>
                    <Link to="/organizations/add" className="menu-link">
                      <PlusCircle className="icon" /> Add Organization
                    </Link>
                  </li>
                  <li>
                    <Link to="/users" className="menu-link">
                      <Users className="icon" /> All Users
                    </Link>
                  </li>
                  <li>
                    <Link to="/users/add" className="menu-link">
                      <PlusCircle className="icon" /> Add User
                    </Link>
                  </li>
                  <li className="menu-separator">
                    <span>System Management</span>
                  </li>
                  <li>
                    <Link to="/audit" className="menu-link">
                      <FileText className="icon" /> Audit Logs
                    </Link>
                  </li>
                </>
              )}

              {/* User Management (Admin only) */}
              {user?.role === "admin" && (
                <>
                  <li className="menu-separator">
                    <span>User Management</span>
                  </li>
                  <li>
                    <Link
                      to={`/organizations/${user.organization?.id}/users`}
                      className="menu-link"
                    >
                      <Users className="icon" /> Organization Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/organizations/${user.organization?.id}/users/add`}
                      className="menu-link"
                    >
                      <PlusCircle className="icon" /> Add User
                    </Link>
                  </li>
                </>
              )}
            </ul>
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
          <p>&copy; 2024 Find Cargo. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
            <a href="#">Support</a>
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
