import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2, ChevronDown, ChevronRight, Save, AlertCircle, Settings } from 'lucide-react'

const AUTH_METHODS = [
  { value: 'open', label: 'Open' },
  { value: 'basic', label: 'Basic' },
  { value: 'api_key', label: 'API Key' },
  { value: 'token', label: 'Token' },
  { value: 'oauth2', label: 'OAuth 2.0' }
]

const FIELD_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date Time' },
  { value: 'object', label: 'Object' }
]

const SchemaField = ({ field, path, updateField, removeField, level = 1 }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleChange = (key, value) => {
    updateField(path, { ...field, [key]: value })
  }

  const handleNumChange = (key, val, isFloat = false) => {
    if (val === '') {
      const newField = { ...field }
      delete newField[key]
      updateField(path, newField)
    } else {
      handleChange(key, isFloat ? Number.parseFloat(val) : Number.parseInt(val, 10))
    }
  }

  const addChildField = () => {
    const newKeys = [...(field.keys || []), { key: '', type: 'string', required: false }]
    handleChange('keys', newKeys)
  }

  const removeChildField = (childIndex) => {
    const newKeys = field.keys.filter((_, i) => i !== childIndex)
    handleChange('keys', newKeys)
  }

  const handleOptionsChange = (val, type) => {
    if (!val.trim()) {
      const newField = { ...field }
      delete newField.options
      updateField(path, newField)
      return
    }
    const arr = val.split(',').map(s => s.trim()).filter(Boolean)
    if (type === 'number') {
      handleChange('options', arr.map(Number).filter(n => !Number.isNaN(n)))
    } else {
      handleChange('options', arr)
    }
  }

  const handleTypeChange = (newType) => {
    // Keep base properties, reset type-specific ones
    const baseKeys = ['key', 'type', 'required', 'is_multiple', 'min_size', 'max_size', 'unique']
    const newField = {}
    for (const k of baseKeys) {
      if (field[k] !== undefined) newField[k] = field[k]
    }
    newField.type = newType
    if (newType === 'object') {
      newField.keys = []
    }
    updateField(path, newField)
  }

  return (
    <div className={`schema-field level-${level}`}>
      <div className="field-row">
        {field.type === 'object' && (
          <button type="button" className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        <input 
          type="text" 
          placeholder="Field Key" 
          value={field.key || ''} 
          onChange={(e) => handleChange('key', e.target.value)}
          className="field-key-input"
        />
        <select 
          value={field.type || 'string'} 
          onChange={(e) => handleTypeChange(e.target.value)}
          className="field-type-select"
        >
          {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        
        <label className="checkbox-label custom-checkbox">
          <input 
            type="checkbox" 
            checked={field.required || false} 
            onChange={(e) => handleChange('required', e.target.checked)} 
          />
          <span className="checkmark"></span>
          Required
        </label>

        <button 
          type="button" 
          className={`settings-btn ${isSettingsOpen ? 'active' : ''}`} 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
          title="Advanced Settings"
        >
          <Settings size={16} />
        </button>

        <button type="button" className="remove-btn" onClick={() => removeField(path[path.length - 1])} title="Remove Field">
          <Trash2 size={16} />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="field-settings-panel">
          <div className="settings-grid">
            <div className="setting-group full-width" style={{ flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
              <label className="checkbox-label custom-checkbox">
                <input type="checkbox" checked={field.is_multiple || false} onChange={(e) => handleChange('is_multiple', e.target.checked)} />
                <span className="checkmark"></span> Is Array (Multiple)
              </label>
              
              {field.is_multiple && (
                <label className="checkbox-label custom-checkbox">
                  <input type="checkbox" checked={field.unique || false} onChange={(e) => handleChange('unique', e.target.checked)} />
                  <span className="checkmark"></span> Unique Items
                </label>
              )}
            </div>

            {field.is_multiple && (
              <>
                <div className="setting-group">
                  <label>Min Array Size:</label>
                  <input type="number" value={field.min_size ?? ''} onChange={(e) => handleNumChange('min_size', e.target.value)} />
                </div>
                <div className="setting-group">
                  <label>Max Array Size:</label>
                  <input type="number" value={field.max_size ?? ''} onChange={(e) => handleNumChange('max_size', e.target.value)} />
                </div>
              </>
            )}

            {field.type === 'string' && (
              <>
                <div className="setting-group full-width">
                  <label>Allowed Options (comma separated):</label>
                  <input type="text" placeholder="e.g. OptionA, OptionB" value={field.options?.join(', ') || ''} onChange={(e) => handleOptionsChange(e.target.value, 'string')} />
                </div>
                {!field.options?.length && (
                  <>
                    <div className="setting-group">
                      <label>Min Length:</label>
                      <input type="number" value={field.min ?? ''} onChange={(e) => handleNumChange('min', e.target.value)} />
                    </div>
                    <div className="setting-group">
                      <label>Max Length:</label>
                      <input type="number" value={field.max ?? ''} onChange={(e) => handleNumChange('max', e.target.value)} />
                    </div>
                    <div className="setting-group full-width">
                      <label>Regex Pattern:</label>
                      <input type="text" placeholder="e.g. ^[a-z]+$" value={field.regex || ''} onChange={(e) => handleChange('regex', e.target.value)} />
                    </div>
                    <div className="setting-group full-width" style={{ flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                      <label className="checkbox-label custom-checkbox">
                        <input type="checkbox" checked={field.email || false} onChange={(e) => handleChange('email', e.target.checked)} />
                        <span className="checkmark"></span> Email Format
                      </label>
                      <label className="checkbox-label custom-checkbox">
                        <input type="checkbox" checked={field.lowercase || false} onChange={(e) => handleChange('lowercase', e.target.checked)} />
                        <span className="checkmark"></span> Force Lowercase
                      </label>
                      <label className="checkbox-label custom-checkbox">
                        <input type="checkbox" checked={field.uppercase || false} onChange={(e) => handleChange('uppercase', e.target.checked)} />
                        <span className="checkmark"></span> Force Uppercase
                      </label>
                    </div>
                  </>
                )}
              </>
            )}

            {field.type === 'number' && (
              <>
                <div className="setting-group full-width">
                  <label>Allowed Options (comma separated numbers):</label>
                  <input type="text" placeholder="e.g. 10, 20, 30" value={field.options?.join(', ') || ''} onChange={(e) => handleOptionsChange(e.target.value, 'number')} />
                </div>
                {!field.options?.length && (
                  <>
                    <div className="setting-group">
                      <label>Min Value:</label>
                      <input type="number" step="any" value={field.min ?? ''} onChange={(e) => handleNumChange('min', e.target.value, true)} />
                    </div>
                    <div className="setting-group">
                      <label>Max Value:</label>
                      <input type="number" step="any" value={field.max ?? ''} onChange={(e) => handleNumChange('max', e.target.value, true)} />
                    </div>
                    <div className="setting-group full-width" style={{ flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                      <label className="checkbox-label custom-checkbox">
                        <input type="checkbox" checked={field.integer || false} onChange={(e) => handleChange('integer', e.target.checked)} />
                        <span className="checkmark"></span> Integer Only
                      </label>
                      <label className="checkbox-label custom-checkbox">
                        <input type="checkbox" checked={field.decimal || false} onChange={(e) => handleChange('decimal', e.target.checked)} />
                        <span className="checkmark"></span> Allow Decimal
                      </label>
                    </div>
                    {field.decimal && (
                      <>
                        <div className="setting-group">
                          <label>Min Decimals:</label>
                          <input type="number" value={field.decimal_min_places ?? ''} onChange={(e) => handleNumChange('decimal_min_places', e.target.value)} />
                        </div>
                        <div className="setting-group">
                          <label>Max Decimals:</label>
                          <input type="number" value={field.decimal_max_places ?? ''} onChange={(e) => handleNumChange('decimal_max_places', e.target.value)} />
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {(field.type === 'date' || field.type === 'datetime') && (
              <>
                <div className="setting-group">
                  <label>Min Date/Time:</label>
                  <input type="text" placeholder="ISO String" value={field.min || ''} onChange={(e) => handleChange('min', e.target.value)} />
                </div>
                <div className="setting-group">
                  <label>Max Date/Time:</label>
                  <input type="text" placeholder="ISO String" value={field.max || ''} onChange={(e) => handleChange('max', e.target.value)} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {field.type === 'object' && isExpanded && (
        <div className="child-fields">
          {field.keys?.map((child, index) => (
            <SchemaField 
              key={`${level}-${index}-${child.key || 'new'}`}
              field={child}
              path={[...path, index]}
              updateField={updateField}
              removeField={removeChildField}
              level={level + 1}
            />
          ))}
          {level < 3 ? (
            <button type="button" className="add-child-btn" onClick={addChildField}>
              <Plus size={14} /> Add Property
            </button>
          ) : (
            <div className="nesting-limit-info">Max nesting level (3) reached</div>
          )}
        </div>
      )}
    </div>
  )
}

const ResourceModal = ({ isOpen, onClose, onSave, resource = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    api_path: '',
    reference_name: '',
    allowed_auth_methods: [],
    schema: []
  })
  const [error, setError] = useState('')
  const [detailedErrors, setDetailedErrors] = useState([])

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || '',
        api_path: resource.api_path || '',
        reference_name: resource.reference_name || '',
        allowed_auth_methods: resource.allowed_auth_methods || [],
        schema: resource.schema || []
      })
    } else {
      setFormData({
        name: '',
        api_path: '',
        reference_name: '',
        allowed_auth_methods: [],
        schema: []
      })
    }
    setError('')
    setDetailedErrors([])
  }, [resource, isOpen])

  const toggleAuthMethod = (method) => {
    const updated = formData.allowed_auth_methods.includes(method)
      ? formData.allowed_auth_methods.filter(m => m !== method)
      : [...formData.allowed_auth_methods, method]
    setFormData({ ...formData, allowed_auth_methods: updated })
  }

  const addSchemaRootField = () => {
    setFormData({
      ...formData,
      schema: [...formData.schema, { key: '', type: 'string', required: false }]
    })
  }

  const updateSchemaField = (path, updatedField) => {
    const newSchema = [...formData.schema]
    let current = newSchema
    for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].keys
    }
    current[path[path.length - 1]] = updatedField
    setFormData({ ...formData, schema: newSchema })
  }

  const removeSchemaRootField = (index) => {
    setFormData({
      ...formData,
      schema: formData.schema.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setDetailedErrors([])
    
    if (!formData.name || !formData.api_path || !formData.reference_name) {
      setError('Please fill in all basic fields.')
      return
    }

    if (!formData.schema || formData.schema.length === 0) {
      setError('At least one Schema Metadata field is required.')
      return
    }
    
    try {
      await onSave(formData)
    } catch (err) {
      const respData = err.response?.data;
      if (respData) {
        setError(respData.error || 'Failed to save resource.');
        if (respData.errors && Array.isArray(respData.errors)) {
          setDetailedErrors(respData.errors);
        }
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <motion.div 
        className="modal-content glass-effect"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Create New Resource' : 'Edit Resource'}</h2>
          <button type="button" className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-message">
              <div className="error-header">
                <AlertCircle size={14} /> {error}
              </div>
              {detailedErrors.length > 0 && (
                <ul className="detailed-errors">
                  {detailedErrors.map((errDetail, idx) => (
                    <li key={idx}>
                      {typeof errDetail === 'string' ? errDetail : errDetail.message || JSON.stringify(errDetail)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          <div className="form-section">
            <div className="form-group">
              <label>Resource Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g., User Profile"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>API Path</label>
                <input 
                  type="text" 
                  value={formData.api_path} 
                  onChange={(e) => setFormData({...formData, api_path: e.target.value})} 
                  placeholder="e.g., users"
                />
              </div>
              <div className="form-group">
                <label>Reference Name</label>
                <input 
                  type="text" 
                  value={formData.reference_name} 
                  onChange={(e) => setFormData({...formData, reference_name: e.target.value})} 
                  placeholder="e.g., user"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <label>Allowed Auth Methods</label>
            <div className="auth-methods-grid">
              {AUTH_METHODS.map(method => (
                <button 
                  key={method.value}
                  type="button"
                  className={`auth-tag ${formData.allowed_auth_methods.includes(method.value) ? 'active' : ''}`}
                  onClick={() => toggleAuthMethod(method.value)}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="section-header">
              <label>Schema Metadata</label>
              <button type="button" className="add-btn" onClick={addSchemaRootField}>
                <Plus size={14} /> Add Field
              </button>
            </div>
            <div className="schema-builder">
              {formData.schema.map((field, index) => (
                <SchemaField 
                  key={`root-${index}-${field.key || 'new'}`}
                  field={field}
                  path={[index]}
                  updateField={updateSchemaField}
                  removeField={removeSchemaRootField}
                  level={1}
                />
              ))}
              {formData.schema.length === 0 && (
                <div className="empty-schema">No fields defined yet. Click "Add Root Field" to start.</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {mode === 'create' ? 'Create Resource' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .modal-content {
          width: 90vw;
          max-width: 1200px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
        }
        .modal-header h2 { margin: 0; font-size: 1.25rem; }
        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover { color: white; }
        
        .modal-form { 
          padding: 1.5rem; 
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
          overflow-y: auto;
          flex: 1;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .error-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .detailed-errors {
          margin: 0;
          padding-left: 1.5rem;
          font-size: 0.8rem;
          list-style-type: disc;
        }
        
        .form-section { display: flex; flex-direction: column; gap: 1rem; flex-shrink: 0; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label, .section-header label { font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; }
        .form-group input {
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 6px;
          padding: 0.75rem;
          color: var(--text-primary);
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          border-color: var(--brand-primary);
          outline: none;
        }
        
        .auth-methods-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .auth-tag {
          padding: 0.5rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .auth-tag:hover { border-color: var(--brand-primary-border); }
        .auth-tag.active {
          background: var(--brand-primary);
          color: white;
          border-color: var(--brand-primary);
          box-shadow: 0 0 10px var(--brand-primary-glow);
        }
        
        .schema-builder {
          background: var(--bg-tertiary);
          border-radius: 6px;
          padding: 1rem;
          border: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .schema-field { margin-bottom: 0.5rem; }
        .field-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-tertiary);
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          border: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .field-row:hover { border-color: rgba(255, 255, 255, 0.1); }
        
        /* Custom Inputs & Selects for Schema Builder */
        .field-key-input, .field-type-select {
          background: var(--bg-input);
          border: 1px solid var(--glass-border);
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s;
        }
        .field-type-select option, .page-size select option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
        .field-key-input { flex: 1; min-width: 150px; }
        .field-type-select { min-width: 120px; appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1em; padding-right: 2rem; }
        .field-key-input:focus, .field-type-select:focus { border-color: var(--brand-primary); }
        
        /* Custom Checkbox CSS */
        .custom-checkbox {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 24px;
          cursor: pointer;
          user-select: none;
          min-height: 18px;
        }
        .custom-checkbox input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        .checkmark {
          position: absolute;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: var(--bg-input);
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          transition: all 0.2s;
        }
        .custom-checkbox:hover input ~ .checkmark { border-color: var(--brand-primary); }
        .custom-checkbox input:checked ~ .checkmark {
          background-color: var(--brand-primary);
          border-color: var(--brand-primary);
        }
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }
        .custom-checkbox input:checked ~ .checkmark:after { display: block; }
        .custom-checkbox .checkmark:after {
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        
        .settings-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .settings-btn:hover { color: var(--text-primary); background: var(--bg-hover); }
        .settings-btn.active { color: var(--brand-primary); background: var(--brand-primary-muted); border-color: var(--brand-primary-glow); }
        
        .remove-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #ef4444;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          opacity: 0.7;
          transition: all 0.2s;
        }
        .remove-btn:hover { opacity: 1; background: rgba(239, 68, 68, 0.1); }
        
        .field-settings-panel {
          margin: 0.5rem 0 0.5rem 2rem;
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--glass-border);
          border-radius: 6px;
          border-left: 2px solid var(--brand-primary);
        }
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          align-items: flex-end;
        }
        .settings-grid .full-width {
          grid-column: 1 / -1;
        }
        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .setting-group label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .setting-group input {
          background: var(--bg-input);
          border: 1px solid var(--glass-border);
          padding: 0.4rem 0.6rem;
          border-radius: 4px;
          color: white;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .setting-group input:focus { border-color: var(--brand-primary); outline: none; }
        
        .child-fields {
          margin-left: 1.5rem;
          border-left: 1px solid var(--glass-border);
          padding-left: 1rem;
          margin-top: 0.5rem;
        }
        .add-child-btn, .add-btn {
          background: transparent;
          border: 1px dashed var(--brand-primary);
          color: var(--brand-primary);
          font-size: 0.75rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .add-child-btn:hover, .add-btn:hover { background: var(--brand-primary-muted); }
        .nesting-limit-info {
          font-size: 0.75rem;
          color: #f59e0b;
          padding: 0.25rem 0;
          display: inline-flex;
          align-items: center;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 4px;
          padding: 0.4rem 0.75rem;
        }
        .expand-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }
        .expand-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
        .empty-schema {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          border-radius: 6px;
          border: 1px dashed var(--glass-border);
          font-size: 0.875rem;
        }
        
        .modal-footer {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

export default ResourceModal
