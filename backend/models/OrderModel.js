const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Price per item
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderNumber: { // Your internal order ID
    type: String,
    unique: true, // Ensure unique order numbers
    required: true,
  },
  razorpayOrderId: { // Razorpay's Order ID
    type: String,
  },
  razorpayPaymentId: { // Razorpay's Payment ID (filled after successful payment)
    type: String,
  },
  razorpaySignature: { // Razorpay's Signature (for verification)
    type: String,
  },
  status: { // e.g., 'pending', 'completed', 'failed', 'shipped', 'delivered'
    type: String,
    enum: ['pending', 'completed', 'failed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 