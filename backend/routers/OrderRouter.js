const express = require('express');
const router = express.Router();
const { sendOrderConfirmationEmail } = require('../services/emailService');
const Razorpay = require('razorpay'); // Import Razorpay
const Order = require('../models/OrderModel'); // Import the Order model
const crypto = require('crypto'); // Import crypto for signature verification

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

    // Generate a unique order number
    const orderNumber = 'ORD' + Date.now().toString().slice(-8);

    // Create order in your database with pending status
    const newOrder = new Order({
        customerName,
        email,
        items,
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

module.exports = router; 