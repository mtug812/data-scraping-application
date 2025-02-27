
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';


const App: React.FC = () => {
  return (
    // BrowserRouter gestionează navigarea (URL-ul) în toată aplicația
    <BrowserRouter>
      {/* 
        AppRoutes conține toate definițiile de rute;
        BrowserRouter “ascultă” URL-ul și redă componentele corespunzătoare. 
      */}
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App
