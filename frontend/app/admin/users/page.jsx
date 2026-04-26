"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Trash2, UserX, UserCheck, Mail, Calendar } from 'lucide-react'
import SectionHeading from '@/app/components/SectionHeading'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0
  })

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/users?page=${currentPage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
      setStats({
        totalUsers: data.totalUsers || 0,
        activeUsers: data.users?.filter(u => u.status !== 'suspended').length || 0,
        suspendedUsers: data.users?.filter(u => u.status === 'suspended').length || 0
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users. Please try again.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        alert(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`)
        fetchUsers() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Failed to update user status')
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          alert('User deleted successfully!')
          fetchUsers() // Refresh the list
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user. Please try again.')
      }
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-[#1A1A1A] text-white rounded-md hover:bg-[#D4AF37] transition-colors tracking-wider"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="User Management"
        subtitle="Manage your platform's users"
        colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
        animationSpeed={3}
        className="font-serif text-[#1A1A1A]"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md border border-[#E5E0D8] p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#5C5C5C] text-sm">Total Users</p>
              <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 rounded-full bg-[#D4AF37] bg-opacity-10">
              <Users className="text-[#D4AF37]" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md border border-[#E5E0D8] p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#5C5C5C] text-sm">Active Users</p>
              <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">{stats.activeUsers}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
              <UserCheck className="text-green-500" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md border border-[#E5E0D8] p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#5C5C5C] text-sm">Suspended Users</p>
              <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mt-1">{stats.suspendedUsers}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-500 bg-opacity-10">
              <UserX className="text-red-500" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#7A7571]" />
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-[#E5E0D8] overflow-hidden"
      >
        <table className="min-w-full divide-y divide-[#E5E0D8]">
          <thead className="bg-[#FAF9F6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E5E0D8]">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[#FAF9F6] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-6 w-6 text-[#7A7571]" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#1A1A1A]">
                          {user.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-[#7A7571] mr-2" />
                      <div className="text-sm text-[#1A1A1A]">{user.email}</div>
                    </div>
                    {user.phone && (
                      <div className="text-sm text-[#5C5C5C] mt-1">{user.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#1A1A1A]">{user.city || 'Not specified'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-[#7A7571] mr-2" />
                      <div className="text-sm text-[#5C5C5C]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'suspended' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.status === 'suspended' ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleStatusChange(user._id, user.status === 'suspended' ? 'active' : 'suspended')}
                        className={`p-1 rounded ${
                          user.status === 'suspended' 
                            ? 'text-green-600 hover:text-green-900' 
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        title={user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                      >
                        {user.status === 'suspended' ? (
                          <UserCheck size={16} />
                        ) : (
                          <UserX size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800 p-1 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-[#5C5C5C]">
                  {searchQuery ? 'No users found matching your search.' : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-[#E5E0D8] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAF9F6] transition-colors text-[#1A1A1A]"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-[#5C5C5C]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-[#E5E0D8] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FAF9F6] transition-colors text-[#1A1A1A]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default UsersPage 