import { Routes, Route } from 'react-router-dom';
import ScrapePage from '../pages/ScrapePage';

// in this file add routes/pages
// example <Route path="/login" element={<Login />} /> 
//where the login it creates in pages

const AppRoutes = () => {
  return (
    <Routes>
      {/* Here declare all pages of the application */}
      <Route path="/" element={<ScrapePage />} />

      {/* 
        Ex. sixth page without layout:
        <Route path="/login" element={<Login />} />
      */}
    </Routes>
  );
};

export default AppRoutes;
