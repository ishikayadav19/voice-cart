"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CreditCard, Lock, Truck, Shield, ArrowLeft, Wallet, QrCode, IndianRupee } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import { useShop } from '@/context/ShopContext'
import SectionHeading from '@/app/components/SectionHeading'
import axios from 'axios'

// Function to load Razorpay script
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const router = useRouter()
  const { cart, removeFromCart } = useShop()
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    // Card payment fields
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    // UPI fields
    upiId: "",
    // COD fields
    deliveryInstructions: ""
  })

  useEffect(() => {
    // Load Razorpay script when component mounts
    loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    setLoading(false)
  }, [])

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.discountPrice || item.price) * item.quantity
    }, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateShipping = () => {
    return calculateSubtotal() > 100 ? 0 : 10 // Free shipping over $100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }

    setLoading(true);

    // Prepare order details to send to backend
    const orderDetails = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.discountPrice || item.price
      })),
      totalAmount: paymentMethod === "cod" ? calculateTotal() + 30 : calculateTotal(),
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      paymentMethod
    };

    if (paymentMethod === 'cod') {
        // Handle Cash on Delivery logic (if any) and then potentially create order in backend with COD status
        // For now, we'll just call the backend create route for COD too for simplicity,
        // but in a real app, COD flow might differ significantly.
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`, orderDetails);
            if (response.data.success) {
                 // For COD, email might be sent immediately or on order fulfillment
                 // Depending on your backend logic, email might already be triggered by /api/orders/create for COD
                 // If not, you could add a specific email trigger here for COD if needed.

                cart.forEach(item => removeFromCart(item.id));
                router.push('/checkout/success');
            } else {
                 throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('COD order creation failed:', error);
            alert('There was an error processing your COD order. Please try again.');
        } finally {
            setLoading(false);
        }
        return;
    }

    // --- Razorpay Payment Integration ---
    try {
      // 1. Call backend to create Razorpay order
      const { data: { orderId, amount, currency } } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`, orderDetails);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID (Frontend Key)
        amount: amount, // Amount in paise
        currency: currency,
        order_id: orderId, // Razorpay Order ID from backend
        name: "Voice Cart", // Your company/product name
        description: "Order Payment",
        // image: '/your_logo.png', // Optional: Your logo URL
        handler: async function (response) {
          // This function is called after successful payment
          console.log('Razorpay payment response:', response);

          // 2. Call backend to verify payment and send email
          try {
            const verificationResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderNumber: orderId
            });

            if (verificationResponse.data.success) {
              console.log('Payment verified successfully by backend.');
              // Payment successful and email sent, clear cart and redirect
              cart.forEach(item => removeFromCart(item.id));
              router.push('/checkout/success');
            } else {
              console.error('Backend verification failed:', verificationResponse.data.message);
              alert('Payment successful, but verification failed. Please contact support.');
            }
          } catch (verificationError) {
            console.error('Error during backend verification:', verificationError);
            alert('An error occurred during payment verification. Please contact support.');
          }
        },
        prefill: { // Optional: Pre-fill user details
          name: orderDetails.customerName,
          email: orderDetails.email,
          contact: formData.phone // Assuming you have a phone field
        },
        notes: { // Optional notes
          address: orderDetails.shippingAddress.address
        },
        theme: { // Optional theme settings
          color: "#E11D48" // Your brand color
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Razorpay integration error:', error);
      alert('An error occurred during the payment process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethodForm = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                  maxLength="16"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent pl-10"
                />
                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  maxLength="3"
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )
      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <div className="relative">
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  required
                  placeholder="username@upi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent pl-10"
                />
                <QrCode className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                Pay using any UPI app like Google Pay, PhonePe, Paytm, etc.
              </p>
            </div>
          </div>
        )
      case "cod":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions (Optional)</label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                placeholder="Add any special instructions for delivery"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                rows="3"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                Pay with cash upon delivery. A small convenience fee of ₹30 will be added to your total.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Please add items to your cart before proceeding to checkout.</p>
            <button
              onClick={() => router.push('/products')}
              className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Checkout"
            subtitle="Complete your purchase"
            colors={["#E11D48", "#7C3AED", "#E11D48"]}
            animationSpeed={3}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                        paymentMethod === "card"
                          ? "border-rose-600 bg-rose-50"
                          : "border-gray-200 hover:border-rose-600"
                      }`}
                    >
                      <CreditCard className={`h-6 w-6 ${paymentMethod === "card" ? "text-rose-600" : "text-gray-600"}`} />
                      <span className={`text-sm font-medium ${paymentMethod === "card" ? "text-rose-600" : "text-gray-600"}`}>
                        Credit/Debit Card
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                        paymentMethod === "upi"
                          ? "border-rose-600 bg-rose-50"
                          : "border-gray-200 hover:border-rose-600"
                      }`}
                    >
                      <QrCode className={`h-6 w-6 ${paymentMethod === "upi" ? "text-rose-600" : "text-gray-600"}`} />
                      <span className={`text-sm font-medium ${paymentMethod === "upi" ? "text-rose-600" : "text-gray-600"}`}>
                        UPI
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
                        paymentMethod === "cod"
                          ? "border-rose-600 bg-rose-50"
                          : "border-gray-200 hover:border-rose-600"
                      }`}
                    >
                      <IndianRupee className={`h-6 w-6 ${paymentMethod === "cod" ? "text-rose-600" : "text-gray-600"}`} />
                      <span className={`text-sm font-medium ${paymentMethod === "cod" ? "text-rose-600" : "text-gray-600"}`}>
                        Cash on Delivery
                      </span>
                    </button>
                  </div>

                  {/* Payment Method Specific Form */}
                  {paymentMethod && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 pt-6"
                    >
                      {renderPaymentMethodForm()}
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-rose-600 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 text-white px-8 py-3 rounded-md hover:bg-rose-700 transition-colors flex items-center"
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Complete Purchase
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-rose-600">
                          ₹{(item.discountPrice || item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">₹{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {calculateShipping() === 0 ? "Free" : `₹${calculateShipping().toFixed(2)}`}
                    </span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">COD Fee</span>
                      <span className="font-medium">₹30.00</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-rose-600">
                        ₹{(paymentMethod === "cod" ? calculateTotal() + 30 : calculateTotal()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      <span>Protected</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CheckoutPage 