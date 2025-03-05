import { Routes, Route } from 'react-router-dom';
import ScrapePage from '../pages/ScrapePage';
import SignUpPage from '../pages/SignUpPage'
import Login from '../pages/Login'
import HistoryPage from '../pages/HistoryPage';


// in this file add routes/pages
// example <Route path="/login" element={<Login />} /> 
//where the login it creates in pages

const AppRoutes = () => {
  return (
    <Routes>
      {/* Here declare all pages of the application */}
      <Route path="/" element={<ScrapePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
};

export default AppRoutes;
