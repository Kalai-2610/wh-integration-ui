import { useState, useEffect, useRef } from 'react'
import { User, Sun, Moon, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // Fallback to system preference (assuming dark as default otherwise)
    return true
  })

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return (
    <header className="navbar glass-effect">
      <div className="navbar-spacer"></div>
      
      <div className="navbar-actions">
        <button className="action-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="profile-dropdown" ref={dropdownRef} onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <div className="avatar">
            <User size={20} />
          </div>
          <span className="username">{user?.name || user?.email || (typeof user === 'string' ? user : 'User')}</span>
          
          {isProfileOpen && (
            <div className="profile-menu">
              <button className="dropdown-item logout-btn" onClick={logout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: 70px;
          padding: 0 var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .navbar-spacer {
          flex: 1;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .action-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-btn:hover {
          color: var(--brand-primary);
          background: var(--brand-primary-muted);
          border-radius: 50%;
        }
        .theme-toggle {
          padding: 8px;
        }
        .profile-dropdown {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
        }
        .profile-dropdown:hover {
          background: var(--bg-accent);
        }
        .avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .username {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .profile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          padding: 0.5rem;
          min-width: 150px;
          z-index: 50;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background 0.2s;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--bg-hover);
        }
        .logout-btn {
          color: var(--error);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1); /* light red hover */
        }
      `}</style>
    </header>
  )
}

export default Navbar
