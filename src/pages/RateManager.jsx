import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function RateManager() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    vehicleNo: "",
    vehicleType: "",
    plant: "",
    chassisNo: "",
    fuelType: ""
  });

  const token = localStorage.getItem("token");

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data);
      setFilteredVehicles(res.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Fetch existing rates
  const fetchRates = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRates(res.data);
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchVehicles(), fetchRates()]).finally(() => setLoading(false));
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = vehicles.filter(vehicle => {
      return (
        (vehicle.vehicleNo || "").toLowerCase().includes((filters.vehicleNo || "").toLowerCase()) &&
        (vehicle.vehicleType || "").toLowerCase().includes((filters.vehicleType || "").toLowerCase()) &&
        (vehicle.plant || "").toLowerCase().includes((filters.plant || "").toLowerCase()) &&
        (vehicle.chassisNo || "").toLowerCase().includes((filters.chassisNo || "").toLowerCase()) &&
        (filters.fuelType === "" ||
          (vehicle.fuelType || "").toLowerCase().includes((filters.fuelType || "").toLowerCase()))
      );
    });
    setFilteredVehicles(filtered);
  }, [filters, vehicles]);

  // Get unique values for dropdown filters
  const uniqueValues = {
    vehicleType: [...new Set(vehicles.map(v => v.vehicleType))].filter(Boolean),
    plant: [...new Set(vehicles.map(v => v.plant))].filter(Boolean),
    fuelType: [...new Set(vehicles.map(v => v.fuelType))].filter(Boolean)
  };

  // Get rate by vehicle info (helper)
  const getVehicleRate = (vehicle) => {
    const match = rates.find(
      (r) =>
        r.vehicleType === vehicle.vehicleType &&
        r.plant === vehicle.plant &&
        r.vehicleNo === vehicle.vehicleNo
    );
    return match ? match.rate : "";
  };

  // Handle rate edit
  const handleRateChange = async (vehicle, newRate) => {
  const numericRate = parseFloat(newRate);
  if (isNaN(numericRate)) return;

  setEditingId(vehicle.id);

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/rates`, {
      plant: vehicle.plant,
      vehicleType: vehicle.vehicleType,
      vehicleNo: vehicle.vehicleNo,
      origin: vehicle.origin || "Mumbai",
      destination: vehicle.destination || "Pune",
      rate: numericRate,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await fetchRates(); // refresh rates
  } catch (err) {
    console.error("Error saving rate:", err);
  } finally {
    setEditingId(null);
  }
};



  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      vehicleNo: "",
      vehicleType: "",
      plant: "",
      chassisNo: "",
      fuelType: ""
    });
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Vehicle Rate Manager
            </h2>
            <p className="text-gray-600 text-center">
              Manage rates for your vehicle fleet
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Vehicle No Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle No
                </label>
                <input
                  type="text"
                  value={filters.vehicleNo}
                  onChange={(e) => handleFilterChange('vehicleNo', e.target.value)}
                  placeholder="Search vehicle no..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Vehicle Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={filters.vehicleType}
                  onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Types</option>
                  {uniqueValues.vehicleType.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Plant Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant
                </label>
                <select
                  value={filters.plant}
                  onChange={(e) => handleFilterChange('plant', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Plants</option>
                  {uniqueValues.plant.map(plant => (
                    <option key={plant} value={plant}>{plant}</option>
                  ))}
                </select>
              </div>

              {/* Chassis No Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chassis No
                </label>
                <input
                  type="text"
                  value={filters.chassisNo}
                  onChange={(e) => handleFilterChange('chassisNo', e.target.value)}
                  placeholder="Search chassis no..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Fuel Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Fuel Types</option>
                  {uniqueValues.fuelType.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </span>
              {Object.values(filters).some(filter => filter !== "") && (
                <span className="text-sm text-blue-600 font-medium">
                  Filters Active
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-700">
                  Vehicle Rates
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Sr No", "Vehicle No", "Vehicle Type", "Plant", "Chassis No", "Fuel Type", "Rate (₹)"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVehicles.map((vehicle, index) => (
                      <tr
                        key={vehicle.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {vehicle.vehicleNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {vehicle.vehicleType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {vehicle.plant}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {vehicle.chassisNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {vehicle.fuelType ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {vehicle.fuelType}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">₹</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              defaultValue={getVehicleRate(vehicle)}
                              onBlur={(e) => handleRateChange(vehicle, e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && e.target.blur()}
                              className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="Set rate"
                            />
                            {editingId === vehicle.id && (
                              <svg
                                className="animate-spin h-4 w-4 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {vehicles.length === 0
                      ? "No vehicles available. Add some vehicles first."
                      : "Try adjusting your filters to see more results."}
                  </p>
                  {vehicles.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}