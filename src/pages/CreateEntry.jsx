import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function CreateEntry() {
  const [formData, setFormData] = useState({
    lrNo: '',
    month: '',
    date: '',
    vehicleNo: '',
    vehicleType: '',
    origin: '',
    destination: '',
    driverNo: '',
    broker: '',
    lorryHire: '',
    advance: '',
    approvalByCMD: '',
    balance: '',
    freightRate: '',
    lrCharges: '',
    invoiceAmount: '',
    margin: '',
    marginPercent: '',
    pod: '',
    billNo: '',
    remarks: '',
    paymentStatus: 'Unpaid',
    paymentDate: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/entries`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      alert("Entry created successfully!");
      navigate('/home');
    } catch (err) {
      alert("Error creating entry.");
    }
  };

  return (
    <>
    <Navbar />
    <div className="p-4 max-w-6xl mx-auto bg-gray-200 shadow-md rounded mt-8">
      
      <h2 className="text-2xl font-bold mb-6 text-center">Create Transport Entry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">

        {/* Form Fields with Labels */}
        {[
          ['lrNo', 'LR No'],
          ['month', 'Month', 'month'],
          ['date', 'Date', 'date'],
          ['vehicleNo', 'Vehicle No'],
          ['vehicleType', 'Vehicle Type'],
          ['origin', 'From'],
          ['destination', 'Destination'],
          ['driverNo', 'Driver No'],
          ['broker', 'Broker'],
          ['lorryHire', 'Lorry Hire'],
          ['advance', 'Advance'],
          ['balance', 'Balance'],
          ['freightRate', 'Freight'],
          ['lrCharges', 'LR Charges'],
          ['invoiceAmount', 'Billed Amount'],
          ['margin', 'Margin'],
          ['marginPercent', 'M%'],
          ['pod', 'POD'],
          ['billNo', 'Bill No'],
          ['remarks', 'Remarks']
        ].map(([key, label, type = 'text']) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              id={key}
              type={type}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={label}
              className="p-2 border rounded"
              required={key !== 'remarks'}
            />
          </div>
        ))}

        {/* Approval by CMD Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Approval by CMD</label>
          <select
            name="approvalByCMD"
            value={formData.approvalByCMD}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Payment Status Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Payment Date Field */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="col-span-1 mt-20 gap-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Entry
        </button>
      </form>
    </div>
    </>
  );
}