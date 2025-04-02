// AddSalesCall.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';
import { addSalesCall } from '../services/api';

const AddSalesCall: React.FC = () => {
	const navigate = useNavigate();

	const [newSalesCall, setNewSalesCall] = useState({
		customerName: '',
		contacts: '',
		contactedEmployee: '',
		createdDate: '',
		feedback: '',
		nextFollowupDate: '',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await addSalesCall(newSalesCall);
			setNewSalesCall({
				customerName: '',
				contacts: '',
				contactedEmployee: '',
				createdDate: '',
				feedback: '',
				nextFollowupDate: '',
			});
			console.log('New Sales Call:', newSalesCall);
			navigate('/sales-calls');
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
					<label>Customer Name:</label>
					<input
						type="text"
						value={newSalesCall.customerName}
						onChange={(e) => e.target.value}
						placeholder="Enter customer name"
					/>
				</div>
				<div className="form-group">
					<label>Contacts:</label>
					<input
						type="text"
						value={newSalesCall.contacts}
						onChange={(e) => e.target.value}
						placeholder="Enter contacts"
					/>
				</div>
				<div className="form-group">
					<label>Contacted Employee:</label>
					<input
						type="text"
						value={newSalesCall.contactedEmployee}
						onChange={(e) => e.target.value}
						placeholder="Enter contacted employee"
					/>
				</div>
				<div className="form-group">
					<label>Created Date:</label>
					<input
						type="date"
						value={newSalesCall.createdDate}
						onChange={(e) => e.target.value}
					/>
				</div>
				<div className="form-group">
					<label>Feedback:</label>
					<textarea
						value={newSalesCall.feedback}
						onChange={(e) => e.target.value}
						placeholder="Enter feedback"
					/>
				</div>
				<div className="form-group">
					<label>Next Followup Date:</label>
					<input
						type="date"
						value={newSalesCall.nextFollowupDate}
						onChange={(e) => e.target.value}
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
