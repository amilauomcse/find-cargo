// AddRates.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, BarChart, DollarSign, Truck } from "lucide-react";
import { addNewRate } from "../services/api";
import PortSelect from "./PortSelect";

const AddRates: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [newRate, setNewRate] = useState({
    agentName: "",
    etd: "",
    carrier: "",
    containerType: "",
    seaFreight: 0,
    otherCost: 0,
    exCost: 0,
    total: 0,
    transitTime: "",
    rateType: "",
    createdDate: "",
    type: "" as "Export" | "Import",
    loadingPort: "",
    dischargePort: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRate({ ...newRate, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addNewRate(newRate);
      alert("New Rate Submitted Successfully");
      setNewRate({
        agentName: "",
        etd: "",
        carrier: "",
        containerType: "",
        seaFreight: 0,
        otherCost: 0,
        exCost: 0,
        total: 0,
        transitTime: "",
        rateType: "",
        createdDate: "",
        type: "" as "Export" | "Import",
        loadingPort: "",
        dischargePort: "",
      });
      navigate("/rates");
    } catch (error) {
      alert("Failed to submit the new rates data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem" }}>
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
          onClick={() => navigate("/rates")}
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h1 style={{ margin: "0 0 0.25rem 0", color: "var(--color-secondary)" }}>Add New Rate</h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>Create a new shipping rate</p>
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
            {/* Basic Information */}
            <div>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1.1rem",
                  color: "var(--color-secondary)",
                }}
              >
                <BarChart size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Basic Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Agent Name</label>
                  <input
                    name="agentName"
                    type="text"
                    value={newRate.agentName}
                    onChange={handleChange}
                    placeholder="Enter agent name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>ETD (Estimated Time of Departure)</label>
                  <input
                    name="etd"
                    type="date"
                    value={newRate.etd}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Carrier</label>
                  <input
                    name="carrier"
                    type="text"
                    value={newRate.carrier}
                    onChange={handleChange}
                    placeholder="Enter carrier name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Container Type</label>
                  <select
                    name="containerType"
                    value={newRate.containerType}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Container Type</option>
                    <option value="20ft">20ft</option>
                    <option value="40ft">40ft</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Transit Time</label>
                  <input
                    name="transitTime"
                    type="text"
                    value={newRate.transitTime}
                    onChange={handleChange}
                    placeholder="e.g., 7 days"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Cost Information */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-accent)" }}
              >
                <DollarSign size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Cost Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Sea Freight ($)</label>
                  <input
                    name="seaFreight"
                    type="number"
                    value={newRate.seaFreight}
                    onChange={handleChange}
                    placeholder="Enter sea freight cost"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Other Cost ($)</label>
                  <input
                    name="otherCost"
                    type="number"
                    value={newRate.otherCost}
                    onChange={handleChange}
                    placeholder="Enter other costs"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Ex Cost ($)</label>
                  <input
                    name="exCost"
                    type="number"
                    value={newRate.exCost}
                    onChange={handleChange}
                    placeholder="Enter ex cost"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Total ($)</label>
                  <input
                    name="total"
                    type="number"
                    value={newRate.total}
                    onChange={handleChange}
                    placeholder="Enter total cost"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Rate Type</label>
                  <select
                    name="rateType"
                    value={newRate.rateType}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Rate Type</option>
                    <option value="short">Short Term</option>
                    <option value="long">Long Term</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-primary)" }}>
              <Truck size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
              Route Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              <div className="form-group" style={{ margin: 0 }}>
                <label>Type</label>
                <select
                  name="type"
                  value={newRate.type}
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
                <label>Loading Port</label>
                <PortSelect
                  value={newRate.loadingPort}
                  onChange={(val) => setNewRate({ ...newRate, loadingPort: val })}
                  placeholder="Search or select port"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Discharge Port</label>
                <PortSelect
                  value={newRate.dischargePort}
                  onChange={(val) => setNewRate({ ...newRate, dischargePort: val })}
                  placeholder="Search or select port"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div
            style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/rates")}
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
              {isLoading ? "Adding..." : "Add Rate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRates;
