import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { getSalesCalls } from '../services/api';

interface SalesCall {
	id: number;
	customerName: string;
	contacts: string;
	contactedEmployee: string;
	createdDate: string;
	feedback: string;
	nextFollowupDate: string;
}

const dummySalesCalls: SalesCall[] = [
	{
		id: 1,
		customerName: 'Customer A',
		contacts: '123-456-7890',
		contactedEmployee: 'Employee X',
		createdDate: '2025-03-20',
		feedback: 'Positive',
		nextFollowupDate: '2025-04-05',
	},
	{
		id: 2,
		customerName: 'Customer B',
		contacts: '987-654-3210',
		contactedEmployee: 'Employee Y',
		createdDate: '2025-03-22',
		feedback: 'Needs follow-up',
		nextFollowupDate: '2025-04-10',
	},
];

const SalesCallsDashboard: React.FC = () => {
	const [salesCalls, setSalesCalls] = useState<SalesCall[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [customerFilter, setCustomerFilter] = useState('');
	const [employeeFilter, setEmployeeFilter] = useState('');

	//fetch sales calls from API
	useEffect(() => {
		const fetchSalesCalls = async () => {
			try {
				const data = await getSalesCalls();
				setSalesCalls(data);
			} catch (error) {
				setError('Failed to fetch sales calls');
			} finally {
				setLoading(false);
			}
		};
		fetchSalesCalls();
	}, []);

	if (loading) return <p>Loading sales calls...</p>;
	// if (error) return <p className="error-message">{error}</p>;

	const handleFilterChange = () => {
		// You can implement filtering logic or API calls here
		console.log('Filters applied:', {
			customerName: customerFilter,
			contactedEmployee: employeeFilter,
		});
	};

	const filteredSalesCalls = salesCalls.filter(
		(call) =>
			(customerFilter
				? call.customerName
						.toLowerCase()
						.includes(customerFilter.toLowerCase())
				: true) &&
			(employeeFilter
				? call.contactedEmployee
						.toLowerCase()
						.includes(employeeFilter.toLowerCase())
				: true)
	);

	return (
		<div className="dashboard-page">
			{/* Page Header */}
			<div className="page-header">
				<h2>Sales Calls Dashboard</h2>
				<Link to="/sales-calls/add">
					<button className="primary-btn">Add Sales Call</button>
				</Link>
			</div>

			{/* Filters Section */}
			<div className="search-filter-bar">
				<div className="filter-group">
					<label>Customer Name:</label>
					<input
						type="text"
						value={customerFilter}
						onChange={(e) => setCustomerFilter(e.target.value)}
						placeholder="Enter customer name"
					/>
				</div>
				<div className="filter-group">
					<label>Contacted Employee:</label>
					<input
						type="text"
						value={employeeFilter}
						onChange={(e) => setEmployeeFilter(e.target.value)}
						placeholder="Enter contacted employee"
					/>
				</div>
				<button
					className="apply-filters-btn"
					onClick={handleFilterChange}>
					Apply Filters
				</button>
			</div>

			{/* Table Section */}
			<div className="table-card">
				<h3>Sales Calls</h3>
				<table className="data-table">
					<thead>
						<tr>
							<th>Customer Name</th>
							<th>Contacts</th>
							<th>Contacted Employee</th>
							<th>Created Date</th>
							<th>Feedback</th>
							<th>Next Followup Date</th>
						</tr>
					</thead>
					<tbody>
						{filteredSalesCalls.length > 0 ? (
							filteredSalesCalls.map((call) => (
								<tr key={call.id}>
									<td>{call.customerName}</td>
									<td>{call.contacts}</td>
									<td>{call.contactedEmployee}</td>
									<td>{call.createdDate}</td>
									<td>{call.feedback}</td>
									<td>{call.nextFollowupDate}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={11}>No sales calls found.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
export default SalesCallsDashboard;
