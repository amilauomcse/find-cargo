// RatesDashboard.tsx (modernized)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, X, BarChart } from "lucide-react";
import { getRates } from "../services/api";
import PortSelect from "./PortSelect";

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
  const [filteredRates, setFilteredRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerType, setContainerType] = useState("");
  const [term, setTerm] = useState("");
  const [loadingPort, setLoadingPort] = useState("");
  const [dischargePort, setDischargePort] = useState("");
  const [cargoReadyDate, setCargoReadyDate] = useState("");

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

  const handleFilterChange = () => {
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading rates...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
      {/* Page Header */}
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          padding: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--color-secondary)" }}>
            Rates Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Manage shipping rates and pricing ({filteredRates.length} total)
          </p>
        </div>
        <Link
          to="/rates/add"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <BarChart size={20} />
          Add Rates
        </Link>
      </div>

      {/* Filters Section */}
      <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Filter size={20} style={{ color: "var(--color-secondary)" }} />
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Filters</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label>Container Type</label>
            <select
              value={containerType}
              onChange={(e) => setContainerType(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Types</option>
              <option value="20ft">20ft</option>
              <option value="40ft">40ft</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Term</label>
            <select value={term} onChange={(e) => setTerm(e.target.value)} style={{ margin: 0 }}>
              <option value="">All Terms</option>
              <option value="short">Short Term</option>
              <option value="long">Long Term</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Loading Port</label>
            <PortSelect value={loadingPort} onChange={setLoadingPort} placeholder="All Ports" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Discharge Port</label>
            <PortSelect value={dischargePort} onChange={setDischargePort} placeholder="All Ports" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Cargo Ready Date</label>
            <input
              type="date"
              value={cargoReadyDate}
              onChange={(e) => setCargoReadyDate(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-primary"
              onClick={handleFilterChange}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Search size={16} />
              Apply
            </button>
            <button
              className="btn-secondary"
              onClick={clearFilters}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--color-bg-dark)",
                  borderBottom: "2px solid var(--color-border)",
                }}
              >
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Agent</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>ETD</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Carrier
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Container
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Sea Freight
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Other Cost
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Ex Cost
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Total</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Transit
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Type</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Route</th>
              </tr>
            </thead>
            <tbody>
              {filteredRates?.length > 0 ? (
                filteredRates.map((rate) => (
                  <tr
                    key={rate.id}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      transition: "background var(--transition)",
                    }}
                  >
                    <td style={{ padding: "0.75rem", fontWeight: "500" }}>{rate.agentName}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(rate.etd).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem" }}>{rate.carrier}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          background: "var(--color-secondary)",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {rate.containerType}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: "600" }}>${rate.seaFreight}</td>
                    <td style={{ padding: "0.75rem" }}>${rate.otherCost}</td>
                    <td style={{ padding: "0.75rem" }}>${rate.exCost}</td>
                    <td
                      style={{
                        padding: "0.75rem",
                        fontWeight: "700",
                        color: "var(--color-primary)",
                      }}
                    >
                      ${rate.total}
                    </td>
                    <td style={{ padding: "0.75rem" }}>{rate.transitTime}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          background:
                            rate.type === "short" ? "var(--color-success)" : "var(--color-accent)",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {rate.type}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div>
                        <div style={{ fontWeight: "500", fontSize: "0.85rem" }}>
                          {rate.loadingPort}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                          → {rate.dischargePort}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={11}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--color-text-light)",
                      fontSize: "1.1rem",
                    }}
                  >
                    No rates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RatesDashboard;
