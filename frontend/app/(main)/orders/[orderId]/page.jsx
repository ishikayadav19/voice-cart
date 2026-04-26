'use client'
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";
import SectionHeading from "@/app/components/SectionHeading";

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { orderId } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
      if (!token) {
        router.push("/user/login");
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = (res.data || []).find(o => o._id === orderId);
        if (!found) {
          setError("Order not found or access denied.");
        } else {
          setOrder(found);
        }
      } catch (err) {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId, router]);

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

  // Helper to get tracking message based on status
  const getTrackingMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your order is pending and will be processed soon.';
      case 'shipped':
        return 'Your order has been shipped!';
      case 'delivered':
        return 'Order delivered. Thank you for shopping!';
      case 'cancelled':
        return 'Order was cancelled.';
      default:
        return 'Order is being processed.';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white border border-[#E5E0D8] p-8 rounded-xl shadow-lg">
          <SectionHeading
            title="Order Details"
            subtitle={order ? `Order #${order.orderNumber}` : ""}
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={3}
            className="text-2xl font-bold mb-2"
          />
          {loading ? (
            <div className="text-center text-[#5C5C5C]">Loading order details...</div>
          ) : error ? (
            <div className="text-center text-[#E11D48]">{error}</div>
          ) : order ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div className="font-semibold text-[#1A1A1A]">Order Date: {new Date(order.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-[#7A7571]">Status: <span className="font-medium">{getOrderAggregateStatus(order)}</span></div>
                  <div className="text-sm text-[#7A7571]">Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "TBD"}</div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <div className="text-lg font-bold text-[#D4AF37]">₹{order.totalAmount}</div>
                  <div className="text-xs text-[#7A7571]">{order.items.length} item(s)</div>
                </div>
              </div>
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <div className="font-medium text-[#1A1A1A] mb-2">Shipping Address</div>
                <div className="text-sm text-[#5C5C5C]">{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</div>
              </div>
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <div className="font-medium text-[#1A1A1A] mb-2">Payment Method</div>
                <div className="text-sm text-[#5C5C5C]">{order.paymentMethod}</div>
              </div>
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <div className="font-medium text-[#1A1A1A] mb-2">Order Items</div>
                <ul className="ml-4 list-disc text-sm text-[#5C5C5C]">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x{item.quantity} @ ₹{item.price} —
                      <span className="font-semibold text-[#1A1A1A]">
                        {item.status ? item.status : order.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tracking Section */}
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg p-4">
                <div className="font-medium text-[#1A1A1A] mb-2">Order Tracking</div>
                <div className="text-sm text-[#5C5C5C]">
                  {getTrackingMessage(getOrderAggregateStatus(order))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailsPage; 