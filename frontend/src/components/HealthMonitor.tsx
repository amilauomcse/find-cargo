import React, { useState, useEffect } from "react";
import "./HealthMonitor.css";

interface ServiceHealth {
  status: "healthy" | "unhealthy" | "degraded";
  responseTime?: number;
  error?: string;
  details?: any;
}

interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  services: {
    backend: ServiceHealth;
    systemDatabase: ServiceHealth;
    authDatabase: ServiceHealth;
    frontend: ServiceHealth;
  };
  uptime: number;
  version: string;
}

const HealthMonitor: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [detailedData, setDetailedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/health");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch health data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedData = async () => {
    try {
      const response = await fetch("http://localhost:3000/health/detailed");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDetailedData(data);
    } catch (err) {
      console.error("Failed to fetch detailed health data:", err);
    }
  };

  useEffect(() => {
    fetchHealthData();
    fetchDetailedData();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchHealthData();
        fetchDetailedData();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "#10b981";
      case "degraded":
        return "#f59e0b";
      case "unhealthy":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return "✅";
      case "degraded":
        return "⚠️";
      case "unhealthy":
        return "❌";
      default:
        return "❓";
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatMemory = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  if (loading && !healthData) {
    return (
      <div className="health-monitor">
        <div className="loading">Loading health data...</div>
      </div>
    );
  }

  return (
    <div className="health-monitor">
      <div className="health-header">
        <h1>System Health Monitor</h1>
        <div className="health-controls">
          <button onClick={fetchHealthData} className="refresh-btn" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <label className="auto-refresh">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto Refresh (30s)
          </label>
        </div>
      </div>

      {error && <div className="error-message">Error: {error}</div>}

      {healthData && (
        <>
          <div className="overall-status">
            <div
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(healthData.status) }}
            >
              {getStatusIcon(healthData.status)} {healthData.status.toUpperCase()}
            </div>
            <div className="status-details">
              <p>Version: {healthData.version}</p>
              <p>Uptime: {formatUptime(healthData.uptime)}</p>
              <p>Last Check: {new Date(healthData.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div className="services-grid">
            {Object.entries(healthData.services).map(([serviceName, service]) => (
              <div key={serviceName} className="service-card">
                <div className="service-header">
                  <h3>
                    {serviceName
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <div
                    className="service-status"
                    style={{ backgroundColor: getStatusColor(service.status) }}
                  >
                    {getStatusIcon(service.status)} {service.status}
                  </div>
                </div>
                <div className="service-details">
                  {service.responseTime && <p>Response Time: {service.responseTime}ms</p>}
                  {service.error && <p className="error">Error: {service.error}</p>}
                  {service.details && (
                    <div className="service-details-extra">
                      <pre>{JSON.stringify(service.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {detailedData && (
            <div className="detailed-info">
              <h2>Detailed System Information</h2>
              <div className="detailed-grid">
                <div className="detail-card">
                  <h3>System Resources</h3>
                  <p>Memory Usage: {formatMemory(detailedData.system?.memory?.heapUsed || 0)}</p>
                  <p>Platform: {detailedData.system?.platform}</p>
                  <p>Node Version: {detailedData.system?.nodeVersion}</p>
                  <p>PID: {detailedData.system?.pid}</p>
                </div>
                <div className="detail-card">
                  <h3>Environment</h3>
                  <p>Node Env: {detailedData.environment?.nodeEnv}</p>
                  <p>App Env: {detailedData.environment?.appEnv}</p>
                </div>
                {detailedData.databases && (
                  <div className="detail-card">
                    <h3>Database Connections</h3>
                    <div className="db-connections">
                      <div>
                        <h4>System DB</h4>
                        <p>Active: {detailedData.databases.system?.connectionCount || 0}</p>
                        <p>Idle: {detailedData.databases.system?.idleCount || 0}</p>
                      </div>
                      <div>
                        <h4>Auth DB</h4>
                        <p>Active: {detailedData.databases.auth?.connectionCount || 0}</p>
                        <p>Idle: {detailedData.databases.auth?.idleCount || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HealthMonitor;
