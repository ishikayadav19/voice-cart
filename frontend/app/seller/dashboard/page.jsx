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
import SectionHeading from "../../components/section-heading"

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

        setStats(response.data.stats)
        setRecentOrders(response.data.recentOrders)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
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
      <main className="flex-1 p-6 mt-5 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SectionHeading
              title="Seller Dashboard"
              subtitle="Welcome back! Here's your store overview"
              colors={["#E11D48", "#7C3AED", "#E11D48"]}
              animationSpeed={3}
              className="text-3xl font-bold"
              align="left"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-semibold text-gray-800 mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-full ${stat.color} bg-opacity-10 text-${stat.color}`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                  <button
                    onClick={() => router.push("/seller/orders")}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                  >
                    View all orders
                  </button>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent orders</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
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
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => router.push("/seller/addproduct")}
                      className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Add Product
                    </button>
                    <button
                      onClick={() => router.push("/seller/orders")}
                      className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      View Orders
                    </button>
                    <button
                      onClick={() => router.push("/seller/products")}
                      className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Manage Products
                    </button>
                    <button
                      onClick={() => router.push("/seller/profile")}
                      className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-colors"
                    >
                      <Users className="h-5 w-5 mr-2" />
                      Profile Settings
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Health</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Product Stock</span>
                      <span className="text-green-600">Good</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Order Fulfillment</span>
                      <span className="text-green-600">On Track</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="text-yellow-600">Needs Attention</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Store Rating</span>
                      <span className="text-green-600">4.5/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default SellerDashboard 