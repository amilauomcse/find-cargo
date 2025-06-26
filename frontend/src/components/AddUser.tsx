import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, User, Mail, Shield, Building } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "employee";
  organizationId?: number;
}

interface Organization {
  id: number;
  name: string;
}

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orgId } = useParams<{ orgId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
    organizationId: orgId ? parseInt(orgId) : undefined,
  });

  useEffect(() => {
    if (user?.role === "root" && !orgId) {
      fetchOrganizations();
    }
  }, [user, orgId]);

  const fetchOrganizations = async () => {
    try {
      const response = await api.get("/organizations");
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = orgId ? `/organizations/${orgId}/users` : "/users";
      await api.post(endpoint, formData);
      alert("User created successfully!");
      navigate(orgId ? `/organizations/${orgId}/users` : "/users");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full access to organization settings and user management";
      case "manager":
        return "Can manage team members and view organization data";
      case "employee":
        return "Basic access to assigned tasks and data";
      default:
        return "";
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
          padding: "1.5rem",
        }}
      >
        <button
          onClick={() => navigate(orgId ? `/organizations/${orgId}/users` : "/users")}
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h1 style={{ margin: "0 0 0.25rem 0", color: "var(--color-accent)" }}>Add New User</h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            {orgId ? "Add user to organization" : "Create a new user"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* User Information */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-accent)" }}
              >
                <User size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                User Information
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-primary)" }}
              >
                <Mail size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Contact Information
              </h3>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Security */}
            <div>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1.1rem",
                  color: "var(--color-secondary)",
                }}
              >
                <Shield size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Security
              </h3>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Organization Selection (for root users) */}
            {user?.role === "root" && !orgId && (
              <div>
                <h3
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: "1.1rem",
                    color: "var(--color-primary)",
                  }}
                >
                  <Building size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                  Organization
                </h3>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Select Organization</label>
                  <select
                    name="organizationId"
                    value={formData.organizationId || ""}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select an organization</option>
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-accent)" }}
              >
                <Shield size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Role & Permissions
              </h3>
              <div className="form-group" style={{ margin: 0 }}>
                <label>User Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.9rem",
                    color: "var(--color-text-light)",
                    fontStyle: "italic",
                  }}
                >
                  {getRoleDescription(formData.role)}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(orgId ? `/organizations/${orgId}/users` : "/users")}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Save size={20} />
                {isLoading ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
