import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Database, ShieldCheck, LogOut, Code2 } from 'lucide-react'

import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { logout } = useAuth()
  
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Users', path: '/users' },
    { icon: <Code2 size={20} />, label: 'Resources', path: '/resources' },
    { icon: <ShieldCheck size={20} />, label: 'Credentials', path: '/credentials' },
    { icon: <Database size={20} />, label: 'Data Explorer', path: '/data' },
  ]

  return (
    <aside className="sidebar glass-effect">
      <div className="sidebar-header">
        <div className="logo">
          <Database className="brand-icon" />
          <span>WH Integration</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <NavLink 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--glass-border);
          z-index: 10;
        }
        .sidebar-header {
          padding: var(--space-lg);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        .brand-icon {
          color: var(--brand-primary);
        }
        .sidebar-nav {
          flex: 1;
          padding: var(--space-sm);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
          font-weight: 500;
          border: none;
          background: transparent;
          width: 100%;
          cursor: pointer;
        }
        .nav-item:hover {
          background: var(--bg-accent);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: linear-gradient(135deg, rgba(126, 34, 206, 0.2), rgba(14, 165, 233, 0.2));
          color: var(--text-primary);
          border: 1px solid rgba(126, 34, 206, 0.3);
        }
        .sidebar-footer {
          padding: var(--space-sm);
          border-top: 1px solid var(--glass-border);
        }
        .logout-btn:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </aside>
  )
}

export default Sidebar
