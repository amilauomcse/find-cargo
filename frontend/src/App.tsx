import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InquiriesDashboard from "./components/InquiriesDashboard";
import AddInquiry from "./components/AddInquiry";
import SalesCallsDashboard from "./components/SalesCallsDashboard";
import AddSalesCall from "./components/AddSalesCall";
import RatesDashboard from "./components/RatesDashboard";
import AddRates from "./components/AddRates";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            {/* Replace the src with your logo path or use text */}
            <img src="logo.svg" alt="Logo" />
          </div>
          <nav className="menu">
            <ul>
              <li>
                <Link to="/inquiries">Inquiries Dashboard</Link>
              </li>
              <li>
                <Link to="/inquiries/add">Add Inquiry</Link>
              </li>
              <li>
                <Link to="/sales-calls">Sales Calls Dashboard</Link>
              </li>
              <li>
                <Link to="/sales-calls/add">Add Sales Call</Link>
              </li>
              <li>
                <Link to="/rates">Rates Dashboard</Link>
              </li>
              <li>
                <Link to="/rates/add">Add Rates</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="content">
          <Routes>
            <Route path="/inquiries" element={<InquiriesDashboard />} />
            <Route path="/inquiries/add" element={<AddInquiry />} />
            <Route path="/sales-calls" element={<SalesCallsDashboard />} />
            <Route path="/sales-calls/add" element={<AddSalesCall />} />
            <Route path="/rates" element={<RatesDashboard />} />
            <Route path="/rates/add" element={<AddRates />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
