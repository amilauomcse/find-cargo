import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSalesCall: React.FC = () => {
  const navigate = useNavigate();

  // State variables for the form fields
  const [customerName, setCustomerName] = useState("");
  const [contacts, setContacts] = useState("");
  const [contactedEmployee, setContactedEmployee] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [nextFollowupDate, setNextFollowupDate] = useState("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create the sales call object with form data
    const newSalesCall = {
      customerName,
      contacts,
      contactedEmployee,
      createdDate,
      feedback,
      nextFollowupDate,
    };

    // Replace this with your API call logic or other processing
    console.log("New Sales Call:", newSalesCall);

    // Navigate back to the Sales Calls Dashboard after submission
    navigate("/sales-calls");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Sales Call</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Customer Name: </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Contacts: </label>
          <input
            type="text"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            placeholder="Enter contacts"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Contacted Employee: </label>
          <input
            type="text"
            value={contactedEmployee}
            onChange={(e) => setContactedEmployee(e.target.value)}
            placeholder="Enter contacted employee"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Created Date: </label>
          <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Feedback: </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Next Followup Date: </label>
          <input
            type="date"
            value={nextFollowupDate}
            onChange={(e) => setNextFollowupDate(e.target.value)}
          />
        </div>
        <button type="submit">Submit Sales Call</button>
      </form>
    </div>
  );
};

export default AddSalesCall;
