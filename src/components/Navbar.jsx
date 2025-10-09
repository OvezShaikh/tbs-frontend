import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.username) {
      setUsername(storedUser.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-blue-300 p-4 text-white flex justify-between items-center w-full">
      <div className="flex items-center gap-6">
        <Link to="/home" className="font-bold text-lg text-white">
          <img
            src="/starrllogo.png"
            alt="Logo"
            className="h-8 w-38 inline-block mr-2"
          />
        </Link>
        {username && (
          <span className="text-sm text-white">
            Welcome, <span className="font-semibold">{username}</span>
          </span>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-gray-200"
      >
        Logout
      </button>
    </nav>
  );
}
