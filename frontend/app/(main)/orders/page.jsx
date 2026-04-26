"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import SectionHeading from "@/app/components/SectionHeading";

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
      if (!token) {
        router.push("/user/login");
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white border border-[#E5E0D8] p-8 rounded-xl shadow-lg">
          <SectionHeading
            title="Your Orders"
            subtitle={orders.length > 0 ? `You have ${orders.length} order(s)` : "No orders found"}
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={2}
            className="text-2xl font-bold mb-2"
          />
          {loading ? (
            <div className="text-center text-[#5C5C5C]">Loading orders...</div>
          ) : orders.length > 0 ? (
            <div className="divide-y divide-[#E5E0D8] mt-4">
              {orders.map((order) => (
                <div key={order._id || order.orderNumber} className="py-4 flex flex-wrap justify-between items-center">
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Order #{order.orderNumber}</div>
                    <div className="text-sm text-[#7A7571]">Order Date: {new Date(order.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-[#7A7571]">Status: <span className="font-medium">{order.status}</span></div>
                    <div className="text-sm text-[#5C5C5C]">Total: <span className="font-bold text-[#D4AF37]">₹{order.totalAmount}</span></div>
                  </div>
                  <button
                    onClick={() => router.push(`/orders/${order._id}`)}
                    className="mt-2 md:mt-0 px-4 py-2 bg-[#1A1A1A] text-white rounded-md hover:bg-[#D4AF37] transition-colors tracking-wider"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#7A7571] mt-4">No orders found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage; 