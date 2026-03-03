import { motion } from 'framer-motion'
import { Activity, Users, Database, ShieldCheck, TrendingUp } from 'lucide-react'

const StatCard = ({ icon, label, value, trend, color }) => (
  <motion.div 
    className="stat-card glass-effect"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className={`icon-box ${color}`}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
    {trend && (
      <div className="trend">
        <TrendingUp size={14} />
        <span>{trend}</span>
      </div>
    )}
  </motion.div>
)

const Dashboard = () => {
  const stats = [
    { icon: <Activity />, label: 'Active Requests', value: '1,284', trend: '+12%', color: 'purple' },
    { icon: <Users />, label: 'Total Users', value: '42', color: 'blue' },
    { icon: <Database />, label: 'Resources', value: '156', trend: '+5%', color: 'pink' },
    { icon: <ShieldCheck />, label: 'Credentials', value: '89', color: 'green' },
  ]

  const recentEvents = [
    { id: 1, type: 'critical', message: 'API limit reached for Resource: AWS_S3', time: '2 mins ago' },
    { id: 2, type: 'info', message: 'New user "jdoe" registered', time: '15 mins ago' },
    { id: 3, type: 'success', message: 'Resource "Webhook_Alpha" updated successfully', time: '1 hour ago' },
    { id: 4, type: 'warning', message: 'Failed login attempt from IP 192.168.1.1', time: '3 hours ago' },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <h1>System Overview</h1>
        <p>Real-time monitoring and integration status</p>
      </motion.div>

      <motion.div 
        className="stats-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      <div className="dashboard-content">
        <motion.div 
          className="main-chart glass-effect"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="chart-header">
            <h3>Request Analytics</h3>
            <div className="chart-legend">
              <span className="dot purple"></span> Success
              <span className="dot blue"></span> Error
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bar-container">
              {[60, 80, 40, 90, 70, 50, 85, 95, 65, 45].map((h, i) => (
                <motion.div 
                  key={i} 
                  className="chart-bar" 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                ></motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="recent-activity glass-effect"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="activity-header">
            <h3>Recent Activity</h3>
            <button className="text-link">View All</button>
          </div>
          <div className="activity-list">
            {recentEvents.map((event) => (
              <div key={event.id} className="activity-item">
                <div className={`activity-status status-${event.type}`}></div>
                <div className="activity-details">
                  <p>{event.message}</p>
                  <span>{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .dashboard-header {
          margin-bottom: var(--space-xl);
        }
        .dashboard-header h1 {
          font-size: 2.25rem;
          margin-bottom: 0.25rem;
        }
        .dashboard-header p {
          color: var(--text-secondary);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }
        .stat-card {
          padding: var(--space-lg);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-box.purple { background: rgba(126, 34, 206, 0.1); color: var(--brand-primary); }
        .icon-box.blue { background: rgba(14, 165, 233, 0.1); color: var(--brand-secondary); }
        .icon-box.pink { background: rgba(219, 39, 119, 0.1); color: var(--brand-accent); }
        .icon-box.green { background: rgba(34, 197, 94, 0.1); color: var(--success); }
        
        .stat-info h3 { font-size: 1.5rem; }
        .stat-info p { color: var(--text-muted); font-size: 0.875rem; }
        
        .trend {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-md);
        }
        .main-chart {
          padding: var(--space-lg);
          border-radius: var(--radius-md);
          min-height: 400px;
          display: flex;
          flex-direction: column;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-xl);
        }
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 0.25rem;
          margin-left: 1rem;
        }
        .dot.purple { background: var(--brand-primary); }
        .dot.blue { background: var(--brand-secondary); }
        
        .chart-placeholder {
          flex: 1;
          display: flex;
          align-items: flex-end;
          padding-top: var(--space-xl);
          position: relative;
        }
        .chart-bar-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .chart-bar {
          flex: 1;
          background: linear-gradient(to top, var(--brand-primary), var(--brand-secondary));
          border-radius: 4px 4px 0 0;
          opacity: 0.7;
        }
        .chart-bar:hover {
          opacity: 1;
        }
        
        .recent-activity {
          padding: var(--space-lg);
          border-radius: var(--radius-md);
        }
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }
        .text-link {
          background: transparent;
          border: none;
          font-size: 0.875rem;
          color: var(--brand-primary);
          cursor: pointer;
          font-weight: 500;
        }
        .activity-item {
          display: flex;
          gap: var(--space-md);
          padding: 1rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .activity-status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 0.5rem;
          flex-shrink: 0;
        }
        .status-critical { background: var(--error); box-shadow: 0 0 10px var(--error); }
        .status-success { background: var(--success); }
        .status-info { background: var(--brand-secondary); }
        .status-warning { background: var(--warning); }
        
        .activity-details p { font-size: 0.875rem; margin-bottom: 0.25rem; }
        .activity-details span { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  )
}

export default Dashboard
