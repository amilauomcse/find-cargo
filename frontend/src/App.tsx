import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InquiriesDashboard from "./components/InquiriesDashboard";
import AddInquiry from "./components/AddInquiry";
import SalesCallsDashboard from "./components/SalesCallsDashboard";
import AddSalesCall from "./components/AddSalesCall";
import RatesDashboard from "./components/RatesDashboard";
import AddRates from "./components/AddRates";
import { Home, Phone, BarChart, PlusCircle } from "lucide-react";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo-section">
            <img src="logo.svg" alt="Logo" className="logo-img" />
            <span className="logo-text">Dashboard</span>
          </div>
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
            <Route path="/inquiries" element={<InquiriesDashboard />} />
            <Route path="/inquiries/add" element={<AddInquiry />} />
            <Route path="/salesCalls" element={<SalesCallsDashboard />} />
            <Route path="/salesCalls/add" element={<AddSalesCall />} />
            <Route path="/rates" element={<RatesDashboard />} />
            <Route path="/rates/add" element={<AddRates />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
