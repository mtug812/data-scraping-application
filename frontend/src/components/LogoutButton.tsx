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
    <button onClick={handleLogout} className="text-white hover:text-gray-300">
      Logout
    </button>
  );
};

export default LogoutButton;
