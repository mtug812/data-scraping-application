import { Routes, Route } from 'react-router-dom';
import ScrapePage from '../pages/ScrapePage';

// in fisierul asta adaug rutele/pagini
// exemplu <Route path="/login" element={<Login />} /> 
//unde login il creez in pages

const AppRoutes = () => {
  return (
    <Routes>
      {/* Aici declari toate paginile aplicației */}
      <Route path="/" element={<ScrapePage />} />

      {/* 
        Ex. altă pagină fără layout:
        <Route path="/login" element={<Login />} />
      */}
    </Routes>
  );
};

export default AppRoutes;
