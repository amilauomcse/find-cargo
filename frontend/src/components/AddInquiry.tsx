import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddInquiry: React.FC = () => {
  const navigate = useNavigate();

  // State variables for the form fields
  const [type, setType] = useState<"Export" | "Import" | "">("");
  const [method, setMethod] = useState<"Sea Freight" | "Air Freight" | "">("");
  const [portOfLoading, setPortOfLoading] = useState("");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [rateOffered, setRateOffered] = useState<number | "">("");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<string>("");
  const [addedBy, setAddedBy] = useState("");

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create the inquiry object with form data
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

    // Replace this with your API call logic or other processing
    console.log("New Inquiry:", newInquiry);

    // Optionally navigate back to the dashboard after submission
    navigate("/inquiries");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Inquiry</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Type: </label>
          <select value={type} onChange={(e) => setType(e.target.value as "Export" | "Import")}>
            <option value="">Select Type</option>
            <option value="Export">Export</option>
            <option value="Import">Import</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Method: </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "Sea Freight" | "Air Freight")}
          >
            <option value="">Select Method</option>
            <option value="Sea Freight">Sea Freight</option>
            <option value="Air Freight">Air Freight</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Port of Loading: </label>
          <input
            type="text"
            value={portOfLoading}
            onChange={(e) => setPortOfLoading(e.target.value)}
            placeholder="Enter Port of Loading"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Port of Discharge: </label>
          <input
            type="text"
            value={portOfDischarge}
            onChange={(e) => setPortOfDischarge(e.target.value)}
            placeholder="Enter Port of Discharge"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Created Date: </label>
          <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Rate Offered: </label>
          <input
            type="number"
            value={rateOffered}
            onChange={(e) => setRateOffered(Number(e.target.value))}
            placeholder="Enter Rate Offered"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Client Name: </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter Client Name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Client Contact: </label>
          <input
            type="text"
            value={clientContact}
            onChange={(e) => setClientContact(e.target.value)}
            placeholder="Enter Client Contact"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Feedback: </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter Feedback"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Status: </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            {/* Add more status options as needed */}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Added By: </label>
          <input
            type="text"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <button type="submit">Submit Inquiry</button>
      </form>
    </div>
  );
};

export default AddInquiry;
