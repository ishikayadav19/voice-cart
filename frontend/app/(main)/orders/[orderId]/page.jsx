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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
          <SectionHeading
            title="Order Details"
            subtitle={order ? `Order #${order.orderNumber}` : ""}
            colors={["#E11D48", "#7C3AED", "#E11D48"]}
            animationSpeed={3}
            className="text-2xl font-bold mb-2"
          />
          {loading ? (
            <div className="text-center text-gray-600">Loading order details...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : order ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div className="font-semibold text-gray-800">Order Date: {new Date(order.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Status: <span className="font-medium">{order.status}</span></div>
                  <div className="text-sm text-gray-500">Delivery Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "TBD"}</div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <div className="text-lg font-bold text-rose-600">₹{order.totalAmount}</div>
                  <div className="text-xs text-gray-400">{order.items.length} item(s)</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2">Shipping Address</div>
                <div className="text-sm text-gray-600">{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2">Payment Method</div>
                <div className="text-sm text-gray-600">{order.paymentMethod}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2">Order Items</div>
                <ul className="ml-4 list-disc text-sm">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x{item.quantity} @ ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tracking Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2">Order Tracking</div>
                <div className="text-sm text-gray-600">
                  {/* Simple tracking logic based on status */}
                  {order.status === 'pending' && 'Your order is pending and will be processed soon.'}
                  {order.status === 'completed' && 'Your payment is confirmed. Preparing for shipment.'}
                  {order.status === 'shipped' && 'Your order has been shipped!'}
                  {order.status === 'delivered' && 'Order delivered. Thank you for shopping!'}
                  {order.status === 'cancelled' && 'Order was cancelled.'}
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