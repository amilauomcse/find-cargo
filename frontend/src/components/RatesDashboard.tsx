// RatesDashboard.tsx (modernized)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // We'll define modern styles in this CSS file

interface Rate {
  id: number;
  agentName: string;
  etd: string;
  carrier: string;
  containerType: string;
  seaFreight: number;
  otherCost: number;
  exCost: number;
  total: number;
  createdDate: string;
  transitTime: string;
  type: string;
}

const dummyRates: Rate[] = [
  {
    id: 1,
    agentName: "Agent A",
    etd: "2025-04-01",
    carrier: "Carrier X",
    containerType: "20ft",
    seaFreight: 1000,
    otherCost: 200,
    exCost: 50,
    total: 1250,
    createdDate: "2025-03-30",
    transitTime: "7 days",
    type: "Express",
  },
  {
    id: 2,
    agentName: "Agent B",
    etd: "2025-04-05",
    carrier: "Carrier Y",
    containerType: "40ft",
    seaFreight: 1500,
    otherCost: 300,
    exCost: 70,
    total: 1870,
    createdDate: "2025-03-28",
    transitTime: "10 days",
    type: "Standard",
  },
];

const RatesDashboard: React.FC = () => {
  const [containerType, setContainerType] = useState("");
  const [term, setTerm] = useState("");
  const [loadingPort, setLoadingPort] = useState("");
  const [dischargePort, setDischargePort] = useState("");
  const [cargoReadyDate, setCargoReadyDate] = useState("");

  const handleFilterChange = () => {
    console.log("Filters applied:", {
      containerType,
      term,
      loadingPort,
      dischargePort,
      cargoReadyDate,
    });
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h2>Rates Dashboard</h2>
        <Link to="/rates/add">
          <button className="primary-btn">Add Rates</button>
        </Link>
      </div>

      {/* Filters */}
      <div className="search-filter-bar">
        <div className="filter-group">
          <label>Container Type:</label>
          <select value={containerType} onChange={(e) => setContainerType(e.target.value)}>
            <option value="">Select Container Type</option>
            <option value="20ft">20ft</option>
            <option value="40ft">40ft</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Term:</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)}>
            <option value="">Select Term</option>
            <option value="short">Short Term</option>
            <option value="long">Long Term</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Loading Port:</label>
          <select value={loadingPort} onChange={(e) => setLoadingPort(e.target.value)}>
            <option value="">Select Loading Port</option>
            <option value="Port A">Port A</option>
            <option value="Port B">Port B</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Discharge Port:</label>
          <select value={dischargePort} onChange={(e) => setDischargePort(e.target.value)}>
            <option value="">Select Discharge Port</option>
            <option value="Port C">Port C</option>
            <option value="Port D">Port D</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Cargo Ready Date:</label>
          <input
            type="date"
            value={cargoReadyDate}
            onChange={(e) => setCargoReadyDate(e.target.value)}
          />
        </div>
        <button className="apply-filters-btn" onClick={handleFilterChange}>
          Apply Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="table-card">
        <h3>Rates</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>ETD</th>
              <th>Carrier</th>
              <th>Container Type</th>
              <th>Sea Freight</th>
              <th>Other Cost</th>
              <th>Ex Cost</th>
              <th>Total</th>
              <th>Transit Time</th>
              <th>Type</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {dummyRates.map((rate) => (
              <tr key={rate.id}>
                <td>{rate.agentName}</td>
                <td>{rate.etd}</td>
                <td>{rate.carrier}</td>
                <td>{rate.containerType}</td>
                <td>{rate.seaFreight}</td>
                <td>{rate.otherCost}</td>
                <td>{rate.exCost}</td>
                <td>{rate.total}</td>
                <td>{rate.transitTime}</td>
                <td>{rate.type}</td>
                <td>{rate.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatesDashboard;
