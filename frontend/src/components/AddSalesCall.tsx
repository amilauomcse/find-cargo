// AddSalesCall.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Phone, Building, User } from "lucide-react";
import { addSalesCall } from "../services/api";

const AddSalesCall: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [newSalesCall, setNewSalesCall] = useState({
    companyName: "",
    contactedEmployee: "",
    contactNo: "",
    contactEmail: "",
    feedback: "",
    createdDate: "",
    followUpDate: "",
    agentName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewSalesCall({ ...newSalesCall, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addSalesCall(newSalesCall);
      alert("Sales Call Added Successfully");
      setNewSalesCall({
        companyName: "",
        contactedEmployee: "",
        contactNo: "",
        contactEmail: "",
        feedback: "",
        createdDate: "",
        followUpDate: "",
        agentName: "",
      });
      navigate("/salesCalls");
    } catch (error) {
      alert("Failed to submit the new sales call data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
          padding: "1.5rem",
        }}
      >
        <button
          onClick={() => navigate("/salesCalls")}
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h1 style={{ margin: "0 0 0.25rem 0", color: "var(--color-accent)" }}>
            Add New Sales Call
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Log a new sales call interaction
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Company Information */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-accent)" }}
              >
                <Building size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Company Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Company Name</label>
                  <input
                    name="companyName"
                    type="text"
                    value={newSalesCall.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Contacted Employee</label>
                  <input
                    name="contactedEmployee"
                    type="text"
                    value={newSalesCall.contactedEmployee}
                    onChange={handleChange}
                    placeholder="Enter contacted employee name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Contact Number</label>
                  <input
                    name="contactNo"
                    type="tel"
                    value={newSalesCall.contactNo}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Contact Email</label>
                  <input
                    name="contactEmail"
                    type="email"
                    value={newSalesCall.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Call Details */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-primary)" }}
              >
                <Phone size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Call Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Agent Name</label>
                  <input
                    name="agentName"
                    type="text"
                    value={newSalesCall.agentName}
                    onChange={handleChange}
                    placeholder="Enter agent name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Call Date</label>
                  <input
                    name="createdDate"
                    type="date"
                    value={newSalesCall.createdDate}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Follow-up Date</label>
                  <input
                    name="followUpDate"
                    type="date"
                    value={newSalesCall.followUpDate}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div style={{ marginTop: "1.5rem" }}>
            <h3
              style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-secondary)" }}
            >
              <User size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
              Call Feedback
            </h3>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Call Summary & Feedback</label>
              <textarea
                name="feedback"
                value={newSalesCall.feedback}
                onChange={handleChange}
                placeholder="Describe the call details, discussion points, outcomes, and any follow-up actions needed..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div
            style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/salesCalls")}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Save size={20} />
              {isLoading ? "Adding..." : "Add Sales Call"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesCall;
