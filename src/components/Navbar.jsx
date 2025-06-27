import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 p-4 text-white flex justify-between items-center w-full">
      <h1 className="font-bold text-lg">TBS Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-gray-200"
      >
        Logout
      </button>
    </nav>
  );
}
