import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlusCircle, Search, Filter, X, User, Shield, Mail, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "employee";
  status: "active" | "inactive";
  createdAt: string;
  organization?: {
    id: number;
    name: string;
  };
}

const UsersDashboard: React.FC = () => {
  const {} = useAuth();
  const { orgId } = useParams<{ orgId: string }>();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [orgId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const endpoint = orgId ? `/organizations/${orgId}/users` : "/users";
      const response = await api.get(endpoint);
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    const newFilteredUsers = users.filter(
      (user) =>
        (roleFilter ? user.role === roleFilter : true) &&
        (statusFilter ? user.status === statusFilter : true) &&
        (searchFilter
          ? user.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
            user.email.toLowerCase().includes(searchFilter.toLowerCase())
          : true)
    );
    setFilteredUsers(newFilteredUsers);
  };

  const clearFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setSearchFilter("");
    setFilteredUsers(users);
  };

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "var(--color-error)";
      case "manager":
        return "var(--color-secondary)";
      case "employee":
        return "var(--color-accent)";
      default:
        return "var(--color-text-light)";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield size={14} />;
      case "manager":
        return <User size={14} />;
      case "employee":
        return <User size={14} />;
      default:
        return <User size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
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
          <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--color-accent)" }}>
            {orgId ? "Organization Users" : "All Users"}
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Manage users ({filteredUsers.length} total)
          </p>
        </div>
        <Link
          to={orgId ? `/organizations/${orgId}/users/add` : "/users/add"}
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <PlusCircle size={20} />
          Add User
        </Link>
      </div>

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
              placeholder="Search by name or email"
              style={{ margin: 0 }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
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
              <option value="inactive">Inactive</option>
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

      {/* Users Table */}
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
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>User</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Email</th>
                {!orgId && (
                  <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                    Organization
                  </th>
                )}
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Role</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>Status</th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Created
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: "600" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.length > 0 ? (
                filteredUsers.map((userData) => (
                  <tr
                    key={userData.id}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      transition: "background var(--transition)",
                    }}
                  >
                    <td style={{ padding: "0.75rem" }}>
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {userData.firstName} {userData.lastName}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Mail size={14} style={{ color: "var(--color-text-light)" }} />
                        {userData.email}
                      </div>
                    </td>
                    {!orgId && (
                      <td style={{ padding: "0.75rem" }}>
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
                          {userData.organization?.name || "No Organization"}
                        </span>
                      </td>
                    )}
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          background: getRoleColor(userData.role),
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          width: "fit-content",
                        }}
                      >
                        {getRoleIcon(userData.role)}
                        {userData.role}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        style={{
                          background:
                            userData.status === "active"
                              ? "var(--color-success)"
                              : "var(--color-error)",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {userData.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Calendar size={14} style={{ color: "var(--color-text-light)" }} />
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link
                          to={`/users/${userData.id}/edit`}
                          className="btn-secondary"
                          style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                        >
                          Edit
                        </Link>
                        {userData.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(userData.id, "inactive")}
                            className="btn-secondary"
                            style={{
                              fontSize: "0.8rem",
                              padding: "0.25rem 0.5rem",
                              color: "var(--color-error)",
                            }}
                          >
                            Deactivate
                          </button>
                        )}
                        {userData.status === "inactive" && (
                          <button
                            onClick={() => handleStatusChange(userData.id, "active")}
                            className="btn-primary"
                            style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={orgId ? 7 : 8}
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "var(--color-text-light)",
                      fontSize: "1.1rem",
                    }}
                  >
                    No users found.
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

export default UsersDashboard;
