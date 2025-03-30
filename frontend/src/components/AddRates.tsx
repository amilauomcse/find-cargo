import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddRates: React.FC = () => {
  const navigate = useNavigate();

  // State variables for form fields
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

  // Handle form submission
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

    // Replace this with your API call or desired processing logic
    console.log("New Rate:", newRate);

    // Navigate back to the rates dashboard after submission
    navigate("/rates");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Rates</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Agent Name: </label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Enter agent name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>ETD: </label>
          <input type="date" value={etd} onChange={(e) => setEtd(e.target.value)} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Carrier: </label>
          <input
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Enter carrier"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Container Type: </label>
          <select value={containerType} onChange={(e) => setContainerType(e.target.value)}>
            <option value="">Select Container Type</option>
            <option value="20ft">20ft</option>
            <option value="40ft">40ft</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Sea Freight: </label>
          <input
            type="number"
            value={seaFreight}
            onChange={(e) => setSeaFreight(Number(e.target.value))}
            placeholder="Enter sea freight cost"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Other Cost: </label>
          <input
            type="number"
            value={otherCost}
            onChange={(e) => setOtherCost(Number(e.target.value))}
            placeholder="Enter other cost"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Ex Cost: </label>
          <input
            type="number"
            value={exCost}
            onChange={(e) => setExCost(Number(e.target.value))}
            placeholder="Enter ex cost"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Total: </label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            placeholder="Enter total"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Transit Time: </label>
          <input
            type="text"
            value={transitTime}
            onChange={(e) => setTransitTime(e.target.value)}
            placeholder="e.g., 7 days"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Type: </label>
          <select value={rateType} onChange={(e) => setRateType(e.target.value)}>
            <option value="">Select Rate Type</option>
            <option value="Express">Express</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Created Date: </label>
          <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} />
        </div>
        <button type="submit">Submit Rate</button>
      </form>
    </div>
  );
};

export default AddRates;
