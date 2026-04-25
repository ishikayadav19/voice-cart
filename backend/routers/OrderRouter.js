const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sendOrderConfirmationEmail } = require('../services/emailService');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../connection');
const ObjectId = require('bson-objectid');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create', async (req, res) => {
  try {
    const { customerName, email, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const orderNumber = 'ORD' + Date.now().toString().slice(-8);
    const orderId = new ObjectId().toString();

    const enrichedItems = [];
    for (const item of items) {
        const { data: product, error } = await supabase.from('productsdata').select('*').eq('id', item.productId).single();
        if (error || !product) throw new Error(`Product not found: ${item.productId}`);
        enrichedItems.push({
            id: new ObjectId().toString(),
            order_id: orderId,
            product_id: product.id,
            seller_id: product.seller,
            name: product.name,
            quantity: item.quantity,
            price: product.discount_price || product.price,
            status: 'pending'
        });
    }

    const newOrder = {
        id: orderId,
        customer_name: customerName,
        email,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        order_number: orderNumber,
        status: 'pending'
    };

    const { error: orderError } = await supabase.from('orders').insert([newOrder]);
    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from('order_items').insert(enrichedItems);
    if (itemsError) throw itemsError;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: orderNumber,
      notes: { customerName, email }
    });

    await supabase.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', orderId);

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: orderNumber
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Error creating Razorpay order', error: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = req.body;

        const { data: order, error } = await supabase.from('orders').select('*').eq('razorpay_order_id', razorpay_order_id).single();
        if (error || !order) return res.status(404).json({ success: false, message: 'Order not found in database.' });

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest === razorpay_signature) {
            await supabase.from('orders').update({
                status: 'completed',
                razorpay_payment_id,
                razorpay_signature
            }).eq('id', order.id);

            const orderDetailsForEmail = {
                orderId: order.order_number,
                totalAmount: order.total_amount,
            };
            await sendOrderConfirmationEmail(order.email, orderDetailsForEmail);
            res.status(200).json({ success: true, message: 'Payment verified and email sent.', orderId: order.order_number });
        } else {
            await supabase.from('orders').update({
                status: 'failed',
                razorpay_payment_id,
                razorpay_signature
            }).eq('id', order.id);
            res.status(400).json({ success: false, message: 'Payment verification failed.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error verifying payment or sending email.', error: error.message });
    }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const mapOrder = (o) => {
    return {
        _id: o.id,
        customerName: o.customer_name,
        email: o.email,
        totalAmount: o.total_amount,
        shippingAddress: o.shipping_address,
        paymentMethod: o.payment_method,
        orderNumber: o.order_number,
        razorpayOrderId: o.razorpay_order_id,
        razorpayPaymentId: o.razorpay_payment_id,
        razorpaySignature: o.razorpay_signature,
        status: o.status,
        deliveryDate: o.delivery_date,
        createdAt: o.created_at,
        items: (o.order_items || []).map(i => ({
            _id: i.id,
            productId: i.product_id,
            sellerId: i.seller_id,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            status: i.status
        }))
    };
};

router.get('/myorders', authMiddleware, async (req, res) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*, order_items(*)').eq('email', req.user.email).order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json((orders || []).map(mapOrder));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.get('/getbyemail/:email', async (req, res) => {
  try {
    const { data: orders, error } = await supabase.from('orders').select('*, order_items(*)').eq('email', req.params.email).order('created_at', { ascending: false });
    if (error) throw error;
    res.status(200).json((orders || []).map(mapOrder));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.put('/cancel/:orderId', authMiddleware, async (req, res) => {
  try {
    const { data: order, error } = await supabase.from('orders').select('*').match({ id: req.params.orderId, email: req.user.email }).single();
    if (error || !order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'delivered' || order.status === 'cancelled') return res.status(400).json({ message: 'Order cannot be cancelled' });
    
    const { data: updated, updateError } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id).select().single();
    res.status(200).json({ message: 'Order cancelled successfully', order: mapOrder({...updated, order_items:[]}) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

const sellerAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    req.seller = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/seller/myorders', sellerAuth, async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const { data: items, error } = await supabase.from('order_items').select('*, orders(*)').eq('seller_id', sellerId);
    if (error) throw error;
    
    const orderMap = new Map();
    items.forEach(item => {
        if (!item.orders) return;
        if (!orderMap.has(item.order_id)) {
            orderMap.set(item.order_id, { ...item.orders, order_items: [] });
        }
        orderMap.get(item.order_id).order_items.push(item);
    });
    
    const filteredOrders = Array.from(orderMap.values()).map(mapOrder).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seller orders' });
  }
});

router.put('/seller/orderitem/:orderId/:itemId', sellerAuth, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['pending', 'completed', 'failed', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const { data: item, error } = await supabase.from('order_items').update({ status }).match({ id: itemId, order_id: orderId, seller_id: req.seller.id }).select().single();
    if (error || !item) return res.status(404).json({ message: 'Order item not found or unauthorized' });
    
    res.status(200).json({ message: 'Order item status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order item status' });
  }
});

module.exports = router;