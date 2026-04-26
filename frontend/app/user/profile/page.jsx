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

import { useAuth } from '@/context/AuthContext';

const UserProfilePage = () => {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
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
  const { setCart } = useShop();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/user/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      setEditData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
      });
      fetchOrders();
    }
  }, [user, profile, authLoading, router]);

  const handleLogoutKeepCart = async () => {
    await signOut();
  };

  const handleLogoutAndClearCart = async () => {
    if (profile?.email) {
      localStorage.removeItem(`cart_${profile.email}`);
    }
    setCart([]);
    await signOut();
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
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        name: editData.name,
        phone: editData.phone,
        city: editData.city
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profile updated successfully");
      setEditMode(false);
      
      // Update local storage so the auth context picks up the new details
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      window.location.reload(); // Quick way to sync profile for now
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    if (!user) {
      toast.error('You must be logged in to cancel orders.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/order/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Order cancelled successfully');
      // Update the order status in the UI
      setOrders((prevOrders) => prevOrders.map(order =>
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleViewOrderDetails = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  // Helper to get aggregate status for order items
  const getOrderAggregateStatus = (order) => {
    if (!order.items || order.items.length === 0) return order.status || 'pending';
    return order.status || 'pending'; // In the new schema, order status is the source of truth for the whole order
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-[#E5E0D8] relative">
          {(authLoading || loading) ? (
            <div className="text-center text-[#5C5C5C]">Loading profile...</div>
          ) : profile ? (
            <>
              <div className="mb-8">
                <SectionHeading
                  title="Your Profile"
                  subtitle={`Welcome back, ${profile.name}!`}
                  colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
                  animationSpeed={3}
                  className="text-3xl font-serif text-[#1A1A1A] mb-2"
                />
              </div>
              <div className="absolute top-8 right-8 flex gap-2">
                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-1 text-[#D4AF37] hover:text-[#C5A030] focus:outline-none"
                  aria-label="Edit Profile"
                >
                  <Edit2 className="h-5 w-5" /> Edit
                </button>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-[#1A1A1A]">
                  <User className="h-5 w-5 mr-2 text-[#7A7571]" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2 text-[#5C5C5C]">{profile.name}</span>
                </div>
                <div className="flex items-center text-[#1A1A1A]">
                  <Mail className="h-5 w-5 mr-2 text-[#7A7571]" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-[#5C5C5C]">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center text-[#1A1A1A]">
                    <Phone className="h-5 w-5 mr-2 text-[#7A7571]" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2 text-[#5C5C5C]">{profile.phone}</span>
                  </div>
                )}
                {profile.city && (
                  <div className="flex items-center text-[#1A1A1A]">
                    <MapPin className="h-5 w-5 mr-2 text-[#7A7571]" />
                    <span className="font-medium">City:</span>
                    <span className="ml-2 text-[#5C5C5C]">{profile.city}</span>
                  </div>
                )}
                {profile.created_at && (
                  <div className="flex items-center text-[#1A1A1A]">
                    <span className="font-medium">Joined:</span>
                    <span className="ml-2 text-[#5C5C5C]">{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center text-[#1A1A1A]">
                  <span className="font-medium">Wishlist Items:</span>
                  <span className="ml-2 text-[#5C5C5C]">0</span>
                </div>
              </div>
              {/* Logout Button with Modal */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="mb-8 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1A1A1A] hover:bg-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] font-semibold tracking-wider transition-colors"
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
                    <AlertDialogCancel className="border-[#E5E0D8]">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogoutKeepCart} className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white transition-colors">Logout (Keep Cart)</AlertDialogAction>
                    <AlertDialogAction onClick={handleLogoutAndClearCart} className="bg-[#FAF9F6] hover:bg-[#E5E0D8] text-[#1A1A1A] border border-[#E5E0D8] transition-colors">Logout & Clear Cart</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* Orders Section */}
              <div className="mt-8">
                <SectionHeading
                  title="Your Orders"
                  subtitle={orders.length > 0 ? `You have ${orders.length} order(s)` : "No orders found"}
                  colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
                  animationSpeed={2}
                  className="text-2xl font-serif text-[#1A1A1A] mb-2"
                />
                {orders.length > 0 ? (
                  <div className="divide-y divide-[#E5E0D8] mt-4 border-t border-[#E5E0D8] pt-4">
                    {orders.map((order) => (
                      <div key={order._id || order.orderNumber} className="py-4">
                        <div className="flex flex-wrap justify-between items-center">
                          <div>
                            <div className="font-serif font-semibold text-[#1A1A1A]">Order #{order.orderNumber}</div>
                            <div className="text-sm text-[#5C5C5C]">Order Date: {new Date(order.createdAt).toLocaleString()}</div>
                            <div className="text-sm text-[#5C5C5C]">Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "TBD"}</div>
                            <div className="text-sm text-[#5C5C5C]">Status: <span className="font-medium text-[#D4AF37]">{getOrderAggregateStatus(order)}</span></div>
                            <div className="text-sm text-[#5C5C5C]">Payment: <span className="font-medium text-[#1A1A1A]">{order.paymentMethod}</span></div>
                            <div className="text-sm text-[#5C5C5C]">Shipping: {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</div>
                            <div className="mt-2">
                              <span className="font-medium">Items:</span>
                              <ul className="ml-4 list-disc text-sm">
                                {order.items?.map((item, idx) => (
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
                                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A030] text-white rounded shadow text-sm transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}
                              {/* View Details Button */}
                              <button
                                onClick={() => handleViewOrderDetails(order._id)}
                                  className="px-4 py-2 bg-white border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors rounded shadow text-sm"
                              >
                                View Details
                              </button>
                              {order.status === 'cancelled' && (
                                <div className="text-rose-600 font-semibold text-sm">Order Cancelled</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right mt-2 md:mt-0">
                            <div className="text-lg font-serif font-bold text-[#1A1A1A]">₹{order.totalAmount}</div>
                            <div className="text-xs text-[#5C5C5C]">{order.items?.length || 0} item(s)</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#5C5C5C] mt-4">No orders found.</div>
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
                      className="absolute top-2 right-2 text-[#7A7571] hover:text-[#1A1A1A]"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <h3 className="text-lg font-serif mb-4 text-[#1A1A1A]">Edit Profile</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A]">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border border-[#E5E0D8] px-3 py-2 shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A]">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border border-[#E5E0D8] px-3 py-2 shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-gray-100"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A]">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={editData.phone}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border border-[#E5E0D8] px-3 py-2 shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A]">City</label>
                        <input
                          type="text"
                          name="city"
                          value={editData.city}
                          onChange={handleEditChange}
                          className="mt-1 block w-full rounded-md border border-[#E5E0D8] px-3 py-2 shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1A1A1A] hover:bg-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] disabled:opacity-60 transition-colors"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-[#E11D48]">User data not found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
