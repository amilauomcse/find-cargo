import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Filter, X, Building, Users, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

interface Organization {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "pending" | "suspended";
  createdAt: string;
  adminUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  userCount: number;
}

const OrganizationsDashboard: React.FC = () => {
  const {} = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/organizations");
      setOrganizations(response.data);
      setFilteredOrganizations(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    const newFilteredOrganizations = organizations.filter(
      (org) =>
        (statusFilter ? org.status === statusFilter : true) &&
        (searchFilter
          ? org.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            org.email.toLowerCase().includes(searchFilter.toLowerCase())
          : true)
    );
    setFilteredOrganizations(newFilteredOrganizations);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setSearchFilter("");
    setFilteredOrganizations(organizations);
  };

  const handleStatusChange = async (orgId: number, newStatus: string) => {
    try {
      await api.patch(`/organizations/${orgId}/status`, { status: newStatus });
      fetchOrganizations(); // Refresh the list
    } catch (err) {
      console.error("Error updating organization status:", err);
      alert("Failed to update organization status");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading organizations...</p>
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
          <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>
            Organizations Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Manage all organizations ({filteredOrganizations.length} total)
          </p>
        </div>
        <Link
          to="/organizations/add"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <PlusCircle size={20} />
          Add Organization
        </Link>
      </div>

      {/* Filters Section */}
      <div className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Filter size={20} style={{ color: "var(--color-primary)" }} />
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
              placeholder="Search by name or email"
              style={{ margin: 0 }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
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

      {/* Organizations Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredOrganizations?.length > 0 ? (
          filteredOrganizations.map((org) => (
            <div key={org.id} className="card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>{org.name}</h3>
                  <p style={{ margin: "0 0 0.25rem 0", color: "var(--color-text-light)" }}>
                    {org.email}
                  </p>
                  <p style={{ margin: 0, color: "var(--color-text-light)" }}>{org.phone}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      background:
                        org.status === "active"
                          ? "var(--color-success)"
                          : org.status === "pending"
                          ? "var(--color-secondary)"
                          : "var(--color-error)",
                      color: "#fff",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                    }}
                  >
                    {org.status === "active" ? (
                      <CheckCircle size={12} style={{ marginRight: "0.25rem" }} />
                    ) : org.status === "pending" ? (
                      <Clock size={12} style={{ marginRight: "0.25rem" }} />
                    ) : null}
                    {org.status}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "var(--color-text-light)",
                  }}
                >
                  <Building size={14} style={{ marginRight: "0.5rem" }} />
                  Address: {org.address}
                </p>
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9rem",
                    color: "var(--color-text-light)",
                  }}
                >
                  <Users size={14} style={{ marginRight: "0.5rem" }} />
                  Admin: {org.adminUser.firstName} {org.adminUser.lastName} ({org.adminUser.email})
                </p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-light)" }}>
                  Users: {org.userCount} | Created: {new Date(org.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Link
                  to={`/organizations/${org.id}/users`}
                  className="btn-secondary"
                  style={{ fontSize: "0.9rem" }}
                >
                  View Users
                </Link>
                <Link
                  to={`/organizations/${org.id}/edit`}
                  className="btn-secondary"
                  style={{ fontSize: "0.9rem" }}
                >
                  Edit
                </Link>
                {org.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange(org.id, "active")}
                    className="btn-primary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Approve
                  </button>
                )}
                {org.status === "active" && (
                  <button
                    onClick={() => handleStatusChange(org.id, "suspended")}
                    className="btn-secondary"
                    style={{ fontSize: "0.9rem", color: "var(--color-error)" }}
                  >
                    Suspend
                  </button>
                )}
                {org.status === "suspended" && (
                  <button
                    onClick={() => handleStatusChange(org.id, "active")}
                    className="btn-primary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div
            className="card"
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--color-text-light)",
              fontSize: "1.1rem",
              gridColumn: "1 / -1",
            }}
          >
            No organizations found.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationsDashboard;
