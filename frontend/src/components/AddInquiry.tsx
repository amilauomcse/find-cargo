// AddInquiry.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css'; // Import the form styles
import { addInquiry } from '../services/api';

const AddInquiry: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		type: '' as 'Export' | 'Import',
		method: '' as 'Sea Freight' | 'Air Freight' | '',
		portOfLoading: '',
		portOfDischarge: '',
		createdDate: '',
		rateOffered: '',
		clientName: '',
		clientContact: '',
		feedback: '',
		status: '',
		addedBy: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const newInquiry = await addInquiry(formData);
			alert('Inquiry Submitted Successfully');
			setFormData({
				type: '' as 'Export' | 'Import',
				method: '' as 'Sea Freight' | 'Air Freight' | '',
				portOfLoading: '',
				portOfDischarge: '',
				createdDate: '',
				rateOffered: '',
				clientName: '',
				clientContact: '',
				feedback: '',
				status: '',
				addedBy: '',
			});
			console.log('New Inquiry:', newInquiry);
		} catch (error) {
			console.log('Error Creating New Inquiry:', error);
			alert('Failed to submit inquery');
		}

		navigate('/inquiries');
	};

	return (
		<div className="form-container">
			<h1 className="form-header">Add Inquiry</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Type:</label>
					<select
						value={formData.type}
						onChange={(e) => e.target.value as 'Export' | 'Import'}>
						<option value="">Select Type</option>
						<option value="Export">Export</option>
						<option value="Import">Import</option>
					</select>
				</div>
				<div className="form-group">
					<label>Method:</label>
					<select
						value={formData.method}
						onChange={(e) =>
							e.target.value as 'Sea Freight' | 'Air Freight'
						}>
						<option value="">Select Method</option>
						<option value="Sea Freight">Sea Freight</option>
						<option value="Air Freight">Air Freight</option>
					</select>
				</div>
				<div className="form-group">
					<label>Port of Loading:</label>
					<input
						type="text"
						value={formData.portOfLoading}
						onChange={(e) => e.target.value}
						placeholder="Enter Port of Loading"
					/>
				</div>
				<div className="form-group">
					<label>Port of Discharge:</label>
					<input
						type="text"
						value={formData.portOfDischarge}
						onChange={(e) => e.target.value}
						placeholder="Enter Port of Discharge"
					/>
				</div>
				<div className="form-group">
					<label>Created Date:</label>
					<input
						type="date"
						value={formData.createdDate}
						onChange={(e) => e.target.value}
					/>
				</div>
				<div className="form-group">
					<label>Rate Offered:</label>
					<input
						type="number"
						value={formData.rateOffered}
						onChange={(e) => Number(e.target.value)}
						placeholder="Enter Rate Offered"
					/>
				</div>
				<div className="form-group">
					<label>Client Name:</label>
					<input
						type="text"
						value={formData.clientName}
						onChange={(e) => e.target.value}
						placeholder="Enter Client Name"
					/>
				</div>
				<div className="form-group">
					<label>Client Contact:</label>
					<input
						type="text"
						value={formData.clientContact}
						onChange={(e) => e.target.value}
						placeholder="Enter Client Contact"
					/>
				</div>
				<div className="form-group">
					<label>Feedback:</label>
					<textarea
						value={formData.feedback}
						onChange={(e) => e.target.value}
						placeholder="Enter Feedback"
					/>
				</div>
				<div className="form-group">
					<label>Status:</label>
					<select
						value={formData.status}
						onChange={(e) => e.target.value}>
						<option value="">Select Status</option>
						<option value="Open">Open</option>
						<option value="Closed">Closed</option>
					</select>
				</div>
				<div className="form-group">
					<label>Added By:</label>
					<input
						type="text"
						value={formData.addedBy}
						onChange={(e) => e.target.value}
						placeholder="Enter your name"
					/>
				</div>
				<button className="submit-button" type="submit">
					Submit Inquiry
				</button>
			</form>
		</div>
	);
};

export default AddInquiry;
