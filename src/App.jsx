import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/DashboardLayout";
import './App.css'

function App() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('isSystem');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false)
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to='/resource_management' /> : <Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resource_management" element={ isLoggedIn ? <DashboardLayout onLogout={handleLogout} page='resource_management' /> : <Navigate to='/login' />} />
        {/* Catch all routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;