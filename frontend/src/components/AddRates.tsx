// AddRates.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';
import { addNewRate } from '../services/api';

const AddRates: React.FC = () => {
	const navigate = useNavigate();

	const [newRate, setNewRate] = useState({
		agentName: '',
		etd: '',
		carrier: '',
		containerType: '',
		seaFreight: 0,
		otherCost: 0,
		exCost: 0,
		total: 0,
		transitTime: '',
		rateType: '',
		createdDate: '',
		type: '' as 'Export' | 'Import',
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const ratesData = await addNewRate(newRate);
			alert('New Rate Submitted Successfully');
			setNewRate({
				agentName: '',
				etd: '',
				carrier: '',
				containerType: '',
				seaFreight: 0,
				otherCost: 0,
				exCost: 0,
				total: 0,
				transitTime: '',
				rateType: '',
				createdDate: '',
				type: '' as 'Export' | 'Import',
			});
			console.log('new rate:', ratesData);
			navigate('/rates');
		} catch (error) {
			console.log('Error Adding a New Rate:', error);
			alert('Failed to submit the new rates data');
		}
	};

	return (
		<div className="form-container">
			<h1 className="form-header">Add Rates</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Agent Name:</label>
					<input
						type="text"
						value={newRate.agentName}
						onChange={(e) => e.target.value}
						placeholder="Enter agent name"
					/>
				</div>
				<div className="form-group">
					<label>ETD:</label>
					<input
						type="date"
						value={newRate.etd}
						onChange={(e) => e.target.value}
					/>
				</div>
				<div className="form-group">
					<label>Carrier:</label>
					<input
						type="text"
						value={newRate.carrier}
						onChange={(e) => e.target.value}
						placeholder="Enter carrier"
					/>
				</div>
				<div className="form-group">
					<label>Container Type:</label>
					<select
						value={newRate.containerType}
						onChange={(e) => e.target.value}>
						<option value="">Select Container Type</option>
						<option value="20ft">20ft</option>
						<option value="40ft">40ft</option>
					</select>
				</div>
				<div className="form-group">
					<label>Sea Freight:</label>
					<input
						type="number"
						value={newRate.seaFreight}
						onChange={(e) => e.target.value}
						placeholder="Enter sea freight cost"
					/>
				</div>
				<div className="form-group">
					<label>Other Cost:</label>
					<input
						type="number"
						value={newRate.otherCost}
						onChange={(e) => e.target.value}
						placeholder="Enter other cost"
					/>
				</div>
				<div className="form-group">
					<label>Ex Cost:</label>
					<input
						type="number"
						value={newRate.exCost}
						onChange={(e) => e.target.value}
						placeholder="Enter ex cost"
					/>
				</div>
				<div className="form-group">
					<label>Total:</label>
					<input
						type="number"
						value={newRate.total}
						onChange={(e) => e.target.value}
						placeholder="Enter total"
					/>
				</div>
				<div className="form-group">
					<label>Transit Time:</label>
					<input
						type="text"
						value={newRate.transitTime}
						onChange={(e) => e.target.value}
						placeholder="e.g., 7 days"
					/>
				</div>
				<div className="form-group">
					<label>Type:</label>
					<select
						value={newRate.rateType}
						onChange={(e) => e.target.value}>
						<option value="">Select Rate Type</option>
						<option value="Express">Express</option>
						<option value="Standard">Standard</option>
					</select>
				</div>
				<div className="form-group">
					<label>Created Date:</label>
					<input
						type="date"
						value={newRate.createdDate}
						onChange={(e) => e.target.value}
					/>
				</div>
				<div className="form-group">
					<label>Type:</label>
					<select
						value={newRate.type}
						onChange={(e) => e.target.value as 'Export' | 'Import'}>
						<option value="">Select Type</option>
						<option value="Export">Export</option>
						<option value="Import">Import</option>
					</select>
				</div>
				<button className="submit-button" type="submit">
					Submit Rate
				</button>
			</form>
		</div>
	);
};

export default AddRates;
