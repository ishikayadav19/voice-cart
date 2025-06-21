"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import axios from "axios"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import SectionHeading from "@/app/components/SectionHeading"

const OrdersPage = () => {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken")
      if (!token) {
        toast.error("Please login to access orders")
        router.push("/seller/login")
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order/seller/myorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setOrders(response.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("sellerToken")
        sessionStorage.removeItem("sellerToken")
        toast.error("Session expired. Please login again.")
        router.push("/seller/login")
      } else {
        toast.error("Failed to load orders")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, itemId, newStatus) => {
    // Optimistic update: update local state immediately
    setOrders(prevOrders => prevOrders.map(order => {
      if (order._id !== orderId) return order;
      return {
        ...order,
        items: order.items.map(item =>
          (item._id === itemId ? { ...item, status: newStatus } : item)
        )
      };
    }));
    try {
      const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/order/seller/orderitem/${orderId}/${itemId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Order item status updated successfully");
      fetchOrders(); // Optionally re-sync with backend
    } catch (error) {
      // Revert optimistic update on error
      setOrders(prevOrders => prevOrders.map(order => {
        if (order._id !== orderId) return order;
        return {
          ...order,
          items: order.items.map(item =>
            (item._id === itemId ? { ...item, status: item.status } : item)
          )
        };
      }));
      toast.error("Failed to update order item status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Improved aggregate status function
  const getOrderAggregateStatus = (order) => {
    if (!order.items || order.items.length === 0) return 'pending';
    if (order.items.length === 1) return order.items[0].status || 'pending';
    // Priority: pending > shipped > delivered > cancelled
    if (order.items.some(i => (i.status || 'pending') === 'pending')) return 'pending';
    if (order.items.some(i => i.status === 'shipped')) return 'shipped';
    if (order.items.every(i => i.status === 'delivered')) return 'delivered';
    if (order.items.every(i => i.status === 'cancelled')) return 'cancelled';
    if (order.items.some(i => i.status === 'delivered')) return 'delivered';
    return order.items[0].status || 'pending';
  };

  const filteredOrders = orders
    .filter((order) => {
      const search = searchQuery.toLowerCase();
      const matchesOrderId = order._id.toLowerCase().includes(search);
      const matchesCustomer = order.customerName.toLowerCase().includes(search);
      const matchesProduct = order.items.some(item => item.name.toLowerCase().includes(search));
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return (matchesOrderId || matchesCustomer || matchesProduct) && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1
    })

  // Define possible statuses for seller to select
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-8 mt-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <SectionHeading
              title="Order Management"
              subtitle="Track and manage your customer orders"
              colors={["#E11D48", "#7C3AED", "#E11D48"]}
              animationSpeed={3}
              className="text-3xl font-bold text-center"
              align="center"
            />
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search orders by ID or customer name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(getOrderAggregateStatus(order))}`}
                            >
                              {getOrderAggregateStatus(order)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => router.push(`/seller/orders/${order._id}`)}
                              className="text-rose-600 hover:text-rose-900 mr-4 transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="h-5 w-5" />
                            </motion.button>
                            {/* Per-item actions */}
                            {order.items.map((item, idx) => (
                              <span key={item._id || idx} className="inline-flex items-center gap-2 ml-2">
                                <span className="text-xs text-gray-500">{item.name} x{item.quantity}</span>
                                <select
                                  value={item.status}
                                  onChange={e => handleStatusUpdate(order._id, item._id, e.target.value)}
                                  className="ml-2 px-2 py-1 border rounded text-xs"
                                  style={{ minWidth: 90 }}
                                >
                                  {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                                <span className={`ml-1 text-xs ${item.status === 'shipped' ? 'text-green-600' : item.status === 'delivered' ? 'text-green-700' : item.status === 'cancelled' ? 'text-red-600' : 'text-gray-500'}`}>{item.status}</span>
                              </span>
                            ))}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrdersPage 