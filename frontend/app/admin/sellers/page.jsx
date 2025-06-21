"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Store, Search, Trash2, UserX, UserCheck, Star, CheckCircle, XCircle, Clock } from 'lucide-react'
import SectionHeading from '@/app/components/SectionHeading'

const SellersPage = () => {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalSellers: 0,
    approvedSellers: 0,
    pendingSellers: 0
  })

  useEffect(() => {
    fetchSellers()
  }, [currentPage])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/sellers?page=${currentPage}`)
      if (!response.ok) {
         throw new Error('Failed to fetch sellers')
      }
      const data = await response.json()
      setSellers(data.sellers || [])
      setTotalPages(data.totalPages || 1)
      setStats({
        totalSellers: data.totalSellers || 0,
        approvedSellers: data.approvedSellers || 0,
        pendingSellers: data.pendingSellers || 0
      })
    } catch (error) {
      console.error('Error fetching sellers:', error)
      setError('Failed to load sellers. Please try again.')
      setSellers([])
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (sellerId, isApproved) => {
    try {
      const response = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
      })
      if (response.ok) {
        fetchSellers() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to update approval status')
      }
    } catch (error) {
      console.error('Error updating seller approval:', error)
      alert('Failed to update approval status')
    }
  }

  const handleDelete = async (sellerId) => {
    if (window.confirm('Are you sure you want to delete this seller? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/sellers/${sellerId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          // Show success message
          alert('Seller deleted successfully!')
          fetchSellers() // Refresh the list
        } else {
          const errorData = await response.json()
          alert(errorData.error || 'Failed to delete seller')
        }
      } catch (error) {
        console.error('Error deleting seller:', error)
        alert('Failed to delete seller. Please try again.')
      }
    }
  }

  // Filter sellers based on search query
  const filteredSellers = sellers.filter(seller =>
    seller.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.storeName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchSellers}
          className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Seller Management"
        subtitle="Manage your platform's sellers"
        colors={["#E11D48", "#7C3AED", "#E11D48"]}
        animationSpeed={3}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sellers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalSellers}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-10">
              <Store className="text-blue-500" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Approved Sellers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.approvedSellers}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Sellers</p>
              <h3 className="text-2xl font-bold mt-1">{stats.pendingSellers}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-10">
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Sellers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approval Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {filteredSellers && filteredSellers.length > 0 ? (
              filteredSellers.map((seller) => (
                <motion.tr
                  key={seller._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Store className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {seller.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.storeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      seller.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {seller.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {!seller.isApproved ? (
                        <>
                          <button
                            onClick={() => handleApproval(seller._id, true)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Approve Seller"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleApproval(seller._id, false)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Reject Seller"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-green-600 text-xs">Approved</span>
                      )}
                      <button
                        onClick={() => handleDelete(seller._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Seller"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchQuery ? 'No sellers found matching your search.' : 'No sellers found.'}
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
            className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default SellersPage 