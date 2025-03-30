// AddInquiry.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormStyles.css"; // Import the form styles

const AddInquiry: React.FC = () => {
  const navigate = useNavigate();

  const [type, setType] = useState<"Export" | "Import" | "">("");
  const [method, setMethod] = useState<"Sea Freight" | "Air Freight" | "">("");
  const [portOfLoading, setPortOfLoading] = useState("");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [rateOffered, setRateOffered] = useState<number | "">("");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [addedBy, setAddedBy] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInquiry = {
      type,
      method,
      portOfLoading,
      portOfDischarge,
      createdDate,
      rateOffered: rateOffered === "" ? 0 : rateOffered,
      clientName,
      clientContact,
      feedback,
      status,
      addedBy,
    };
    console.log("New Inquiry:", newInquiry);
    navigate("/inquiries");
  };

  return (
    <div className="form-container">
      <h1 className="form-header">Add Inquiry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value as "Export" | "Import")}>
            <option value="">Select Type</option>
            <option value="Export">Export</option>
            <option value="Import">Import</option>
          </select>
        </div>
        <div className="form-group">
          <label>Method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "Sea Freight" | "Air Freight")}
          >
            <option value="">Select Method</option>
            <option value="Sea Freight">Sea Freight</option>
            <option value="Air Freight">Air Freight</option>
          </select>
        </div>
        <div className="form-group">
          <label>Port of Loading:</label>
          <input
            type="text"
            value={portOfLoading}
            onChange={(e) => setPortOfLoading(e.target.value)}
            placeholder="Enter Port of Loading"
          />
        </div>
        <div className="form-group">
          <label>Port of Discharge:</label>
          <input
            type="text"
            value={portOfDischarge}
            onChange={(e) => setPortOfDischarge(e.target.value)}
            placeholder="Enter Port of Discharge"
          />
        </div>
        <div className="form-group">
          <label>Created Date:</label>
          <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Rate Offered:</label>
          <input
            type="number"
            value={rateOffered}
            onChange={(e) => setRateOffered(Number(e.target.value))}
            placeholder="Enter Rate Offered"
          />
        </div>
        <div className="form-group">
          <label>Client Name:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter Client Name"
          />
        </div>
        <div className="form-group">
          <label>Client Contact:</label>
          <input
            type="text"
            value={clientContact}
            onChange={(e) => setClientContact(e.target.value)}
            placeholder="Enter Client Contact"
          />
        </div>
        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter Feedback"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Added By:</label>
          <input
            type="text"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <button className="submit-button" type="submit">
          Submit Inquiry
        </button>
      </form>
    </div>
  );
};

export default AddInquiry;
