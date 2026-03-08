import { useState, useEffect } from 'react'
import ManagementPage from '../components/ManagementPage'
import ResourceModal from '../components/ResourceModal'
import { resourceService } from '../services/dataServices'
import { formatDate } from '../utils/dateUtils'

const authMethodLabels = {
  open: 'Open',
  basic: 'Basic',
  api_key: 'API Key',
  token: 'Token',
  oauth2: 'OAuth 2.0'
}

const Resources = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedResource, setSelectedResource] = useState(null)
  
  // Pagination & Sort State
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 })
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'asc' })

  const columns = [
    { label: 'Name', sortKey: 'name' },
    { label: 'API Path', sortKey: 'api_path' },
    { label: 'Methods', sortKey: null },
    { label: 'Ref Name', sortKey: 'reference_name' },
    { label: 'Updated By', sortKey: null },
    { label: 'Updated On', sortKey: '_updated_on' }
  ]

  const fetchResources = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        ...(searchTerm ? { name: searchTerm } : {})
      }
      
      const response = await resourceService.getAll(params)
      
      if (response.data.success) {
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            page: response.data.pagination.page,
            size: response.data.pagination.size
          }))
        }

        setData(response.data.data.map(r => ({
          _id: r._id,
          name: r.name,
          api_path: r.api_path,
          methods: (r.allowed_auth_methods || [])
            .map(m => authMethodLabels[m] || m)
            .join(', '),
          ref_name: r.reference_name,
          updated_by: r._updatedBy?.name || r._updatedBy?.email || 'System',
          updated_on: formatDate(r._updated_on),
          _original: r // Store original object for editing
        })))
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  useEffect(() => {
    fetchResources()
  }, [pagination.page, pagination.size, sort.sortBy, sort.sortOrder, searchTerm])

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, size: newSize, page: 1 }))
  }

  const handleSortChange = (sortBy, sortOrder) => {
    setSort({ sortBy, sortOrder })
  }

  const handleAdd = () => {
    setSelectedResource(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleEdit = (resource) => {
    setSelectedResource(resource)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleDelete = async (resource) => {
    if (window.confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      try {
        await resourceService.delete(resource._id)
        fetchResources()
      } catch (err) {
        alert('Failed to delete resource.')
      }
    }
  }

  const handleSave = async (formData) => {
    if (modalMode === 'create') {
      await resourceService.create(formData)
    } else {
      await resourceService.update(selectedResource._id, formData)
    }
    setIsModalOpen(false)
    fetchResources()
  }

  return (
    <>
      <ManagementPage 
        title="Resources" 
        subtitle="Configure and monitor integration endpoints"
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
        sort={sort}
        onSortChange={handleSortChange}
      />
      
      <ResourceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        resource={selectedResource}
        mode={modalMode}
      />
    </>
  )
}

export default Resources
