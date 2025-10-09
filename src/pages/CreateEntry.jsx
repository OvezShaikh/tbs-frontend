import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function CreateEntry() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    lrNo: '',
    month: '',
    date: '',
    plant: '',
    vehicleNo: '',
    vehicleType: '',
    origin: '',
    destination: '',
    freightRate: '',
    invoiceNo: '',
    billNo: '',
    remarks: '',
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(res.data);
      } catch (err) {
        console.error('Failed to load vehicles', err);
      }
    };
    fetchVehicles();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicleNo) => {
    const selectedVehicle = vehicles.find(v => v.vehicleNo === vehicleNo);
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleNo: selectedVehicle.vehicleNo,
        vehicleType: selectedVehicle.vehicleType,
        plant: selectedVehicle.plant || prev.plant,
        origin: prev.origin,
        destination: prev.destination,
        freightRate: '', // reset freightRate to trigger rate fetch
      }));
    }
  };

  // Auto-fetch rate whenever plant, origin, destination, or vehicleType changes
 useEffect(() => {
  const fetchRate = async () => {
    const { plant, origin, destination, vehicleType } = formData;
    if (plant && origin && destination && vehicleType) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rates/find`, {
          params: { plant, origin, destination, vehicleType, vehicleNo: formData.vehicleNo },
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData(prev => ({
          ...prev,
          freightRate: res.data.rate ?? prev.freightRate ?? '',
        }));
      } catch (err) {
        console.warn('No rate found, please enter manually');
        setFormData(prev => ({ ...prev, freightRate: prev.freightRate ?? '' }));
      }
    }
  };

  fetchRate();
}, [formData.plant, formData.origin, formData.destination, formData.vehicleType, token]);


  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, freightRate: Number(formData.freightRate) || 0 };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/entries`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Entry created successfully!');
      navigate('/home');
    } catch (err) {
      console.error('Error creating entry:', err);
      alert('Error creating entry.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Create Transport Entry
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ['lrNo', 'LR No'],
            ['month', 'Month', 'month'],
            ['date', 'Date', 'date'],
            ['plant', 'Plant'],
            ['vehicleNo', 'Vehicle No'],
            ['origin', 'Origin'],
            ['destination', 'Destination'],
            ['freightRate', 'Freight Rate', 'number'],
            ['invoiceNo', 'Shipment (Customer Invoice No)'],
            ['billNo', 'Bill No'],
            ['remarks', 'Remark'],
          ].map(([key, label, type = 'text']) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="mb-2 font-medium text-gray-700">{label}</label>

              {key === 'vehicleNo' ? (
                <select
                  id={key}
                  name={key}
                  value={formData.vehicleNo}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  required
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.vehicleNo}>
                      {v.vehicleNo} ({v.vehicleType})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={key}
                  type={type}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={label}
                  className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required={key !== 'remarks'}
                />
              )}
            </div>
          ))}

          <div className="md:col-span-3 flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
            >
              Submit Entry
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
