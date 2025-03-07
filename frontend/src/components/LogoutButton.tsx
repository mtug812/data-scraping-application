// import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");

    delete axios.defaults.headers.common["Authorization"];

    navigate("/login");
  };

  return (
    <a 
      href="/login" 
      onClick={handleLogout} 
      className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 relative group"
    >
      Logout
      <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
    </a>
  );
};


export default LogoutButton;
