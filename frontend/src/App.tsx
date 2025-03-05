
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';


const App: React.FC = () => {

  console.log("App.tsx is rendering!");

  return (
    // BrowserRouter manages navigation (the URL) throughout the application
    <BrowserRouter>
    <Navbar />
      {/* 
        AppRoutes contains all route definitions;
        BrowserRouter “listens” to the URL and returns the corresponding components.
      */}
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App
