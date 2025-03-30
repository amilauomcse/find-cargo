// AddSalesCall.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormStyles.css";

const AddSalesCall: React.FC = () => {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [contacts, setContacts] = useState("");
  const [contactedEmployee, setContactedEmployee] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [nextFollowupDate, setNextFollowupDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSalesCall = {
      customerName,
      contacts,
      contactedEmployee,
      createdDate,
      feedback,
      nextFollowupDate,
    };
    console.log("New Sales Call:", newSalesCall);
    navigate("/sales-calls");
  };

  return (
    <div className="form-container">
      <h1 className="form-header">Add Sales Call</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer Name:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div className="form-group">
          <label>Contacts:</label>
          <input
            type="text"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            placeholder="Enter contacts"
          />
        </div>
        <div className="form-group">
          <label>Contacted Employee:</label>
          <input
            type="text"
            value={contactedEmployee}
            onChange={(e) => setContactedEmployee(e.target.value)}
            placeholder="Enter contacted employee"
          />
        </div>
        <div className="form-group">
          <label>Created Date:</label>
          <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback"
          />
        </div>
        <div className="form-group">
          <label>Next Followup Date:</label>
          <input
            type="date"
            value={nextFollowupDate}
            onChange={(e) => setNextFollowupDate(e.target.value)}
          />
        </div>
        <button className="submit-button" type="submit">
          Submit Sales Call
        </button>
      </form>
    </div>
  );
};

export default AddSalesCall;
