import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Resources from './pages/Resources'
import Credentials from './pages/Credentials'
import DataExplorer from './pages/DataExplorer'
import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <div className="bg-gradient" />
      <div className="app-container">
        <AnimatePresence mode="wait">
          {isAuthenticated ? (
            <motion.div
              key="dashboard"
              className="dashboard-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sidebar />
              <div className="main-content">
                <Navbar />
                <motion.div 
                  className="page-wrapper"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/credentials" element={<Credentials />} />
                    <Route path="/data" element={<DataExplorer />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      <style>{`
        .app-container {
          min-height: 100vh;
        }
        .dashboard-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .page-wrapper {
          flex: 1;
          padding: var(--space-lg);
          overflow-y: auto;
        }
      `}</style>
    </Router>
  )
}

export default App
