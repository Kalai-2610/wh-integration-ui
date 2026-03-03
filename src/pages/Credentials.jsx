import { useState, useEffect } from 'react'
import ManagementPage from '../components/ManagementPage'
import { credentialService } from '../services/dataServices'

const Credentials = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = ['ID', 'App Name', 'Type', 'Environment', 'Created On']

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await credentialService.getAll()
        if (response.data.success) {
          setData(response.data.data.map(c => ({
            id: c._id,
            name: c.app_name,
            type: c.type,
            env: c.env,
            created_on: new Date(c._created_on).toLocaleDateString()
          })))
        }
      } catch (err) {
        setError('Failed to load credentials.')
      } finally {
        setLoading(false)
      }
    }

    fetchCredentials()
  }, [])

  return (
    <ManagementPage 
      title="Credentials" 
      subtitle="Manage security tokens and client secrets"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
    />
  )
}

export default Credentials
