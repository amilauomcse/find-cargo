import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "root" | "admin" | "manager" | "employee";
  organization: {
    id: number;
    name: string;
    slug: string;
  };
  fullName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (organizationData: any, adminData: any) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing tokens on app load
  useEffect(() => {
    const storedTokens = localStorage.getItem("auth_tokens");
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);
        // Set the token in API service
        api.setAuthToken(parsedTokens.accessToken);
        // Fetch user profile
        fetchProfile();
      } catch (error) {
        console.error("Error parsing stored tokens:", error);
        localStorage.removeItem("auth_tokens");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile...");
      const response = await api.get("/auth/profile");
      console.log("Profile response:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      // If profile fetch fails, clear tokens
      localStorage.removeItem("auth_tokens");
      setTokens(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;

      const authTokens = { accessToken, refreshToken };
      setTokens(authTokens);
      setUser(userData);

      // Store tokens in localStorage
      localStorage.setItem("auth_tokens", JSON.stringify(authTokens));

      // Set the token in API service
      api.setAuthToken(accessToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (organizationData: any, adminData: any) => {
    try {
      setIsLoading(true);
      await api.post("/auth/register/organization", {
        organization: organizationData,
        admin: adminData,
      });

      // After successful registration, automatically log in
      await login(adminData.email, adminData.password);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        await api.post("/auth/logout", { refreshToken: tokens.refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear everything regardless of logout success
      localStorage.removeItem("auth_tokens");
      setTokens(null);
      setUser(null);
      api.clearAuthToken();
    }
  };

  const refreshAuth = async () => {
    if (!tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await api.post("/auth/refresh", {
        refreshToken: tokens.refreshToken,
      });

      const { accessToken, refreshToken } = response.data;
      const newTokens = { accessToken, refreshToken };

      setTokens(newTokens);
      localStorage.setItem("auth_tokens", JSON.stringify(newTokens));
      api.setAuthToken(accessToken);
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, logout
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && !!tokens,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
