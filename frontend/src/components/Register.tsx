import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "./AuthStyles.css";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    organization: {
      name: "",
      slug: "",
      description: "",
      address: "",
      phoneNumber: "",
      email: "",
      website: "",
    },
    admin: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {} = useAuth();

  const handleInputChange = (section: "organization" | "admin", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleOrganizationNameChange = (name: string) => {
    handleInputChange("organization", "name", name);
    // Auto-generate slug from organization name
    const slug = generateSlug(name);
    handleInputChange("organization", "slug", slug);
  };

  const validateForm = () => {
    if (formData.admin.password !== formData.admin.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.admin.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove confirmPassword from the data sent to backend
      const { confirmPassword, ...adminData } = formData.admin;
      // Call the public registration endpoint
      const response = await fetch("/api/organizations/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData.organization,
          adminUser: adminData,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          <ThemeToggle />
        </div>
        <div className="auth-header">
          <h1>Register Your Organization</h1>
          <p>Create your organization account and get started</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3>Organization Information</h3>

            <div className="form-group">
              <label htmlFor="orgName">Organization Name *</label>
              <input
                type="text"
                id="orgName"
                value={formData.organization.name}
                onChange={(e) => handleOrganizationNameChange(e.target.value)}
                placeholder="Enter organization name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="orgSlug">Organization Slug *</label>
              <input
                type="text"
                id="orgSlug"
                value={formData.organization.slug}
                onChange={(e) => handleInputChange("organization", "slug", e.target.value)}
                placeholder="your-organization"
                required
                disabled={isLoading}
              />
              <small>This will be used in your organization URL</small>
            </div>

            <div className="form-group">
              <label htmlFor="orgDescription">Description</label>
              <textarea
                id="orgDescription"
                value={formData.organization.description}
                onChange={(e) => handleInputChange("organization", "description", e.target.value)}
                placeholder="Brief description of your organization"
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="orgEmail">Organization Email</label>
                <input
                  type="email"
                  id="orgEmail"
                  value={formData.organization.email}
                  onChange={(e) => handleInputChange("organization", "email", e.target.value)}
                  placeholder="contact@organization.com"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="orgPhone">Organization Phone</label>
                <input
                  type="tel"
                  id="orgPhone"
                  value={formData.organization.phoneNumber}
                  onChange={(e) => handleInputChange("organization", "phoneNumber", e.target.value)}
                  placeholder="+1234567890"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="orgAddress">Address</label>
              <input
                type="text"
                id="orgAddress"
                value={formData.organization.address}
                onChange={(e) => handleInputChange("organization", "address", e.target.value)}
                placeholder="Organization address"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="orgWebsite">Website</label>
              <input
                type="url"
                id="orgWebsite"
                value={formData.organization.website}
                onChange={(e) => handleInputChange("organization", "website", e.target.value)}
                placeholder="https://www.organization.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Admin Account</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.admin.firstName}
                  onChange={(e) => handleInputChange("admin", "firstName", e.target.value)}
                  placeholder="Enter first name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.admin.lastName}
                  onChange={(e) => handleInputChange("admin", "lastName", e.target.value)}
                  placeholder="Enter last name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="adminEmail">Email Address *</label>
              <input
                type="email"
                id="adminEmail"
                value={formData.admin.email}
                onChange={(e) => handleInputChange("admin", "email", e.target.value)}
                placeholder="Enter email address"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="adminPhone">Phone Number</label>
              <input
                type="tel"
                id="adminPhone"
                value={formData.admin.phoneNumber}
                onChange={(e) => handleInputChange("admin", "phoneNumber", e.target.value)}
                placeholder="+1234567890"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                value={formData.admin.password}
                onChange={(e) => handleInputChange("admin", "password", e.target.value)}
                placeholder="Enter password (min 6 characters)"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.admin.confirmPassword}
                onChange={(e) => handleInputChange("admin", "confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Organization Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="auth-link">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
