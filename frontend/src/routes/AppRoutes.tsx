import { Routes, Route } from 'react-router-dom';
import ScrapePage from '../pages/ScrapePage';
import SignUpPage from '../pages/SignUpPage'

// in this file add routes/pages
// example <Route path="/login" element={<Login />} /> 
//where the login it creates in pages

const AppRoutes = () => {
  return (
    <Routes>
      {/* Here declare all pages of the application */}
      <Route path="/" element={<ScrapePage />} />
      <Route path="/sign-up" element={<SignUpPage/>} />
    

      {/* 
        Ex. sixth page without layout:
        <Route path="/login" element={<Login />} />
      */}
    </Routes>
  );
};

export default AppRoutes;
