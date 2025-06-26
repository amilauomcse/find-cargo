import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Phone, BarChart, PlusCircle, TrendingUp, FileText } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import "./Dashboard.css";

interface DashboardStats {
  inquiries: {
    total: number;
    recent: number;
  };
  salesCalls: {
    total: number;
    recent: number;
  };
  rates: {
    total: number;
    recent: number;
  };
}

const MainDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    inquiries: { total: 0, recent: 0 },
    salesCalls: { total: 0, recent: 0 },
    rates: { total: 0, recent: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      // Fetch stats from different endpoints
      const [inquiriesRes, salesCallsRes, ratesRes] = await Promise.all([
        api.get("/inquiries/stats"),
        api.get("/salesCalls/stats"),
        api.get("/rates/stats"),
      ]);

      setStats({
        inquiries: inquiriesRes.data,
        salesCalls: salesCallsRes.data,
        rates: ratesRes.data,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set default stats if API calls fail
      setStats({
        inquiries: { total: 0, recent: 0 },
        salesCalls: { total: 0, recent: 0 },
        rates: { total: 0, recent: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Inquiries",
      description: "Manage customer inquiries and leads",
      icon: <FileText className="card-icon" />,
      stats: stats.inquiries,
      primaryLink: "/inquiries",
      secondaryLink: "/inquiries/add",
      color: "blue",
    },
    {
      title: "Sales Calls",
      description: "Track sales calls and follow-ups",
      icon: <Phone className="card-icon" />,
      stats: stats.salesCalls,
      primaryLink: "/salesCalls",
      secondaryLink: "/salesCalls/add",
      color: "green",
    },
    {
      title: "Rates",
      description: "Manage pricing and rate information",
      icon: <BarChart className="card-icon" />,
      stats: stats.rates,
      primaryLink: "/rates",
      secondaryLink: "/rates/add",
      color: "purple",
    },
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      {/* Welcome Section */}
      <div
        className="card"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
          color: "#fff",
          marginBottom: "1.5rem",
          padding: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{ color: "#fff", fontSize: "2rem", margin: "0 0 0.5rem 0", fontWeight: "700" }}
            >
              Welcome back, {user?.firstName}!
            </h1>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", margin: "0 0 1rem 0" }}>
              Here's what's happening with your cargo operations today.
            </p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  borderRadius: "var(--radius)",
                  padding: "0.4rem 1rem",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                {user?.organization?.name}
              </span>
              <span
                style={{
                  background: "var(--color-accent)",
                  color: "#fff",
                  borderRadius: "var(--radius)",
                  padding: "0.4rem 1rem",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>
          <div style={{ fontSize: "4rem", opacity: 0.2 }}>
            <Home size={80} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
          }}
        >
          <div>
            <h3
              style={{ fontSize: "2rem", margin: "0 0 0.25rem 0", color: "var(--color-primary)" }}
            >
              {stats.inquiries.total}
            </h3>
            <p style={{ color: "var(--color-text-light)", margin: 0, fontSize: "0.9rem" }}>
              Total Inquiries
            </p>
          </div>
          <FileText size={32} style={{ color: "var(--color-primary)" }} />
        </div>
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "2rem", margin: "0 0 0.25rem 0", color: "var(--color-accent)" }}>
              {stats.salesCalls.total}
            </h3>
            <p style={{ color: "var(--color-text-light)", margin: 0, fontSize: "0.9rem" }}>
              Sales Calls
            </p>
          </div>
          <Phone size={32} style={{ color: "var(--color-accent)" }} />
        </div>
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
          }}
        >
          <div>
            <h3
              style={{ fontSize: "2rem", margin: "0 0 0.25rem 0", color: "var(--color-secondary)" }}
            >
              {stats.rates.total}
            </h3>
            <p style={{ color: "var(--color-text-light)", margin: 0, fontSize: "0.9rem" }}>
              Active Rates
            </p>
          </div>
          <BarChart size={32} style={{ color: "var(--color-secondary)" }} />
        </div>
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
          }}
        >
          <div>
            <h3
              style={{ fontSize: "2rem", margin: "0 0 0.25rem 0", color: "var(--color-success)" }}
            >
              {stats.inquiries.recent + stats.salesCalls.recent + stats.rates.recent}
            </h3>
            <p style={{ color: "var(--color-text-light)", margin: 0, fontSize: "0.9rem" }}>
              Recent Activity
            </p>
          </div>
          <TrendingUp size={32} style={{ color: "var(--color-success)" }} />
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              minHeight: "200px",
              transition: "transform var(--transition), box-shadow var(--transition)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  background: "var(--color-bg-dark)",
                  borderRadius: "50%",
                  padding: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </div>
              <div>
                <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.25rem" }}>{card.title}</h2>
                <p style={{ color: "var(--color-text-light)", margin: 0, fontSize: "0.9rem" }}>
                  {card.description}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <span style={{ fontWeight: "700", fontSize: "1.5rem", display: "block" }}>
                  {card.stats.total}
                </span>
                <span style={{ color: "var(--color-text-light)", fontSize: "0.85rem" }}>Total</span>
              </div>
              <div>
                <span style={{ fontWeight: "700", fontSize: "1.5rem", display: "block" }}>
                  {card.stats.recent}
                </span>
                <span style={{ color: "var(--color-text-light)", fontSize: "0.85rem" }}>
                  Recent
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
              <Link
                to={card.primaryLink}
                className="btn-primary"
                style={{ flex: 1, textAlign: "center" }}
              >
                View All
              </Link>
              <Link
                to={card.secondaryLink}
                className="btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <PlusCircle size={16} />
                Add New
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            to="/inquiries/add"
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <PlusCircle size={20} />
            <span>New Inquiry</span>
          </Link>
          <Link
            to="/salesCalls/add"
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Phone size={20} />
            <span>Log Sales Call</span>
          </Link>
          <Link
            to="/rates/add"
            className="btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <BarChart size={20} />
            <span>Add Rate</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
