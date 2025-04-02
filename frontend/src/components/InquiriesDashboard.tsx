import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { getInquiries } from '../services/api';

interface Inquiry {
	id: number;
	type: 'Export' | 'Import';
	method: 'Sea Freight' | 'Air Freight';
	portOfLoading: string;
	portOfDischarge: string;
	createdDate: string;
	rateOffered: number;
	clientName: string;
	clientContact: string;
	feedback: string;
	status: string;
	addedBy: string;
}

const dummyInquiries: Inquiry[] = [
	{
		id: 1,
		type: 'Export',
		method: 'Sea Freight',
		portOfLoading: 'Port A',
		portOfDischarge: 'Port B',
		createdDate: '2025-03-25',
		rateOffered: 1500,
		clientName: 'Client X',
		clientContact: '123-456-7890',
		feedback: 'Positive',
		status: 'Open',
		addedBy: 'User 1',
	},
	{
		id: 2,
		type: 'Import',
		method: 'Air Freight',
		portOfLoading: 'Port C',
		portOfDischarge: 'Port D',
		createdDate: '2025-03-27',
		rateOffered: 2000,
		clientName: 'Client Y',
		clientContact: '987-654-3210',
		feedback: 'Pending',
		status: 'Closed',
		addedBy: 'User 2',
	},
];

const InquiriesDashboard: React.FC = () => {
	const [inquiries, setInquiries] = useState<Inquiry[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Filter states
	const [addedByFilter, setAddedByFilter] = useState('');
	const [statusFilter, setStatusFilter] = useState('');

	//fetch inquiries from API
	useEffect(() => {
		const fetchInquiries = async () => {
			try {
				const data = await getInquiries();
				setInquiries(data);
			} catch (error) {
				setError('Failed to fetch inquiries');
			} finally {
				setLoading(false);
			}
		};
		fetchInquiries();
	}, []);

	if (loading) return <p>Loading inquiries...</p>;
	// if (error) return <p className="error-message">{error}</p>;

	const handleFilterChange = () => {
		// Implement filtering or API calls here
		console.log('Filters applied:', {
			addedBy: addedByFilter,
			status: statusFilter,
		});
	};

	const filteredInquiries = inquiries.filter(
		(inquiry) =>
			(addedByFilter
				? inquiry.addedBy
						.toLowerCase()
						.includes(addedByFilter.toLowerCase())
				: true) &&
			(statusFilter ? inquiry.status === statusFilter : true)
	);

	return (
		<div className="dashboard-page">
			{/* Page Header */}
			<div className="page-header">
				<h2>Inquiries Dashboard</h2>
				<Link to="/inquiries/add">
					<button className="primary-btn">Add Inquiry</button>
				</Link>
			</div>

			{/* Filters Section */}
			<div className="search-filter-bar">
				<div className="filter-group">
					<label>Added By:</label>
					<input
						type="text"
						value={addedByFilter}
						onChange={(e) => setAddedByFilter(e.target.value)}
						placeholder="Enter name"
					/>
				</div>
				<div className="filter-group">
					<label>Status:</label>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}>
						<option value="">All</option>
						<option value="Open">Open</option>
						<option value="Closed">Closed</option>
					</select>
				</div>
				<button
					className="apply-filters-btn"
					onClick={handleFilterChange}>
					Apply Filters
				</button>
			</div>

			{/* Table Section */}
			<div className="table-card">
				<h3>Inquiries</h3>
				<table className="data-table">
					<thead>
						<tr>
							<th>Type</th>
							<th>Method</th>
							<th>Port of Loading</th>
							<th>Port of Discharge</th>
							<th>Created Date</th>
							<th>Rate Offered</th>
							<th>Client Name</th>
							<th>Client Contact</th>
							<th>Feedback</th>
							<th>Status</th>
							<th>Added By</th>
						</tr>
					</thead>
					<tbody>
						{filteredInquiries.length > 0 ? (
							filteredInquiries.map((inquiry) => (
								<tr key={inquiry.id}>
									<td>{inquiry.type}</td>
									<td>{inquiry.method}</td>
									<td>{inquiry.portOfLoading}</td>
									<td>{inquiry.portOfDischarge}</td>
									<td>{inquiry.createdDate}</td>
									<td>{inquiry.rateOffered}</td>
									<td>{inquiry.clientName}</td>
									<td>{inquiry.clientContact}</td>
									<td>{inquiry.feedback}</td>
									<td>{inquiry.status}</td>
									<td>{inquiry.addedBy}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={11}>No inquiries found.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default InquiriesDashboard;
