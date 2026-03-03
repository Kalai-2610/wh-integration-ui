import { useState, useEffect } from 'react'
import ManagementPage from '../components/ManagementPage'
import { resourceService } from '../services/dataServices'

const Resources = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = ['ID', 'Resource Name', 'Endpoint', 'Created By', 'Created On']

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await resourceService.getAll()
        if (response.data.success) {
          setData(response.data.data.map(r => ({
            id: r._id,
            name: r.resource_name,
            endpoint: r.endpoint,
            created_by: r._created_by,
            created_on: new Date(r._created_on).toLocaleDateString()
          })))
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load resources.')
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  return (
    <ManagementPage 
      title="Resources" 
      subtitle="Configure and monitor integration endpoints"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
    />
  )
}

export default Resources
