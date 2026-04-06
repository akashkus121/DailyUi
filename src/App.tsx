import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';  
import Register from './pages/Register';
import DailyHealthForm from './pages/DailyHealthForm';
import Dashboard from './pages/Dashboard';
import UserProvider from './context/UserContext';
import { ToastContainer } from "react-toastify";
import './App.css';

function App() {
  return (
    <UserProvider>
      {/* ToastContainer can be here; it will work globally */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/daily-health" element={<DailyHealthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;