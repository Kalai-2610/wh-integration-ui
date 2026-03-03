import { Search, Plus, Filter, MoreVertical, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ManagementPage = ({ title, subtitle, columns, data, loading, error }) => {
  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Add New
        </button>
      </div>

      <div className="table-controls glass-effect">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder={`Search ${title.toLowerCase()}...`} />
        </div>
        <button className="btn btn-secondary">
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="table-container glass-effect">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              className="table-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="animate-spin" />
              <p>Loading {title.toLowerCase()}...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              className="table-state error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>{error}</p>
            </motion.div>
          ) : (
            <motion.table 
              key="table"
              className="data-table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <thead>
                <tr>
                  {columns.map((col, i) => <th key={i}>{col}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => <td key={j}>{typeof val === 'string' ? val : JSON.stringify(val)}</td>)}
                    <td>
                      <button className="action-dots"><MoreVertical size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </motion.table>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-xl);
        }
        .table-controls {
          display: flex;
          gap: var(--space-md);
          padding: 1rem;
          margin-bottom: var(--space-md);
          border-radius: var(--radius-md);
        }
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-secondary);
          padding: 0 1rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
        }
        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          padding: 0.75rem 0;
          width: 100%;
        }
        .search-box input:focus { outline: none; }
        
        .table-container {
          border-radius: var(--radius-md);
          overflow: hidden;
          min-height: 200px;
          position: relative;
        }
        .table-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
          gap: 1rem;
          color: var(--text-muted);
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th {
          background: rgba(255, 255, 255, 0.02);
          padding: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--glass-border);
        }
        .data-table td {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .data-table tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }
        .action-dots {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default ManagementPage
