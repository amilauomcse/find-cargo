// AddRates.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormStyles.css";

const AddRates: React.FC = () => {
  const navigate = useNavigate();

  const [agentName, setAgentName] = useState("");
  const [etd, setEtd] = useState("");
  const [carrier, setCarrier] = useState("");
  const [containerType, setContainerType] = useState("");
  const [seaFreight, setSeaFreight] = useState<number | "">("");
  const [otherCost, setOtherCost] = useState<number | "">("");
  const [exCost, setExCost] = useState<number | "">("");
  const [total, setTotal] = useState<number | "">("");
  const [transitTime, setTransitTime] = useState("");
  const [rateType, setRateType] = useState("");
  const [createdDate, setCreatedDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate = {
      agentName,
      etd,
      carrier,
      containerType,
      seaFreight: seaFreight === "" ? 0 : seaFreight,
      otherCost: otherCost === "" ? 0 : otherCost,
      exCost: exCost === "" ? 0 : exCost,
      total: total === "" ? 0 : total,
      transitTime,
      rateType,
      createdDate,
    };
    console.log("New Rate:", newRate);
    navigate("/rates");
  };

  return (
    <div className="form-container">
      <h1 className="form-header">Add Rates</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Agent Name:</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Enter agent name"
          />
        </div>
        <div className="form-group">
          <label>ETD:</label>
          <input type="date" value={etd} onChange={(e) => setEtd(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Carrier:</label>
          <input
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Enter carrier"
          />
        </div>
        <div className="form-group">
          <label>Container Type:</label>
          <select value={containerType} onChange={(e) => setContainerType(e.target.value)}>
            <option value="">Select Container Type</option>
            <option value="20ft">20ft</option>
            <option value="40ft">40ft</option>
          </select>
        </div>
        <div className="form-group">
          <label>Sea Freight:</label>
          <input
            type="number"
            value={seaFreight}
            onChange={(e) => setSeaFreight(Number(e.target.value))}
            placeholder="Enter sea freight cost"
          />
        </div>
        <div className="form-group">
          <label>Other Cost:</label>
          <input
            type="number"
            value={otherCost}
            onChange={(e) => setOtherCost(Number(e.target.value))}
            placeholder="Enter other cost"
          />
        </div>
        <div className="form-group">
          <label>Ex Cost:</label>
          <input
            type="number"
            value={exCost}
            onChange={(e) => setExCost(Number(e.target.value))}
            placeholder="Enter ex cost"
          />
        </div>
        <div className="form-group">
          <label>Total:</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            placeholder="Enter total"
          />
        </div>
        <div className="form-group">
          <label>Transit Time:</label>
          <input
            type="text"
            value={transitTime}
            onChange={(e) => setTransitTime(e.target.value)}
            placeholder="e.g., 7 days"
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select value={rateType} onChange={(e) => setRateType(e.target.value)}>
            <option value="">Select Rate Type</option>
            <option value="Express">Express</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
        <div className="form-group">
          <label>Created Date:</label>
          <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} />
        </div>
        <button className="submit-button" type="submit">
          Submit Rate
        </button>
      </form>
    </div>
  );
};

export default AddRates;
