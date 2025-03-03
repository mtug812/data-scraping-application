// import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutButton = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Șterge token-ul și informațiile de autentificare
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    
    // Șterge header-ul din Axios
    delete axios.defaults.headers.common['Authorization'];
    
    // Redirecționează la pagina de login
    navigate("/login");
  };
  
  return (
    <button 
      onClick={handleLogout}
      className="text-white hover:text-gray-300"
    >
      Logout
    </button>
  );
};

export default LogoutButton;