// RatesDashboard.tsx (modernized)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // We'll define modern styles in this CSS file
import { getRates } from "../services/api";

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
  transitTime: string;
  rateType: string;
  createdDate: string;
  type: string;
  loadingPort: string;
  dischargePort: string;
}

const RatesDashboard: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [filteredRates, setFilteredRates] = useState<Rate[]>(rates);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [containerType, setContainerType] = useState("");
  const [term, setTerm] = useState("");
  const [loadingPort, setLoadingPort] = useState("");
  const [dischargePort, setDischargePort] = useState("");
  const [cargoReadyDate, setCargoReadyDate] = useState("");

  //fetch rates from API
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await getRates();
        setRates(response);
        setFilteredRates(response);
        setError(null);
      } catch (err) {
        setError("Failed to fetch rates");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleFilterChange = () => {
    console.log("Filters applied:", {
      containerType,
      term,
      loadingPort,
      dischargePort,
      cargoReadyDate,
    });

    const newFilteredRates = rates.filter(
      (rate) =>
        (containerType ? rate.containerType === containerType : true) &&
        (term ? rate.type === term : true) &&
        (loadingPort ? rate.agentName === loadingPort : true) &&
        (dischargePort ? rate.carrier === dischargePort : true) &&
        (cargoReadyDate ? rate.etd === cargoReadyDate : true)
    );
    setFilteredRates(newFilteredRates);
  };

  const clearFilters = () => {
    setContainerType("");
    setTerm("");
    setLoadingPort("");
    setDischargePort("");
    setCargoReadyDate("");
    setFilteredRates(rates);
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
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
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
              <th>Rate Type</th>
              <th>Created Date</th>
              <th>Type</th>
              <th>Loading Port</th>
              <th>Discharge Port</th>
            </tr>
          </thead>
          <tbody>
            {filteredRates?.length > 0 ? (
              filteredRates?.map((rate) => (
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
                  <td>{rate.rateType}</td>
                  <td>{rate.createdDate}</td>
                  <td>{rate.type}</td>
                  <td>{rate.loadingPort}</td>
                  <td>{rate.dischargePort}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} style={{ textAlign: "center" }}>
                  No rates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatesDashboard;
