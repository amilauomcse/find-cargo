import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Filter, X } from "lucide-react";
import { getInquiries } from "../services/api";

interface Inquiry {
  id: number;
  type: "Export" | "Import";
  method: "Sea Freight" | "Air Freight";
  portOfLoading: string;
  portOfDischarge: string;
  createdDate: string;
  offeredRate: number;
  clientName: string;
  clientContactNo: string;
  clientContactEmail: string;
  feedback: string;
  status: string;
  addedBy: string;
}

const InquiriesDashboard: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedByFilter, setAddedByFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await getInquiries();
        setInquiries(response);
        setFilteredInquiries(response);
        setError(null);
      } catch (err) {
        console.error("Error in fetchInquiries:", err);
        setError("Failed to fetch inquiries");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleFilterChange = () => {
    const newFilteredInquiries = inquiries.filter(
      (inquiry) =>
        (addedByFilter
          ? inquiry.addedBy.toLowerCase().includes(addedByFilter.toLowerCase())
          : true) && (statusFilter ? inquiry.status === statusFilter : true)
    );
    setFilteredInquiries(newFilteredInquiries);
  };

  const clearFilters = () => {
    setAddedByFilter("");
    setStatusFilter("");
    setFilteredInquiries(inquiries);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading inquiries...</p>
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
          <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>
            Inquiries Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Manage and track customer inquiries ({filteredInquiries.length} total)
          </p>
        </div>
        <Link
          to="/inquiries/add"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <PlusCircle size={20} />
          Add Inquiry
        </Link>
      </div>

      {/* Filters Section */}
      <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Filter size={20} style={{ color: "var(--color-primary)" }} />
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
            <label>Added By</label>
            <input
              type="text"
              value={addedByFilter}
              onChange={(e) => setAddedByFilter(e.target.value)}
              placeholder="Enter name"
              style={{ margin: 0 }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
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
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Type</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Method</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Loading Port
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Discharge Port
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Created Date
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Rate</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Client</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Contact
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Added By
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries?.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      transition: "background var(--transition)",
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          background:
                            inquiry.type === "Export"
                              ? "var(--color-success)"
                              : "var(--color-secondary)",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {inquiry.type}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>{inquiry.method}</td>
                    <td style={{ padding: "0.75rem" }}>{inquiry.portOfLoading}</td>
                    <td style={{ padding: "0.75rem" }}>{inquiry.portOfDischarge}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(inquiry.createdDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: "600" }}>
                      ${inquiry.offeredRate}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>{inquiry.clientName}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                          {inquiry.clientContactEmail}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>{inquiry.clientContactNo}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          background:
                            inquiry.status === "Open"
                              ? "var(--color-success)"
                              : "var(--color-error)",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>{inquiry.addedBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--color-text-light)",
                      fontSize: "1.1rem",
                    }}
                  >
                    No inquiries found.
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

export default InquiriesDashboard;
