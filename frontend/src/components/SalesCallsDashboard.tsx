import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, X, Phone } from "lucide-react";
import { getSalesCalls } from "../services/api";

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
  const [filteredSalesCalls, setFilteredSalesCalls] = useState<SalesCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerFilter, setCustomerFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  useEffect(() => {
    const fetchSalesCalls = async () => {
      try {
        const response = await getSalesCalls();
        setSalesCalls(response);
        setFilteredSalesCalls(response);
        setError(null);
      } catch (err) {
        setError("Failed to fetch sales calls");
      } finally {
        setLoading(false);
      }
    };
    fetchSalesCalls();
  }, []);

  const handleFilterChange = () => {
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading sales calls...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
      {/* Page Header */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          padding: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--color-accent)" }}>
            Sales Calls Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Track and manage sales calls ({filteredSalesCalls.length} total)
          </p>
        </div>
        <Link
          to="/salesCalls/add"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Phone size={20} />
          Add Sales Call
        </Link>
      </div>

      {/* Filters Section */}
      <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Filter size={20} style={{ color: "var(--color-accent)" }} />
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Filters</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label>Customer Name</label>
            <input
              type="text"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              placeholder="Enter customer name"
              style={{ margin: 0 }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Contacted Employee</label>
            <input
              type="text"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              placeholder="Enter employee name"
              style={{ margin: 0 }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-primary"
              onClick={handleFilterChange}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Search size={16} />
              Apply
            </button>
            <button
              className="btn-secondary"
              onClick={clearFilters}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--color-bg-dark)",
                  borderBottom: "2px solid var(--color-border)",
                }}
              >
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Company
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Contacted Employee
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Contact Info
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Feedback
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Created Date
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Follow-up Date
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Agent</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesCalls?.length > 0 ? (
                filteredSalesCalls.map((call) => (
                  <tr
                    key={call.id}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      transition: "background var(--transition)",
                    }}
                  >
                    <td style={{ padding: "0.75rem", fontWeight: "500" }}>{call.companyName}</td>
                    <td style={{ padding: "0.75rem" }}>{call.contactedEmployee}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>{call.contactNo}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                          {call.contactEmail}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem", maxWidth: "200px" }}>
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "0.85rem",
                        }}
                      >
                        {call.feedback}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(call.createdDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {call.followUpDate ? new Date(call.followUpDate).toLocaleDateString() : "-"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          background: "var(--color-primary)",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {call.agentName}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--color-text-light)",
                      fontSize: "1.1rem",
                    }}
                  >
                    No sales calls found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesCallsDashboard;
