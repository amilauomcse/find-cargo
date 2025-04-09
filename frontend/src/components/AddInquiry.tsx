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
		offeredRate: 0,
		clientName: '',
		clientContactNo: '',
		clientContactEmail: '',
		feedback: '',
		status: '',
		addedBy: '',
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('form data: ', formData);
		try {
			const newInquiry = await addInquiry(formData);
			alert('Inquiry Submitted Successfully');
			setFormData({
				type: '' as 'Export' | 'Import',
				method: '' as 'Sea Freight' | 'Air Freight' | '',
				portOfLoading: '',
				portOfDischarge: '',
				createdDate: '',
				offeredRate: 0,
				clientName: '',
				clientContactNo: '',
				clientContactEmail: '',
				feedback: '',
				status: '',
				addedBy: '',
			});
			console.log('New Inquiry:', newInquiry);
			navigate('/inquiries');
		} catch (error) {
			console.log('Error Creating New Inquiry:', error);
			alert('Failed to submit inquery');
		}
	};

	return (
		<div className="form-container">
			<h1 className="form-header">Add Inquiry</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Type:</label>
					<select
						name="type"
						value={formData.type}
						onChange={handleChange}>
						<option value="">Select Type</option>
						<option value="Export">Export</option>
						<option value="Import">Import</option>
					</select>
				</div>
				<div className="form-group">
					<label>Method:</label>
					<select
						name="method"
						value={formData.method}
						onChange={handleChange}>
						<option value="">Select Method</option>
						<option value="Sea Freight">Sea Freight</option>
						<option value="Air Freight">Air Freight</option>
					</select>
				</div>
				<div className="form-group">
					<label>Port of Loading:</label>
					<input
						name="portOfLoading"
						type="text"
						value={formData.portOfLoading}
						onChange={handleChange}
						placeholder="Enter Port of Loading"
					/>
				</div>
				<div className="form-group">
					<label>Port of Discharge:</label>
					<input
						name="portOfDischarge"
						type="text"
						value={formData.portOfDischarge}
						onChange={handleChange}
						placeholder="Enter Port of Discharge"
					/>
				</div>
				<div className="form-group">
					<label>Created Date:</label>
					<input
						name="createdDate"
						type="date"
						value={formData.createdDate}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label>Rate Offered:</label>
					<input
						name="offeredRate"
						type="number"
						value={formData.offeredRate}
						onChange={handleChange}
						placeholder="Enter Rate Offered"
					/>
				</div>
				<div className="form-group">
					<label>Client Name:</label>
					<input
						name="clientName"
						type="text"
						value={formData.clientName}
						onChange={handleChange}
						placeholder="Enter Client Name"
					/>
				</div>
				<div className="form-group">
					<label>Client Contact No:</label>
					<input
						name="clientContactNo"
						type="text"
						value={formData.clientContactNo}
						onChange={handleChange}
						placeholder="Enter Client Contact"
					/>
				</div>
				<div className="form-group">
					<label>Client Email:</label>
					<input
						name="clientContactEmail"
						type="text"
						value={formData.clientContactEmail}
						onChange={handleChange}
						placeholder="Enter Client Contact"
					/>
				</div>
				<div className="form-group">
					<label>Feedback:</label>
					<textarea
						name="feedback"
						value={formData.feedback}
						onChange={handleChange}
						placeholder="Enter Feedback"
					/>
				</div>
				<div className="form-group">
					<label>Status:</label>
					<select
						name="status"
						value={formData.status}
						onChange={handleChange}>
						<option value="">Select Status</option>
						<option value="Open">Open</option>
						<option value="Closed">Closed</option>
					</select>
				</div>
				<div className="form-group">
					<label>Added By:</label>
					<input
						name="addedBy"
						type="text"
						value={formData.addedBy}
						onChange={handleChange}
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
