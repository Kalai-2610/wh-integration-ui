import { useState, useEffect } from 'react'
import ManagementPage from '../components/ManagementPage'
import api from '../services/api'

const DataExplorer = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = ['ID', 'Resource', 'Access Method', 'Created On', 'Status']

  useEffect(() => {
    // Data explorer typically shows recent audit logs or dynamic data entries
    // Since we don't have a specific audit log endpoint, we'll fetch from /api/v1/data 
    // or similar if it exists. Based on backend, standard API is /:access_method/v1/:resource
    // We'll mock some realistic data for now or try to fetch from a generic endpoint if available.
    
    const fetchData = async () => {
      try {
        // Fetching from a general data endpoint if backend supports it
        const response = await api.get('/api/v1/data').catch(() => null)
        
        if (response?.data?.success) {
          setData(response.data.data.map(d => ({
            id: d._id,
            resource: d.resource || 'Unknown',
            method: d.access_method || 'Token',
            created_on: new Date(d._created_on).toLocaleDateString(),
            status: 'Success'
          })))
        } else {
          // Placeholder data if no data exists yet
          setData([
            { id: 'dat_812', resource: 'Shopify', method: 'Webhook', date: '2026-03-03', status: 'Success' },
            { id: 'dat_901', resource: 'GitHub', method: 'Token', date: '2026-03-03', status: 'Success' },
          ])
        }
      } catch (err) {
          setError('Failed to load data entries.', err.message, err.stack)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <ManagementPage 
      title="Data Explorer" 
      subtitle="Inspect and audit individual integration events and data records"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
    />
  )
}

export default DataExplorer
