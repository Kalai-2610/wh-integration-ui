import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Database, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { ADMIN_EMAIL } from '../config'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    const result = await login(email, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
      setIsSubmitting(false)
    }

  }

  return (
    <div className="login-page">
      <motion.div 
        className="login-card glass-effect"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="login-header">
          <motion.div 
            className="login-logo"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Database size={40} className="brand-icon" />
          </motion.div>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your integration assets</p>
        </div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input 
                type="text" 
                className="input-field" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href={`mailto:${ADMIN_EMAIL}`}>Contact Administrator</a></p>
        </div>
      </motion.div>

      <style>{`
        .login-page {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
        }
        .login-card {
          width: 100%;
          max-width: 450px;
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
        }
        .login-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }
        .login-logo {
          margin-bottom: var(--space-md);
          display: inline-flex;
          padding: 1rem;
          background: rgba(126, 34, 206, 0.1);
          border-radius: var(--radius-md);
        }
        .brand-icon {
          color: var(--brand-primary);
        }
        .login-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: var(--text-secondary);
        }
        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-md);
          font-size: 0.875rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .input-with-icon {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-field {
          padding-left: 3rem !important;
        }
        .login-btn {
          width: 100%;
          margin-top: var(--space-md);
          height: 50px;
          font-size: 1rem;
          gap: 0.5rem;
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .login-footer {
          margin-top: var(--space-xl);
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .login-footer a {
          color: var(--brand-primary);
          cursor: pointer;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

export default Login
