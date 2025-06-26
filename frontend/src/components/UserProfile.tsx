import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api, updateProfile } from "../services/api";
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  Edit3,
  Save,
  X,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserProfileData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  status: string;
  createdAt: string;
  organization?: {
    id: number;
    name: string;
    slug: string;
  };
}

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/auth/profile");
      setProfileData(response.data);
      setEditForm({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditForm({
        firstName: profileData?.firstName || "",
        lastName: profileData?.lastName || "",
        phoneNumber: profileData?.phoneNumber || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsEditing(!isEditing);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate password change if new password is provided
      if (editForm.newPassword) {
        if (!editForm.currentPassword) {
          setError("Current password is required to change password");
          return;
        }
        if (editForm.newPassword !== editForm.confirmPassword) {
          setError("New passwords do not match");
          return;
        }
        if (editForm.newPassword.length < 6) {
          setError("New password must be at least 6 characters");
          return;
        }
      }

      // Prepare update data
      const updateData: any = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
      };

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword;
        updateData.newPassword = editForm.newPassword;
      }

      await updateProfile(updateData);

      // Refresh profile data
      await fetchUserProfile();
      setIsEditing(false);

      // Clear password fields
      setEditForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "root":
        return "System Administrator";
      case "admin":
        return "Organization Admin";
      case "manager":
        return "Manager";
      case "employee":
        return "Employee";
      default:
        return role;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "suspended":
        return "Suspended";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "var(--color-success)";
      case "inactive":
        return "var(--color-warning)";
      case "suspended":
        return "var(--color-error)";
      default:
        return "var(--color-secondary)";
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="error-state">
        <p>Failed to load profile data</p>
        <button onClick={fetchUserProfile} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
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
          <h1 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>User Profile</h1>
          <p style={{ margin: 0, color: "var(--color-text-light)" }}>
            Manage your account information and settings
          </p>
        </div>
        <button
          onClick={handleEditToggle}
          className={isEditing ? "btn-secondary" : "btn-primary"}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          {isEditing ? (
            <>
              <X size={20} />
              Cancel
            </>
          ) : (
            <>
              <Edit3 size={20} />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          className="card"
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            background: "var(--color-error)",
            color: "#fff",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="card" style={{ padding: "2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Personal Information */}
          <div>
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.1rem",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <User size={20} />
              Personal Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                ) : (
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      color: "var(--text-color)",
                    }}
                  >
                    {profileData.firstName}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                ) : (
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      color: "var(--text-color)",
                    }}
                  >
                    {profileData.lastName}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Email Address</label>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    color: "var(--text-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Mail size={16} />
                  {profileData.email}
                </div>
                <small style={{ color: "var(--color-text-light)" }}>Email cannot be changed</small>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    disabled={isSaving}
                  />
                ) : (
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      color: "var(--text-color)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Phone size={16} />
                    {profileData.phoneNumber || "Not provided"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.1rem",
                color: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Shield size={20} />
              Account Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Role</label>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    color: "var(--text-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Shield size={16} />
                  {getRoleDisplayName(profileData.role)}
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Status</label>
                <div
                  style={{
                    padding: "0.75rem",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: getStatusColor(profileData.status),
                  }}
                >
                  {getStatusDisplayName(profileData.status)}
                </div>
              </div>

              {profileData.organization && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Organization</label>
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      color: "var(--text-color)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Building size={16} />
                    {profileData.organization.name}
                  </div>
                </div>
              )}

              <div className="form-group" style={{ margin: 0 }}>
                <label>Member Since</label>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    color: "var(--text-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Calendar size={16} />
                  {new Date(profileData.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        {isEditing && (
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.1rem",
                color: "var(--color-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Key size={20} />
              Change Password
            </h3>
            <small
              style={{ color: "var(--color-text-light)", display: "block", marginBottom: "1rem" }}
            >
              Leave password fields empty if you don't want to change your password
            </small>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              <div className="form-group" style={{ margin: 0 }}>
                <label>Current Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={editForm.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-text-light)",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={editForm.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={editForm.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleEditToggle}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              disabled={isSaving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Save size={20} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
