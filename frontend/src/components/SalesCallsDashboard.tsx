import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import axios from "axios";

interface SalesCall {
  id: number;
  companyName: string;
  contactedEmployee: string;
  contactNo: string;
  contactEmail: string;
  feedback: string;
  createdDate: string;
  followUpDate: string;
  agentName: string; //TODO: Replace with logged-in user's name after login is implemented
}

const SalesCallsDashboard: React.FC = () => {
  const [salesCalls, setSalesCalls] = useState<SalesCall[]>([]);
  const [filteredSalesCalls, setFilteredSalesCalls] = useState<SalesCall[]>(salesCalls);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [customerFilter, setCustomerFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  //fetch sales calls from API
  useEffect(() => {
    const fetchSalesCalls = async () => {
      try {
        const response = await axios.get("/api/sales-calls");
        setSalesCalls(response.data);
        setFilteredSalesCalls(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch sales calls");
      } finally {
        setLoading(false);
      }
    };
    fetchSalesCalls();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleFilterChange = () => {
    // You can implement filtering logic or API calls here
    console.log("Filters applied:", {
      customerName: customerFilter,
      contactedEmployee: employeeFilter,
    });

    const newFilteredSalesCalls = salesCalls.filter(
      (call) =>
        (customerFilter
          ? call.companyName.toLowerCase().includes(customerFilter.toLowerCase())
          : true) &&
        (employeeFilter
          ? call.contactedEmployee.toLowerCase().includes(employeeFilter.toLowerCase())
          : true)
    );
    setFilteredSalesCalls(newFilteredSalesCalls);
  };

  const clearFilters = () => {
    setCustomerFilter("");
    setEmployeeFilter("");
    setFilteredSalesCalls(salesCalls);
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h2>Sales Calls Dashboard</h2>
        <Link to="/salesCalls/add">
          <button className="primary-btn">Add Sales Call</button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="search-filter-bar">
        <div className="filter-group">
          <label>Customer Name:</label>
          <input
            type="text"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div className="filter-group">
          <label>Contacted Employee:</label>
          <input
            type="text"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            placeholder="Enter contacted employee"
          />
        </div>
        <button className="apply-filters-btn" onClick={handleFilterChange}>
          Apply Filters
        </button>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="table-card">
        <h3>Sales Calls</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contacted Employee</th>
              <th>Contact Number</th>
              <th>Contact Email</th>
              <th>Feedback</th>
              <th>Created Date</th>
              <th>Followup Date</th>
              <th>Agent Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesCalls.length > 0 ? (
              filteredSalesCalls.map((call) => (
                <tr key={call.id}>
                  <td>{call.companyName}</td>
                  <td>{call.contactedEmployee}</td>
                  <td>{call.contactNo}</td>
                  <td>{call.contactEmail}</td>
                  <td>{call.feedback}</td>
                  <td>{call.createdDate}</td>
                  <td>{call.followUpDate}</td>
                  <td>{call.agentName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11}>No sales calls found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SalesCallsDashboard;
