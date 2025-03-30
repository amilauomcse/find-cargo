import React, { useState } from "react";
import { Link } from "react-router-dom";

// Define an interface for a sales call record
interface SalesCall {
  id: number;
  customerName: string;
  contacts: string;
  contactedEmployee: string;
  createdDate: string;
  feedback: string;
  nextFollowupDate: string;
}

// Dummy data for demonstration purposes
const dummySalesCalls: SalesCall[] = [
  {
    id: 1,
    customerName: "Customer A",
    contacts: "123-456-7890",
    contactedEmployee: "Employee X",
    createdDate: "2025-03-20",
    feedback: "Positive",
    nextFollowupDate: "2025-04-05",
  },
  {
    id: 2,
    customerName: "Customer B",
    contacts: "987-654-3210",
    contactedEmployee: "Employee Y",
    createdDate: "2025-03-22",
    feedback: "Needs follow-up",
    nextFollowupDate: "2025-04-10",
  },
  // Add more dummy records as needed
];

const SalesCallsDashboard: React.FC = () => {
  // Filter state variables for Customer Name and Contacted Employee
  const [customerFilter, setCustomerFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  // Placeholder for filter handler (adjust filtering logic as needed)
  const handleFilterChange = () => {
    console.log("Filters applied:", {
      customerName: customerFilter,
      contactedEmployee: employeeFilter,
    });
  };

  return (
    <div className="sales-calls-dashboard" style={{ padding: "20px" }}>
      <h1>Sales Calls Dashboard</h1>

      {/* Add Sales Call Button */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/sales-calls/add">
          <button>Add Sales Call</button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="filters" style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Customer Name:</label>
          <input
            type="text"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Contacted Employee:</label>
          <input
            type="text"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            placeholder="Enter contacted employee"
          />
        </div>
        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Customer Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Contacts</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Contacted Employee</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Created Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Feedback</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Next Followup Date</th>
            </tr>
          </thead>
          <tbody>
            {dummySalesCalls
              // Filter the dummy data based on customer name and contacted employee
              .filter(
                (call) =>
                  (customerFilter
                    ? call.customerName.toLowerCase().includes(customerFilter.toLowerCase())
                    : true) &&
                  (employeeFilter
                    ? call.contactedEmployee.toLowerCase().includes(employeeFilter.toLowerCase())
                    : true)
              )
              .map((call) => (
                <tr key={call.id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{call.customerName}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{call.contacts}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {call.contactedEmployee}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{call.createdDate}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{call.feedback}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {call.nextFollowupDate}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesCallsDashboard;
