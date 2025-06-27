import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold">TBS Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
          Welcome to Transport & Billing Dashboard 🚛
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Entry Card */}
          <div className="p-6 bg-white rounded shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Create Entry</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add a new transport log for tracking and billing.
            </p>
            <button
              onClick={() => {
                if (isCreateAllowed) navigate("/create");
              }}
              disabled={!isCreateAllowed}
              className={`px-4 py-2 rounded text-white ${
                isCreateAllowed
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
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
          <div className="p-6 bg-white rounded shadow text-center">
            <h2 className="text-xl font-semibold mb-2">View Entries</h2>
            <p className="text-sm text-gray-600 mb-4">
              Check the logs with user audit trail.
            </p>
            <button
              onClick={() => {
                if (isViewAllowed) navigate("/view");
              }}
              disabled={!isViewAllowed}
              className={`px-4 py-2 rounded text-white ${
                isViewAllowed
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
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
        </div>
      </main>
    </div>
  );
}
