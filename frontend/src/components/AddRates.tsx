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
		loadingPort: '',
		dischargePort: '',
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setNewRate({ ...newRate, [name]: value });
	};

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
				loadingPort: '',
				dischargePort: '',
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
						name="agentName"
						type="text"
						value={newRate.agentName}
						onChange={handleChange}
						placeholder="Enter agent name"
					/>
				</div>
				<div className="form-group">
					<label>ETD:</label>
					<input
						name="etd"
						type="date"
						value={newRate.etd}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label>Carrier:</label>
					<input
						name="carrier"
						type="text"
						value={newRate.carrier}
						onChange={handleChange}
						placeholder="Enter carrier"
					/>
				</div>
				<div className="form-group">
					<label>Container Type:</label>
					<select
						name="containerType"
						value={newRate.containerType}
						onChange={handleChange}>
						<option value="">Select Container Type</option>
						<option value="20ft">20ft</option>
						<option value="40ft">40ft</option>
					</select>
				</div>
				<div className="form-group">
					<label>Sea Freight:</label>
					<input
						name="seaFreight"
						type="number"
						value={newRate.seaFreight}
						onChange={handleChange}
						placeholder="Enter sea freight cost"
					/>
				</div>
				<div className="form-group">
					<label>Other Cost:</label>
					<input
						name="otherCost"
						type="number"
						value={newRate.otherCost}
						onChange={handleChange}
						placeholder="Enter other cost"
					/>
				</div>
				<div className="form-group">
					<label>Ex Cost:</label>
					<input
						name="exCost"
						type="number"
						value={newRate.exCost}
						onChange={handleChange}
						placeholder="Enter ex cost"
					/>
				</div>
				<div className="form-group">
					<label>Total:</label>
					<input
						name="total"
						type="number"
						value={newRate.total}
						onChange={handleChange}
						placeholder="Enter total"
					/>
				</div>
				<div className="form-group">
					<label>Transit Time:</label>
					<input
						name="transitTime"
						type="text"
						value={newRate.transitTime}
						onChange={handleChange}
						placeholder="e.g., 7 days"
					/>
				</div>
				<div className="form-group">
					<label>Rate Type:</label>
					<select
						name="rateType"
						value={newRate.rateType}
						onChange={handleChange}>
						<option value="">Select Rate Type</option>
						<option value="Express">Express</option>
						<option value="Standard">Standard</option>
					</select>
				</div>
				<div className="form-group">
					<label>Created Date:</label>
					<input
						name="createdDate"
						type="date"
						value={newRate.createdDate}
						onChange={handleChange}
					/>
				</div>
				<div className="form-group">
					<label>Type:</label>
					<select
						name="type"
						value={newRate.type}
						onChange={handleChange}>
						<option value="">Select Type</option>
						<option value="Export">Export</option>
						<option value="Import">Import</option>
					</select>
				</div>
				{/* New Loading Port Field */}
				<div className="form-group">
					<label>Loading Port:</label>
					<input
						name="loadingPort"
						type="text"
						value={newRate.loadingPort}
						onChange={handleChange}
						placeholder="Enter loading port"
					/>
				</div>

				{/* New Discharge Port Field */}
				<div className="form-group">
					<label>Discharge Port:</label>
					<input
						name="dischargePort"
						type="text"
						value={newRate.dischargePort}
						onChange={handleChange}
						placeholder="Enter discharge port"
					/>
				</div>
				<button className="submit-button" type="submit">
					Submit Rate
				</button>
			</form>
		</div>
	);
};

export default AddRates;
