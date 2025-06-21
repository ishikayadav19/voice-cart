"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, Trash2, Eye, Store, DollarSign, TrendingUp, User } from 'lucide-react'
import SectionHeading from '@/app/components/SectionHeading'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/products?page=${currentPage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data.products || [])
      setTotalPages(data.totalPages || 1)
      
      // Calculate stats
      const totalValue = data.products?.reduce((sum, product) => sum + (product.price * product.stock), 0) || 0
      const lowStockProducts = data.products?.filter(product => product.stock <= 5).length || 0
      
      setStats({
        totalProducts: data.totalProducts || 0,
        totalValue,
        lowStockProducts
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          alert('Product deleted successfully!')
          fetchProducts() // Refresh the list
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller?.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
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
          onClick={fetchProducts}
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
        title="Product Management"
        subtitle="Manage your platform's products"
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
              <p className="text-gray-500 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalProducts}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-10">
              <Package className="text-blue-500" size={24} />
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
              <p className="text-gray-500 text-sm">Total Inventory Value</p>
              <h3 className="text-2xl font-bold mt-1">₹{stats.totalValue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
              <DollarSign className="text-green-500" size={24} />
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
              <p className="text-gray-500 text-sm">Low Stock Products</p>
              <h3 className="text-2xl font-bold mt-1">{stats.lowStockProducts}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-500 bg-opacity-10">
              <TrendingUp className="text-red-500" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name, category, brand, or seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller Information
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price & Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 relative">
                        {product.mainImage ? (
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="h-16 w-16 rounded-md object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center" style={{ display: product.mainImage ? 'none' : 'flex' }}>
                          <Package className="h-8 w-8 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category} • {product.brand}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {product._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.seller ? (
                      <div className="flex items-center">
                        <Store className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.seller.name || 'Unknown Seller'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.seller.storeName || 'No Store Name'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {product.seller.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-sm">No Seller Assigned</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{product.price?.toFixed(2) || '0.00'}
                    </div>
                    {product.discountPrice && product.discountPrice < product.price && (
                      <div className="text-sm text-green-600">
                        ₹{product.discountPrice.toFixed(2)} (Discounted)
                      </div>
                    )}
                    <div className={`text-sm font-medium ${
                      product.stock <= 5 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      Stock: {product.stock || 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.stock <= 5 ? 'Low stock' : 'In stock'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      {product.featured && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => window.open(`/product/${product._id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Product"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Product"
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
                  {searchQuery ? 'No products found matching your search.' : 'No products found.'}
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

export default ProductsPage 