// AddInquiry.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, FileText } from "lucide-react";
import { addInquiry } from "../services/api";
import PortSelect from "./PortSelect";

const AddInquiry: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "" as "Export" | "Import",
    method: "" as "Sea Freight" | "Air Freight" | "",
    portOfLoading: "",
    portOfDischarge: "",
    offeredRate: 0,
    clientName: "",
    clientContactNo: "",
    clientContactEmail: "",
    feedback: "",
    status: "",
    addedBy: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Set default values for required fields
      const inquiryData = {
        ...formData,
        status: "Open", // Set default status
        addedBy: "Current User", // This should come from auth context
      };

      await addInquiry(inquiryData);
      alert("Inquiry Submitted Successfully");
      setFormData({
        type: "" as "Export" | "Import",
        method: "" as "Sea Freight" | "Air Freight" | "",
        portOfLoading: "",
        portOfDischarge: "",
        offeredRate: 0,
        clientName: "",
        clientContactNo: "",
        clientContactEmail: "",
        feedback: "",
        status: "",
        addedBy: "",
      });
      navigate("/inquiries");
    } catch (error) {
      alert("Failed to submit inquiry");
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
          onClick={() => navigate("/inquiries")}
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h1 style={{ margin: "0 0 0.25rem 0", color: "var(--color-primary)" }}>
            Add New Inquiry
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Create a new customer inquiry
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
            {/* Customer Information */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-primary)" }}
              >
                <User size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Customer Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Customer Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="clientContactEmail"
                    value={formData.clientContactEmail}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="clientContactNo"
                    value={formData.clientContactNo}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-accent)" }}
              >
                <FileText size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Shipping Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Type</option>
                    <option value="Export">Export</option>
                    <option value="Import">Import</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Method</label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Method</option>
                    <option value="Sea Freight">Sea Freight</option>
                    <option value="Air Freight">Air Freight</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Port of Loading</label>
                  <PortSelect
                    value={formData.portOfLoading}
                    onChange={(val) => setFormData({ ...formData, portOfLoading: val })}
                    placeholder="Search or select port"
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Port of Discharge</label>
                  <PortSelect
                    value={formData.portOfDischarge}
                    onChange={(val) => setFormData({ ...formData, portOfDischarge: val })}
                    placeholder="Search or select port"
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Offered Rate ($)</label>
                  <input
                    type="number"
                    name="offeredRate"
                    value={formData.offeredRate}
                    onChange={handleChange}
                    placeholder="Enter rate"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div style={{ marginTop: "1.5rem" }}>
            <h3
              style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-secondary)" }}
            >
              <FileText size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
              Inquiry Details
            </h3>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Inquiry Description</label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Describe the inquiry details, requirements, and any special instructions..."
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
              onClick={() => navigate("/inquiries")}
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
              {isLoading ? "Adding..." : "Add Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInquiry;
