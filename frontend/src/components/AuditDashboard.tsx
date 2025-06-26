import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  X,
  FileText,
  Calendar,
  User,
  Building,
  Activity,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

interface AuditLog {
  id: number;
  action: string;
  resourceType: string;
  resourceId?: number;
  description: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  organization?: {
    id: number;
    name: string;
  };
}

interface AuditStats {
  total: number;
  todayCount: number;
  actionBreakdown: Array<{ action: string; count: string }>;
  resourceTypeBreakdown: Array<{ resourceType: string; count: string }>;
}

const AuditDashboard: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [actionFilter, setActionFilter] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditStats();
  }, [currentPage]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "50",
      });

      if (actionFilter) params.append("action", actionFilter);
      if (resourceTypeFilter) params.append("resourceType", resourceTypeFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await api.get(`/audit?${params}`);
      setAuditLogs(response.data.auditLogs);
      setFilteredLogs(response.data.auditLogs);
      setTotalPages(response.data.totalPages);
      setTotalLogs(response.data.total);
      setError(null);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      const response = await api.get("/audit/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching audit stats:", err);
    }
  };

  const clearFilters = () => {
    setActionFilter("");
    setResourceTypeFilter("");
    setStartDate("");
    setEndDate("");
    setSearchFilter("");
    setCurrentPage(1);
    setFilteredLogs(auditLogs);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchAuditLogs();
  };

  const getActionDisplayName = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getResourceTypeDisplayName = (resourceType: string) => {
    return resourceType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getActionColor = (action: string) => {
    if (action.includes("created")) return "var(--color-success)";
    if (action.includes("updated")) return "var(--color-primary)";
    if (action.includes("deleted")) return "var(--color-error)";
    if (action.includes("login") || action.includes("logout")) return "var(--color-accent)";
    return "var(--color-secondary)";
  };

  const getResourceTypeIcon = (resourceType: string) => {
    switch (resourceType) {
      case "user":
        return <User size={16} />;
      case "organization":
        return <Building size={16} />;
      case "inquiry":
        return <FileText size={16} />;
      case "sales_call":
        return <Activity size={16} />;
      case "rate":
        return <FileText size={16} />;
      case "system":
        return <Activity size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const exportAuditLogs = () => {
    const csvContent = [
      [
        "ID",
        "Action",
        "Resource Type",
        "Description",
        "User",
        "Organization",
        "IP Address",
        "Created At",
      ],
      ...filteredLogs.map((log) => [
        log.id,
        getActionDisplayName(log.action),
        getResourceTypeDisplayName(log.resourceType),
        log.description,
        log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.email})` : "N/A",
        log.organization?.name || "N/A",
        log.ipAddress || "N/A",
        new Date(log.createdAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && !auditLogs.length) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading audit logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button onClick={fetchAuditLogs} className="btn-primary">
          Try Again
        </button>
      </div>
    );
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
          <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>Audit Logs</h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Track all system activities and user actions ({totalLogs} total logs)
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={fetchAuditLogs}
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button
            onClick={exportAuditLogs}
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={20} style={{ color: "var(--color-primary)" }} />
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>{stats.total}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--color-text-light)" }}>
                  Total Logs
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={20} style={{ color: "var(--color-success)" }} />
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>{stats.todayCount}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--color-text-light)" }}>Today</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={20} style={{ color: "var(--color-accent)" }} />
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                  {stats.actionBreakdown.length}
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--color-text-light)" }}>
                  Action Types
                </div>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Building size={20} style={{ color: "var(--color-secondary)" }} />
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                  {stats.resourceTypeBreakdown.length}
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--color-text-light)" }}>
                  Resource Types
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Filter size={20} style={{ color: "var(--color-accent)" }} />
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Filters</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <label>Search</label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by description or user"
              style={{ margin: 0 }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Actions</option>
              <option value="user_created">User Created</option>
              <option value="user_updated">User Updated</option>
              <option value="user_deleted">User Deleted</option>
              <option value="user_login">User Login</option>
              <option value="user_logout">User Logout</option>
              <option value="organization_created">Organization Created</option>
              <option value="organization_updated">Organization Updated</option>
              <option value="inquiry_created">Inquiry Created</option>
              <option value="sales_call_created">Sales Call Created</option>
              <option value="rate_created">Rate Created</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Resource Type</label>
            <select
              value={resourceTypeFilter}
              onChange={(e) => setResourceTypeFilter(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Types</option>
              <option value="user">User</option>
              <option value="organization">Organization</option>
              <option value="inquiry">Inquiry</option>
              <option value="sales_call">Sales Call</option>
              <option value="rate">Rate</option>
              <option value="system">System</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-primary"
              onClick={applyFilters}
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

      {/* Audit Logs Table */}
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
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Action</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Description
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>User</th>
                {user?.role === "root" && (
                  <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                    Organization
                  </th>
                )}
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  IP Address
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Created
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs?.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      transition: "background var(--transition)",
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {getResourceTypeIcon(log.resourceType)}
                        <span
                          style={{
                            background: getActionColor(log.action),
                            color: "#fff",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                          }}
                        >
                          {getActionDisplayName(log.action)}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ maxWidth: "300px", wordBreak: "break-word" }}>
                        {log.description}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {log.user ? (
                        <div>
                          <div style={{ fontWeight: "500" }}>
                            {log.user.firstName} {log.user.lastName}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                            {log.user.email}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "var(--color-text-light)" }}>System</span>
                      )}
                    </td>
                    {user?.role === "root" && (
                      <td style={{ padding: "0.75rem" }}>
                        {log.organization ? (
                          <span
                            style={{
                              background: "var(--color-primary)",
                              color: "#fff",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                            }}
                          >
                            {log.organization.name}
                          </span>
                        ) : (
                          <span style={{ color: "var(--color-text-light)" }}>N/A</span>
                        )}
                      </td>
                    )}
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                        {log.ipAddress || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Calendar size={14} style={{ color: "var(--color-text-light)" }} />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <button
                        className="btn-secondary"
                        style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                        onClick={() => {
                          if (log.details) {
                            alert(JSON.stringify(log.details, null, 2));
                          } else {
                            alert("No additional details available");
                          }
                        }}
                      >
                        <Eye size={14} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={user?.role === "root" ? 7 : 6}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--color-text-light)",
                      fontSize: "1.1rem",
                    }}
                  >
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              className="btn-secondary"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ color: "var(--color-text-light)" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn-secondary"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditDashboard;
