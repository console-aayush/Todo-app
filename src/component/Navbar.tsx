import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  token: string | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, token, onLogout }) => {
  const navigate = useNavigate();

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const buttonClass = `px-3 py-1 rounded transition ${darkMode
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-white hover:bg-gray-200 text-black"
    }`;

  return (
    <nav className={`flex justify-between items-center px-6 py-3 shadow ${bgClass}`}>
      {/* Left side - App name */}
      <div className="text-2xl font-semibold">Todo App</div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-3">
        <button onClick={toggleDarkMode} className={buttonClass}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {token ? (
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
