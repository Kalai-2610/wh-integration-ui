import { Search, Plus, MoreVertical, Loader2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

const ActionMenu = ({ onEdit, onDelete, row }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="action-menu-container" ref={menuRef} style={{ position: 'relative' }}>
      <button className="action-dots" onClick={() => setIsOpen(!isOpen)}>
        <MoreVertical size={18} />
      </button>
      {isOpen && (
        <div 
          className="action-dropdown glass-effect"
          style={{ zIndex: 9999 }}
        >
          <button 
            className="dropdown-item" 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              setIsOpen(false);
              onEdit?.(row); 
            }}
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button 
            className="dropdown-item delete" 
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              setIsOpen(false);
              onDelete?.(row); 
            }}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

const ManagementPage = ({ 
  title, 
  subtitle, 
  columns, 
  data, 
  loading, 
  error, 
  onSearch,
  onAdd,
  onEdit,
  onDelete,
  pagination = { page: 1, size: 10, total: 0 },
  onPageChange,
  onSizeChange,
  sort = { sortBy: 'name', sortOrder: 'asc' },
  onSortChange
}) => {
  const { page, size, total } = pagination;
  const totalPages = Math.ceil(total / size);

  const handleSort = (colObj) => {
    if (!colObj.sortKey) return;
    const field = colObj.sortKey;
    const isSameField = sort.sortBy === field;
    const newOrder = isSameField && sort.sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange?.(field, newOrder);
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <motion.div 
          key="loading"
          className="table-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="animate-spin" />
          <p>Loading {(title || 'resources').toLowerCase()}...</p>
        </motion.div>
      )
    }

    if (error) {
      return (
        <motion.div 
          key="error"
          className="table-state error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p>{error}</p>
        </motion.div>
      )
    }

    return (
      <div className="table-wrapper">
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
              {columns.map((col, i) => {
                const label = typeof col === 'string' ? col : col.label;
                let sortKey = null;
                if (typeof col === 'object' && 'sortKey' in col) {
                  sortKey = col.sortKey;
                }
                
                const isSortable = !!sortKey;
                const isSorted = isSortable && sort.sortBy === sortKey;
                
                return (
                  <th key={i} onClick={() => isSortable && handleSort({ sortKey })} className={isSortable ? "sortable-header" : ""}>
                    <div className="header-content">
                      {label}
                      {isSortable && (
                        <span className="sort-icon">
                          {isSorted ? (
                            sort.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : (
                            <ChevronDown size={14} className="inactive-sort" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, i) => (
              <tr key={i}>
                {Object.keys(row).map((key, j) => {
                  // Skip _original hidden field if present
                  if (key === '_original' || key === '_id') return null;
                  
                  const val = row[key];
                  let cellContent = ''
                  if (typeof val === 'string') {
                    cellContent = val
                  } else if (val !== null && val !== undefined) {
                    cellContent = JSON.stringify(val)
                  }
                  
                  return <td key={j}>{cellContent}</td>
                }).filter(Boolean)}
                <td>
                  <ActionMenu 
                    row={row._original || row} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} className="no-data">No results found</td>
              </tr>
            )}
          </tbody>
        </motion.table>
      </div>
    )
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={20} />
          Add New
        </button>
      </div>

      <div className="table-controls glass-effect">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder={"Search " + (title || 'resources').toLowerCase() + "..."} 
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container glass-effect">
        <AnimatePresence mode="wait">
          {renderTableContent()}
        </AnimatePresence>
        
        {!loading && !error && total > 5 && (
          <div className="pagination-footer">
            <div className="pagination-info">
              Showing {Math.min((page - 1) * size + 1, total)} to {Math.min(page * size, total)} of {total} entries
            </div>
            <div className="pagination-controls">
              <div className="page-size">
                <span>Page size:</span>
                <select value={size} onChange={(e) => onSizeChange?.(Number(e.target.value))}>
                  {[5, 10, 20, 30, 40, 50]
                    .filter(s => s < total)
                    .concat(size > total ? [] : ( [5, 10, 20, 30, 40, 50].includes(size) ? [] : [size] ))
                    .sort((a,b) => a-b)
                    .map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="page-nav">
                <button 
                  disabled={page <= 1} 
                  onClick={() => onPageChange?.(page - 1)}
                  className="nav-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="current-page">{page} / {totalPages || 1}</span>
                <button 
                  disabled={page >= totalPages} 
                  onClick={() => onPageChange?.(page + 1)}
                  className="nav-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
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
          min-height: 200px;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .table-wrapper {
          flex: 1;
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
          background: var(--bg-tertiary);
          padding: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--glass-border);
        }
        .data-table th:first-child {
          border-top-left-radius: var(--radius-md);
        }
        .data-table th:last-child {
          border-top-right-radius: var(--radius-md);
        }
        .sortable-header {
          cursor: pointer;
          user-select: none;
          transition: background 0.2s;
        }
        .sortable-header:hover {
          background: var(--bg-hover);
        }
        .header-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sort-icon {
          display: flex;
          align-items: center;
          color: var(--brand-primary);
        }
        .inactive-sort {
          opacity: 0.2;
        }
        .data-table td {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .data-table tr:hover {
          background: var(--bg-hover);
        }
        
        .data-table td.actions-cell {
          position: relative;
        }

        .action-menu-container {
          position: relative;
        }
        .action-dots {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          padding: 4px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .action-dots:hover {
          background: var(--bg-hover);
        }
        .action-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          z-index: 100;
          min-width: 120px;
          background: var(--bg-secondary);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          padding: 4px;
          margin-top: 4px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          border-radius: 4px;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .dropdown-item.delete:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .no-data {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }

        .pagination-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-tertiary);
          border-top: 1px solid var(--glass-border);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .page-size {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .page-size select {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          padding: 0.2rem 0.5rem;
        }
        .page-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .nav-btn {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          padding: 0.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .current-page {
          min-width: 3rem;
          text-align: center;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default ManagementPage
