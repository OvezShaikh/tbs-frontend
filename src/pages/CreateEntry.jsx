// src/pages/CreateEntry.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateEntry() {
  const [formData, setFormData] = useState({
    date: '',
    lrNo: '',
    vehicleNo: '',
    transporterName: '',
    origin: '',
    destination: '',
    weight: '',
    freightRate: '',
    invoiceNo: '',
    invoiceAmount: '',
    gst: '',
    paymentStatus: 'Unpaid',
    paymentDate: '',
    remarks: ''
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
      await axios.post('http://localhost:5000/api/entries', formData, {
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
    <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Transport Entry</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[
          ['date', 'Date', 'date'],
          ['lrNo', 'LR No'],
          ['vehicleNo', 'Vehicle No'],
          ['transporterName', 'Transporter Name'],
          ['origin', 'Origin'],
          ['destination', 'Destination'],
          ['weight', 'Weight'],
          ['freightRate', 'Freight Rate'],
          ['invoiceNo', 'Invoice No'],
          ['invoiceAmount', 'Invoice Amount'],
          ['gst', 'GST'],
          ['paymentDate', 'Payment Date', 'date'],
          ['remarks', 'Remarks'],
        ].map(([key, label, type = 'text']) => (
          <input
            key={key}
            type={type}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={label}
            className="p-2 border rounded"
            required={key !== 'remarks'}
          />
        ))}

        <select
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Entry
        </button>
      </form>
    </div>
  );
}
