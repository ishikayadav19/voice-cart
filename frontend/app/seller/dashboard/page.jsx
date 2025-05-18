"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import axios from "axios"
import toast from "react-hot-toast"
import SectionHeading from "@/app/components/SectionHeading"
import { motion, AnimatePresence } from "framer-motion"

const SellerDashboard = () => {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken")
        if (!token) {
          toast.error("Please login to access the dashboard")
          router.push("/seller/login")
          return
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.data) {
          setStats(response.data.stats)
          setRecentOrders(response.data.recentOrders)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        if (error.response?.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("sellerToken")
          sessionStorage.removeItem("sellerToken")
          toast.error("Session expired. Please login again.")
          router.push("/seller/login")
        } else {
          toast.error("Failed to load dashboard data")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const statCards = [
    {
      title: "Total Sales",
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-8 mt-8 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              title="Seller Dashboard"
              subtitle="Welcome back! Here's your store overview"
              colors={["#E11D48", "#7C3AED", "#E11D48"]}
              animationSpeed={3}
              className="text-3xl font-bold"
              align="left"
            />
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
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-semibold text-gray-800 mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`p-3 rounded-full ${stat.color} bg-opacity-10 text-${stat.color}`}
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
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/seller/orders")}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
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
                    <p className="text-gray-500">No recent orders</p>
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                          {recentOrders.map((order, index) => (
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
                                ${order.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
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
                        className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-all duration-300"
                      >
                        <action.icon className="h-5 w-5 mr-2" />
                        {action.text}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Health</h2>
                  <div className="space-y-4">
                    {[
                      { label: "Product Stock", value: "Good", color: "text-green-600" },
                      { label: "Order Fulfillment", value: "On Track", color: "text-green-600" },
                      { label: "Customer Satisfaction", value: "Needs Attention", color: "text-yellow-600" },
                      { label: "Store Rating", value: "4.5/5", color: "text-green-600" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-600">{item.label}</span>
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