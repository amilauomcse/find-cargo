import React, { useState } from "react";
import { Link } from "react-router-dom";

// Define an interface for an inquiry record
interface Inquiry {
  id: number;
  type: "Export" | "Import";
  method: "Sea Freight" | "Air Freight";
  portOfLoading: string;
  portOfDischarge: string;
  createdDate: string;
  rateOffered: number;
  clientName: string;
  clientContact: string;
  feedback: string;
  status: string;
  addedBy: string;
}

// Dummy data for demonstration purposes
const dummyInquiries: Inquiry[] = [
  {
    id: 1,
    type: "Export",
    method: "Sea Freight",
    portOfLoading: "Port A",
    portOfDischarge: "Port B",
    createdDate: "2025-03-25",
    rateOffered: 1500,
    clientName: "Client X",
    clientContact: "123-456-7890",
    feedback: "Positive",
    status: "Open",
    addedBy: "User 1",
  },
  {
    id: 2,
    type: "Import",
    method: "Air Freight",
    portOfLoading: "Port C",
    portOfDischarge: "Port D",
    createdDate: "2025-03-27",
    rateOffered: 2000,
    clientName: "Client Y",
    clientContact: "987-654-3210",
    feedback: "Pending",
    status: "Closed",
    addedBy: "User 2",
  },
  // Add additional dummy inquiries as needed
];

const InquiriesDashboard: React.FC = () => {
  // Filter state variables for Added By and Status
  const [addedByFilter, setAddedByFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Placeholder filter handler
  const handleFilterChange = () => {
    console.log("Filters applied:", { addedBy: addedByFilter, status: statusFilter });
    // Implement your filtering logic here
  };

  return (
    <div className="inquiries-dashboard" style={{ padding: "20px" }}>
      <h1>Inquiries Dashboard</h1>

      {/* Add Inquiry Button */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/inquiries/add">
          <button>Add Inquiry</button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="filters" style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Added By:</label>
          <input
            type="text"
            value={addedByFilter}
            onChange={(e) => setAddedByFilter(e.target.value)}
            placeholder="Enter name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            {/* Add more status options as needed */}
          </select>
        </div>
        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Method</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Port of Loading</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Port of Discharge</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Created Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Rate Offered</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Client Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Client Contact</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Feedback</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Added By</th>
            </tr>
          </thead>
          <tbody>
            {dummyInquiries
              // Optionally filter the dummy data (for demonstration)
              .filter(
                (inquiry) =>
                  (addedByFilter
                    ? inquiry.addedBy.toLowerCase().includes(addedByFilter.toLowerCase())
                    : true) && (statusFilter ? inquiry.status === statusFilter : true)
              )
              .map((inquiry) => (
                <tr key={inquiry.id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inquiry.type}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inquiry.method}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {inquiry.portOfLoading}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {inquiry.portOfDischarge}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {inquiry.createdDate}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {inquiry.rateOffered}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inquiry.clientName}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {inquiry.clientContact}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inquiry.feedback}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inquiry.status}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{inquiry.addedBy}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InquiriesDashboard;
