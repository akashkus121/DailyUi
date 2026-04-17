import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';  
import Register from './pages/Register';
import DailyHealthForm from './pages/DailyHealthForm';
import Dashboard from './pages/Dashboard';
import UserProvider from './context/UserContext';
import { Toaster } from "react-hot-toast"; // Switching to hot-toast to match your Login code
import FloatingChat from './components/FloatingChat';
import ExpenseActions from './pages/ExpenseActions';
import './App.css';

// This helper component handles the conditional rendering
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Define paths where the chat should NOT appear
  const publicPaths = ["/", "/register"];
  const isPublicPage = publicPaths.includes(location.pathname);

  return (
    <>
      {children}
      {!isPublicPage && <FloatingChat />}
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <Toaster position="top-right" />
      <Router>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/daily-health" element={<DailyHealthForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/expense' element={<ExpenseActions />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </UserProvider>
  );
}

export default App;