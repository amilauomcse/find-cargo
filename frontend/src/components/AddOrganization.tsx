import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Building, User } from "lucide-react";
import { api } from "../services/api";

interface OrganizationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  adminUser: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

const AddOrganization: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    adminUser: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("adminUser.")) {
      const adminField = name.split(".")[1];
      setFormData({
        ...formData,
        adminUser: {
          ...formData.adminUser,
          [adminField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/organizations", formData);
      alert("Organization created successfully!");
      navigate("/organizations");
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
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
          onClick={() => navigate("/organizations")}
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div>
          <h1 style={{ margin: "0 0 0.25rem 0", color: "var(--color-primary)" }}>
            Add New Organization
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Create a new organization with admin user
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Organization Information */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-primary)" }}
              >
                <Building size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Organization Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Organization Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Organization Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter organization email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter organization address"
                    rows={3}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Admin User Information */}
            <div>
              <h3
                style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--color-accent)" }}
              >
                <User size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Admin User Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="adminUser.firstName"
                    value={formData.adminUser.firstName}
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
                    name="adminUser.lastName"
                    value={formData.adminUser.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="adminUser.email"
                    value={formData.adminUser.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="adminUser.password"
                    value={formData.adminUser.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div
            style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/organizations")}
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
              {isLoading ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrganization;
