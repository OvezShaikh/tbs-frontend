// src/pages/UpdateEntry.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function UpdateEntry() {
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

  const [role, setRole] = useState('');
  const [authorized, setAuthorized] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Role check
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.role) {
      setRole(storedUser.role);
      setAuthorized(storedUser.role === 'billing' || storedUser.role === 'admin');
    }
  }, []);

  // Fetch entry details
  useEffect(() => {
    if (authorized) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setFormData(res.data))
      .catch(() => alert('Error fetching entry.'));
    }
  }, [id, token, authorized]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/entries/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Entry updated successfully!');
      navigate('/home');
    } catch (err) {
      alert('Error updating entry.');
    }
  };

  if (!authorized) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="p-6 bg-white rounded shadow text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-700">Only <strong>Billing</strong> or <strong>Admin</strong> users can update entries.</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
        <div className="p-6 max-w-6xl w-full bg-white shadow-lg rounded">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
            Update Transport Entry
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Approval Dropdown */}
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

            {/* Payment Status */}
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

            {/* Payment Date */}
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
              className="col-span-1 md:col-span-3 mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Update Entry
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
