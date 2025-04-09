// AddSalesCall.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';
import { addSalesCall } from '../services/api';

const AddSalesCall: React.FC = () => {
	const navigate = useNavigate();

	const [newSalesCall, setNewSalesCall] = useState({
		companyName: '',
		contactedEmployee: '',
		contactNo: '',
		contactEmail: '',
		feedback: '',
		createdDate: '',
		followUpDate: '',
		agentName: '',
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setNewSalesCall({ ...newSalesCall, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await addSalesCall(newSalesCall);
			setNewSalesCall({
				companyName: '',
				contactedEmployee: '',
				contactNo: '',
				contactEmail: '',
				feedback: '',
				createdDate: '',
				followUpDate: '',
				agentName: '',
			});
			console.log('New Sales Call:', newSalesCall);
			navigate('/salesCalls');
		} catch (error) {
			console.log('Error Adding a New Sales Call:', error);
			alert('Failed to submit the new sales call data');
		}
	};

	return (
		<div className="form-container">
			<h1 className="form-header">Add Sales Call</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Company Name:</label>
					<input
						name="companyName"
						type="text"
						value={newSalesCall.companyName}
						onChange={handleChange}
						placeholder="Enter company name"
					/>
				</div>
				<div className="form-group">
					<label>Contacted Employee:</label>
					<input
						name="contactedEmployee"
						type="text"
						value={newSalesCall.contactedEmployee}
						onChange={handleChange}
						placeholder="Enter contacted employee"
					/>
				</div>
				<div className="form-group">
					<label>Contact Number:</label>
					<input
						name="contactNo"
						type="text"
						value={newSalesCall.contactNo}
						onChange={handleChange}
						placeholder="Enter contact number"
					/>
				</div>
				<div className="form-group">
					<label>Contact Email:</label>
					<input
						name="contactEmail"
						type="text"
						value={newSalesCall.contactEmail}
						onChange={handleChange}
						placeholder="Enter Email"
					/>
				</div>
				<div className="form-group">
					<label>Feedback:</label>
					<textarea
						name="feedback"
						value={newSalesCall.feedback}
						onChange={handleChange}
						placeholder="Enter feedback"
					/>
				</div>
				<div className="form-group">
					<label>Created Date:</label>
					<input
						name="createdDate"
						type="date"
						value={newSalesCall.createdDate}
						onChange={handleChange}
					/>
				</div>

				<div className="form-group">
					<label>Follow-up Date:</label>
					<input
						name="followUpDate"
						type="date"
						value={newSalesCall.followUpDate}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label>Agent Name:</label>
					<input
						name="agentName"
						type="text"
						value={newSalesCall.agentName}
						onChange={handleChange}
					/>
				</div>
				<button className="submit-button" type="submit">
					Submit Sales Call
				</button>
			</form>
		</div>
	);
};

export default AddSalesCall;
