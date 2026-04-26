"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  IndianRupee,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import axios from "axios"
import toast from "react-hot-toast"
import SectionHeading from "@/app/components/SectionHeading"
import { motion, AnimatePresence } from "framer-motion"

import { useAuth } from "@/context/AuthContext"

const SellerDashboard = () => {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return;

    if (!user || profile?.role !== 'seller') {
      toast.error("Please login as a seller to access the dashboard")
      router.push("/seller/login")
      return
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/seller/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setStats(response.data.stats || {
            totalSales: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalCustomers: 0,
          })
          const mappedOrders = (response.data.recentOrders || []).map(order => ({
            ...order,
            customerName: order.customer_name,
            totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: order.created_at
          }));
          setRecentOrders(mappedOrders)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, profile, authLoading, router])

  // statCards defines the dashboard stats and their display properties
  // Each card has a title, value, icon, and color
  const statCards = [
    {
      title: "Total Sales",
      value: `₹${stats.totalSales.toFixed(2)}`,
      icon: IndianRupee,
      color: "text-[#D4AF37] bg-[#D4AF37]/10",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-[#1A1A1A] bg-[#E5E0D8]",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-[#5C5C5C] bg-[#FAF9F6] border border-[#E5E0D8]",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-[#D4AF37] bg-[#D4AF37]/10",
    },
  ]

  // Helper to get aggregate status for order items
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

  // Helper to get color class for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#FCD34D]/20 text-[#D97706]';
      case 'shipped':
        return 'bg-[#D4AF37]/20 text-[#D4AF37]';
      case 'delivered':
        return 'bg-[#D4AF37]/20 text-[#D4AF37]';
      case 'cancelled':
        return 'bg-[#E11D48]/10 text-[#E11D48]';
      default:
        return 'bg-[#FAF9F6] text-[#5C5C5C] border border-[#E5E0D8]';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-8 mt-8 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            className="flex flex-col items-center justify-center mb-4"
          >
            <SectionHeading
              title="Seller Dashboard"
              subtitle="Welcome back! Here's your store overview"
              colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
              animationSpeed={3}
              className="text-4xl font-serif font-extrabold text-[#1A1A1A] text-center drop-shadow-lg"
              align="center"
            />
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </motion.div>
          ) : (
            <>
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {statCards.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm border border-[#E5E0D8] p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#5C5C5C]">{stat.title}</p>
                        <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`p-3 rounded-full ${stat.color}`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-[#E5E0D8] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">Recent Orders</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/seller/orders")}
                    className="text-[#D4AF37] hover:text-[#C5A030] text-sm font-medium transition-colors"
                  >
                    View all orders
                  </motion.button>
                </div>

                {recentOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <p className="text-[#5C5C5C]">No recent orders</p>
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#E5E0D8]">
                      <thead>
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-[#5C5C5C] uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#E5E0D8]">
                        <AnimatePresence>
                          {recentOrders.map((order, index) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="hover:bg-[#FAF9F6] transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1A1A1A]">
                                #{order.id.slice(-6)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5C5C5C]">
                                {order.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5C5C5C]">
                                ₹{order.totalAmount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5C5C5C]">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E0D8] p-6">
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Package, text: "Add Product", path: "/seller/addproduct" },
                      { icon: ShoppingCart, text: "View Orders", path: "/seller/orders" },
                      { icon: BarChart3, text: "Manage Products", path: "/seller/products" },
                      { icon: Users, text: "Profile Settings", path: "/seller/profile" },
                    ].map((action, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(action.path)}
                        className="flex items-center justify-center p-4 border border-[#E5E0D8] rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                      >
                        <action.icon className="h-5 w-5 mr-2" />
                        {action.text}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-[#E5E0D8] p-6">
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Store Health</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Product Stock", value: "Good", color: "text-[#D4AF37]" },
                      { label: "Order Fulfillment", value: "On Track", color: "text-[#D4AF37]" },
                      { label: "Customer Satisfaction", value: "Needs Attention", color: "text-[#E11D48]" },
                      { label: "Store Rating", value: "4.5/5", color: "text-[#D4AF37]" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[#5C5C5C]">{item.label}</span>
                        <span className={item.color}>{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default SellerDashboard 