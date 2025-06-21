"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { Mail, User, LogOut, Phone, Package, MapPin, Edit2, X } from "lucide-react";
import SectionHeading from "@/app/components/SectionHeading";
import { useShop } from '@/context/ShopContext'
import { ShopProvider } from '@/context/ShopContext'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const UserProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);
  const { setCart, userEmail } = useShop();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
      if (!token) {
        router.push('/user/login');
        return;
      }
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.user;
        if (userData && userData.id && !userData._id) {
          userData._id = userData.id;
        }
        setUser(userData);
        setEditData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          city: userData.city || "",
        });
        // Fetch orders for logged-in user securely
        const ordersRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersRes.data || []);
      } catch (error) {
        // If unauthorized or forbidden, clear token and redirect
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('usertoken');
          sessionStorage.removeItem('usertoken');
          router.push('/user/login');
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  const handleLogoutKeepCart = () => {
    localStorage.removeItem('usertoken');
    sessionStorage.removeItem('usertoken');
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleLogoutAndClearCart = () => {
    localStorage.removeItem('usertoken');
    sessionStorage.removeItem('usertoken');
    if (userEmail) {
      localStorage.removeItem(`cart_${userEmail}`);
    }
    setCart([]);
    toast.success("Logged out and cart cleared");
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem('usertoken');
    sessionStorage.removeItem('usertoken');
    localStorage.removeItem('sellerToken');
    sessionStorage.removeItem('sellerToken');
    router.push('/');
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
    if (!token) {
      toast.error('You must be logged in to cancel orders.');
      return;
    }
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/order/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order cancelled successfully');
      // Update the order status in the UI
      setOrders((prevOrders) => prevOrders.map(order =>
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleViewOrderDetails = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg relative">
          {loading ? (
            <div className="text-center text-gray-600">Loading profile...</div>
          ) : user ? (
            <>
              <div className="mb-8">
                <SectionHeading
                  title="Your Profile"
                  subtitle={`Welcome back, ${user.name}!`}
                  colors={["#E11D48", "#7C3AED", "#E11D48"]}
                  animationSpeed={3}
                  className="text-3xl font-bold mb-2"
                />
              </div>
              <div className="absolute top-8 right-8 flex gap-2">
                {/* <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-rose-600 text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                >
                  Logout
                </button> */}
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 focus:outline-none"
                  aria-label="Edit Profile"
                >
                  <Edit2 className="h-5 w-5" /> Edit
                </button>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{user.name}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{user.phone}</span>
                  </div>
                )}
                {user.city && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-medium">City:</span>
                    <span className="ml-2">{user.city}</span>
                  </div>
                )}
                {user.createdAt && (
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">Joined:</span>
                    <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">Wishlist Items:</span>
                  <span className="ml-2">{user.wishlist ? user.wishlist.length : 0}</span>
                </div>
              </div>
              {/* Logout Button with Modal */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="mb-8 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you want to keep your cart for your next login, or clear it?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogoutKeepCart} className="bg-rose-500 hover:bg-rose-600 text-white">Logout (Keep Cart)</AlertDialogAction>
                    <AlertDialogAction onClick={handleLogoutAndClearCart} className="bg-gray-200 hover:bg-gray-300 text-gray-800">Logout & Clear Cart</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* Orders Section */}
              <div className="mt-8">
                <SectionHeading
                  title="Your Orders"
                  subtitle={orders.length > 0 ? `You have ${orders.length} order(s)` : "No orders found"}
                  colors={["#7C3AED", "#E11D48", "#7C3AED"]}
                  animationSpeed={2}
                  className="text-2xl font-bold mb-2"
                />
                {orders.length > 0 ? (
                  <div className="divide-y divide-gray-200 mt-4">
                    {orders.map((order) => (
                      <div key={order._id || order.orderNumber} className="py-4">
                        <div className="flex flex-wrap justify-between items-center">
                          <div>
                            <div className="font-semibold text-gray-800">Order #{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">Order Date: {new Date(order.createdAt).toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "TBD"}</div>
                            <div className="text-sm text-gray-600">Status: <span className="font-medium">{getOrderAggregateStatus(order)}</span></div>
                            <div className="text-sm text-gray-600">Payment: <span className="font-medium">{order.paymentMethod}</span></div>
                            <div className="text-sm text-gray-600">Shipping: {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</div>
                            <div className="mt-2">
                              <span className="font-medium">Items:</span>
                              <ul className="ml-4 list-disc text-sm">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.name} x{item.quantity} @ ₹{item.price} — 
                                    <span className="font-semibold">
                                      {item.status ? item.status : order.status}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {/* Cancel Order Button */}
                              {(order.status !== 'delivered' && order.status !== 'cancelled') && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded shadow text-sm"
                                >
                                  Cancel Order
                                </button>
                              )}
                              {/* View Details Button */}
                              <button
                                onClick={() => handleViewOrderDetails(order._id)}
                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded shadow text-sm"
                              >
                                View Details
                              </button>
                              {order.status === 'cancelled' && (
                                <div className="text-rose-600 font-semibold text-sm">Order Cancelled</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right mt-2 md:mt-0">
                            <div className="text-lg font-bold text-rose-600">₹{order.totalAmount}</div>
                            <div className="text-xs text-gray-400">{order.items.length} item(s)</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-4">No orders found.</div>
                )}
              </div>
              {/* Edit Profile Modal */}
              {editMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <form
                    onSubmit={handleSaveProfile}
                    className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative animate-fadeIn"
                  >
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Profile</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={editData.phone}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          name="city"
                          value={editData.city}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-red-600">User data not found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
