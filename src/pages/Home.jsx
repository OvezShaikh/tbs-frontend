import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("User from storage:", storedUser);
    if (storedUser?.role) setRole(storedUser.role);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isCreateAllowed = role === "admin" || role === "transport";
  const isViewAllowed = role === "admin" || role === "billing" || role === "transport";
  const isRateManagerAllowed = role === "admin" || role === "transport";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
          Welcome to Transport & Billing Dashboard 🚛
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Entry Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Create Entry</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add a new transport log for tracking and billing.
            </p>
            <button
              onClick={() => {
                if (isCreateAllowed) navigate("/create");
              }}
              disabled={!isCreateAllowed}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${isCreateAllowed
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              title={
                isCreateAllowed
                  ? "Click to create a new entry"
                  : "Access restricted to Admin or Transport role"
              }
            >
              Go to Create Entry
            </button>
          </div>

          {/* View Entries Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">View Entries</h2>
            <p className="text-sm text-gray-600 mb-4">
              Check the logs with user audit trail.
            </p>
            <button
              onClick={() => {
                if (isViewAllowed) navigate("/view");
              }}
              disabled={!isViewAllowed}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${isViewAllowed
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              title={
                isViewAllowed
                  ? "Click to view entries"
                  : "Access restricted to Admin, Transport, or Billing"
              }
            >
              Go to View Entries
            </button>
          </div>

          {/* Rate Manager Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Rate Manager</h2>
            <p className="text-sm text-gray-600 mb-4">
              Manage transportation rates for vehicles and routes.
            </p>
            <button
              onClick={() => {
                if (isRateManagerAllowed) navigate("/rate-manager");
              }}
              disabled={!isRateManagerAllowed}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${isRateManagerAllowed
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              title={
                isRateManagerAllowed
                  ? "Click to manage rates"
                  : "Access restricted to Admin or Transport role"
              }
            >
              Go to Rate Manager
            </button>
          </div>

          {/* Bulk Upload Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Bulk Upload Vehicles</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload vehicle data in bulk using Excel file.
            </p>
            <button
              onClick={() => {
                if (role === "admin") navigate("/bulk-upload");
              }}
              disabled={role !== "admin"}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${role === "admin"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              title={
                role === "admin"
                  ? "Click to upload vehicles in bulk"
                  : "Access restricted to Admin only"
              }
            >
              Go to Bulk Upload
            </button>
          </div>

          {/* Additional cards can be added here for future features */}
          <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-500">More Features</h2>
            <p className="text-sm text-gray-400 mb-4">
              Additional features coming soon...
            </p>
            <button
              disabled
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-gray-700">Logged in as: <strong className="capitalize">{role || "Unknown"}</strong></span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">Access Level: {getAccessLevel(role)}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper function to determine access level
function getAccessLevel(role) {
  switch (role) {
    case "admin":
      return "Full Access";
    case "transport":
      return "Transport Management";
    case "billing":
      return "Billing & View Only";
    default:
      return "Limited Access";
  }
}