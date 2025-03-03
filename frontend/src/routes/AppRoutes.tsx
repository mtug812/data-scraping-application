import { Routes, Route } from 'react-router-dom';
import ScrapePage from '../pages/ScrapePage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* here we declare the pages */}
      <Route path="/" element={<ScrapePage />} />
      
      {/* 
        login:
        <Route path="/login" element={<Login />} />
      */}
    </Routes>
  );
};

export default AppRoutes;
