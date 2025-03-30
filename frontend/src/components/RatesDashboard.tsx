import React, { useState } from "react";
import { Link } from "react-router-dom";

// Update dummy data interface to include transitTime and type
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
  // Add more dummy entries as needed
];

const RatesDashboard: React.FC = () => {
  // States for filter values
  const [containerType, setContainerType] = useState("");
  const [term, setTerm] = useState("");
  const [loadingPort, setLoadingPort] = useState("");
  const [dischargePort, setDischargePort] = useState("");
  const [cargoReadyDate, setCargoReadyDate] = useState("");

  // Placeholder for filter logic
  const handleFilterChange = () => {
    // Implement filter logic based on the current state values
    console.log("Filters applied:", {
      containerType,
      term,
      loadingPort,
      dischargePort,
      cargoReadyDate,
    });
  };

  return (
    <div className="rates-dashboard" style={{ padding: "20px" }}>
      <h1>Rates Dashboard</h1>

      {/* Add Rates Button */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/rates/add">
          <button>Add Rates</button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="filters" style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Container Type:</label>
          <select value={containerType} onChange={(e) => setContainerType(e.target.value)}>
            <option value="">Select Container Type</option>
            <option value="20ft">20ft</option>
            <option value="40ft">40ft</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Term:</label>
          <select value={term} onChange={(e) => setTerm(e.target.value)}>
            <option value="">Select Term</option>
            <option value="short">Short Term</option>
            <option value="long">Long Term</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Loading Port:</label>
          <select value={loadingPort} onChange={(e) => setLoadingPort(e.target.value)}>
            <option value="">Select Loading Port</option>
            <option value="Port A">Port A</option>
            <option value="Port B">Port B</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Discharge Port:</label>
          <select value={dischargePort} onChange={(e) => setDischargePort(e.target.value)}>
            <option value="">Select Discharge Port</option>
            <option value="Port C">Port C</option>
            <option value="Port D">Port D</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Cargo Ready Date:</label>
          <input
            type="date"
            value={cargoReadyDate}
            onChange={(e) => setCargoReadyDate(e.target.value)}
          />
        </div>
        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Agent Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ETD</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Carrier</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Container Type</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Sea Freight</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Other Cost</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Ex Cost</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Transit Time</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {dummyRates.map((rate) => (
              <tr key={rate.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.agentName}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.etd}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.carrier}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.containerType}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.seaFreight}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.otherCost}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.exCost}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.total}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.transitTime}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.type}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{rate.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatesDashboard;
