import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/DashboardLayout";
import './App.css'
import { logOutUser } from "./service/auth";
import { useEffect } from "react";

function App() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

/* check login on initial load */

  useEffect(() => {

    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");

    if (token && sessionId) {
      setIsLoggedIn(true);
    }

  }, [setIsLoggedIn]);

  /* cross-tab login/logout sync */

  useEffect(() => {

    const handleStorage = (event) => {

      if (event.key === "auth_event") {

        const token = localStorage.getItem("token");
        const sessionId = localStorage.getItem("sessionId");

        if (token && sessionId) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }

      }

    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);

  }, [setIsLoggedIn]);

  const handleLogout = () => {
    logOutUser().finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('isSystem');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      setIsLoggedIn(false)
      localStorage.setItem("auth_event", Date.now());
    });
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to='/resource_management' /> : <Navigate to='/login' />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to='/resource_management' /> : <Login />} />
        <Route path="/resource_management" element={isLoggedIn ? <DashboardLayout onLogout={handleLogout} page='resource_management' /> : <Navigate to='/login' />} />
        {/* Catch all routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;