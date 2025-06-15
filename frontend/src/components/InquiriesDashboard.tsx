import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
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
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>(inquiries);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [addedByFilter, setAddedByFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  //fetch inquiries from API
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await getInquiries();
        setInquiries(response.data);
        setFilteredInquiries(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch inquiries");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleFilterChange = () => {
    // Implement filtering or API calls here
    console.log("Filters applied:", {
      addedBy: addedByFilter,
      status: statusFilter,
    });

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

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h2>Inquiries Dashboard</h2>
        <Link to="/inquiries/add">
          <button className="primary-btn">Add Inquiry</button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="search-filter-bar">
        <div className="filter-group">
          <label>Added By:</label>
          <input
            type="text"
            value={addedByFilter}
            onChange={(e) => setAddedByFilter(e.target.value)}
            placeholder="Enter name"
          />
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
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
        <h3>Inquiries</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Method</th>
              <th>Port of Loading</th>
              <th>Port of Discharge</th>
              <th>Created Date</th>
              <th>Rate Offered</th>
              <th>Client Name</th>
              <th>Client Contact No</th>
              <th>Client Contact Email</th>
              <th>Feedback</th>
              <th>Status</th>
              <th>Added By</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.type}</td>
                  <td>{inquiry.method}</td>
                  <td>{inquiry.portOfLoading}</td>
                  <td>{inquiry.portOfDischarge}</td>
                  <td>{inquiry.createdDate}</td>
                  <td>{inquiry.offeredRate}</td>
                  <td>{inquiry.clientName}</td>
                  <td>{inquiry.clientContactNo}</td>
                  <td>{inquiry.clientContactEmail}</td>
                  <td>{inquiry.feedback}</td>
                  <td>{inquiry.status}</td>
                  <td>{inquiry.addedBy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11}>No inquiries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InquiriesDashboard;
