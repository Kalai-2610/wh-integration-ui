import { Search, Bell, User } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="navbar glass-effect">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search resources, users..." />
      </div>
      
      <div className="navbar-actions">
        <button className="action-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <div className="profile-dropdown">
          <div className="avatar">
            <User size={20} />
          </div>
          <span className="username">Admin</span>
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
        .search-bar {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem;
          width: 300px;
          gap: 0.5rem;
        }
        .search-bar input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.875rem;
          width: 100%;
        }
        .search-bar input:focus {
          outline: none;
        }
        .search-icon {
          color: var(--text-muted);
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
          color: var(--text-primary);
        }
        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          background: var(--brand-accent);
          border-radius: 50%;
          border: 2px solid var(--bg-primary);
        }
        .profile-dropdown {
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
      `}</style>
    </header>
  )
}

export default Navbar
