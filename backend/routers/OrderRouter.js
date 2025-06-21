const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sendOrderConfirmationEmail } = require('../services/emailService');
const Razorpay = require('razorpay'); // Import Razorpay
const Order = require('../models/OrderModel'); // Import the Order model
const crypto = require('crypto'); // Import crypto for signature verification
const Product = require('../models/ProductModels'); // Import the Product model
const Seller = require('../models/SellerModels');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order with Razorpay
router.post('/create', async (req, res) => {
  try {
    const {
      customerName,
      email,
      items,
      totalAmount, // Assuming this is in your currency's base unit (e.g., INR)
      shippingAddress,
      paymentMethod
    } = req.body;

    // Enrich items with productId and sellerId
    const enrichedItems = await Promise.all(items.map(async (item) => {
      // item should have productId
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return {
        productId: product._id,
        sellerId: product.seller,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        status: 'pending'
      };
    }));

    // Generate a unique order number
    const orderNumber = 'ORD' + Date.now().toString().slice(-8);

    // Create order in your database with pending status
    const newOrder = new Order({
        customerName,
        email,
        items: enrichedItems,
        totalAmount,
        shippingAddress,
        paymentMethod,
        orderNumber,
        status: 'pending'
    });
    await newOrder.save();

    // Create order with Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in the smallest currency unit (e.g., paise)
      currency: 'INR', // Replace with your currency code
      receipt: orderNumber, // Your internal order ID
      notes: { // Optional notes
        customerName: customerName,
        email: email
      }
    });

    // Update the order in your database with Razorpay Order ID
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    // Send Razorpay order details to frontend
    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      orderId: razorpayOrder.id, // Send Razorpay order ID to frontend
      amount: razorpayOrder.amount, // Amount in paise
      currency: razorpayOrder.currency,
      orderNumber: orderNumber // Send your internal order number too
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Razorpay order',
      error: error.message
    });
  }
});

// --- New route to handle Razorpay payment verification and send email ---
router.post('/verify-payment', async (req, res) => {
    console.log('Received request to /api/orders/verify-payment');
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderNumber // Assuming frontend sends this back
        } = req.body;

        console.log('Verification request body:', req.body);

        // Retrieve the order from your database using the Razorpay Order ID
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

        console.log('Retrieved order from DB:', order);

        if (!order) {
            console.error('Order not found in database for verification.', { razorpay_order_id });
            return res.status(404).json({ success: false, message: 'Order not found in database.' });
        }

        // Verify the payment signature
        console.log('Verifying signature using:', {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            razorpay_key_secret: process.env.RAZORPAY_KEY_SECRET ? '*****' : 'Not set' // Log key secret status safely
        });
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        console.log('Calculated digest:', digest);
        console.log('Received signature:', razorpay_signature);

        if (digest === razorpay_signature) {
            // Payment is successful and signature verified
            console.log('Payment signature verified successfully.');

            // Update order status in your database to 'completed'
            order.status = 'completed';
            order.razorpayPaymentId = razorpay_payment_id;
            order.razorpaySignature = razorpay_signature;
            await order.save();

            // Now send the order confirmation email
            // Use the data from the database order document
            const orderDetailsForEmail = {
                orderId: order.orderNumber, // Use your internal order number
                totalAmount: order.totalAmount,
                // Add other details needed for the email template from the order object
                // customerName: order.customerName,
                // items: order.items,
                // shippingAddress: order.shippingAddress
            };
            await sendOrderConfirmationEmail(order.email, orderDetailsForEmail);

            res.status(200).json({ success: true, message: 'Payment verified and email sent.', orderId: order.orderNumber });
        } else {
            // Payment verification failed
            console.log('Payment signature verification failed.');
            // Update order status in your database to 'failed'
            order.status = 'failed';
            order.razorpayPaymentId = razorpay_payment_id; // Still save payment ID even on failure if needed
            order.razorpaySignature = razorpay_signature;
            await order.save();

            res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }

    } catch (error) {
        console.error('Error verifying payment or sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment or sending email.',
            error: error.message
        });
    }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Secure endpoint: get orders for logged-in user only
router.get('/myorders', authMiddleware, async (req, res) => {
  try {
    const email = req.user.email;
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get all orders for a user by email
router.get('/getbyemail/:email', async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Cancel an order (user)
router.put('/cancel/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const email = req.user.email;
    // Find the order by _id and email (ownership)
    const order = await Order.findOne({ _id: orderId, email });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }
    order.status = 'cancelled';
    await order.save();
    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

// Seller auth middleware
const sellerAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all orders for the logged-in seller
router.get('/seller/myorders', sellerAuth, async (req, res) => {
  try {
    const sellerId = req.seller.id;
    // Find all orders that have at least one item for this seller
    const orders = await Order.find({ 'items.sellerId': sellerId }).sort({ createdAt: -1 });
    // For each order, filter items to only those belonging to this seller
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId);
      return sellerItems.length > 0 ? { ...order.toObject(), items: sellerItems } : null;
    }).filter(Boolean);
    res.status(200).json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seller orders' });
  }
});

// Update status of a seller's own order item
router.put('/seller/orderitem/:orderId/:itemId', sellerAuth, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['pending', 'completed', 'failed', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    if (item.sellerId.toString() !== req.seller.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    item.status = status;
    await order.save();
    console.log('Updated order item status:', order.items.map(i => ({ id: i._id, status: i.status })));
    res.status(200).json({ message: 'Order item status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order item status' });
  }
});

module.exports = router; 