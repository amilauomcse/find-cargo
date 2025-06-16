import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import InquiriesDashboard from "./components/InquiriesDashboard";
import AddInquiry from "./components/AddInquiry";
import SalesCallsDashboard from "./components/SalesCallsDashboard";
import AddSalesCall from "./components/AddSalesCall";
import RatesDashboard from "./components/RatesDashboard";
import AddRates from "./components/AddRates";
import { Home, Phone, BarChart, PlusCircle, LogOut, User, Settings } from "lucide-react";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <img src="logo.svg" alt="Logo" className="header-logo" />
            <h1>Find Cargo</h1>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <User size={20} />
              <span>Profile</span>
            </button>
            <button className="header-btn">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className="header-btn">
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
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/inquiries" replace />} />
              <Route path="/inquiries" element={<InquiriesDashboard />} />
              <Route path="/inquiries/add" element={<AddInquiry />} />
              <Route path="/salesCalls" element={<SalesCallsDashboard />} />
              <Route path="/salesCalls/add" element={<AddSalesCall />} />
              <Route path="/rates" element={<RatesDashboard />} />
              <Route path="/rates/add" element={<AddRates />} />
              <Route path="*" element={<div className="error-state">404 - Page Not Found</div>} />
            </Routes>
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
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
