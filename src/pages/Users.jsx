import { useState, useEffect } from 'react'
import ManagementPage from '../components/ManagementPage'
import { userService } from '../services/dataServices'

const Users = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = ['ID', 'Name', 'Email', 'Role', 'Status']

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll()
        if (response.data.success) {
          setData(response.data.data.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status || 'Active'
          })))
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load users. Please ensure the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <ManagementPage 
      title="User Management" 
      subtitle="Manage system users and their access roles"
      columns={columns}
      data={data}
      loading={loading}
      error={error}
    />
  )
}

export default Users
