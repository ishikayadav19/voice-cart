import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { sendOrderConfirmationEmail } from '@/lib/emailService';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;

const authMiddleware = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('No token provided');
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'mytopsecretkey');
  } catch (err) {
    throw new Error('Invalid token');
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

export async function GET(request, { params }) {
  const path = params.path;
  const pathString = path.join('/');

  try {
    if (pathString === 'myorders') {
      const user = authMiddleware(request);
      const { data: orders, error } = await supabase.from('orders').select('*, order_items(*)').eq('email', user.email).order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json((orders || []).map(mapOrder));
    }

    if (path[0] === 'getbyemail' && path[1]) {
      const { data: orders, error } = await supabase.from('orders').select('*, order_items(*)').eq('email', path[1]).order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json((orders || []).map(mapOrder));
    }

    if (pathString === 'seller/myorders') {
      const seller = authMiddleware(request);
      const { data: items, error } = await supabase.from('order_items').select('*, orders(*)').eq('seller_id', seller.id);
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
      return NextResponse.json(filteredOrders);
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Order GET Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const pathString = params.path.join('/');
  
  try {
    const body = await request.json();

    if (pathString === 'create') {
      const { customerName, email, items, totalAmount, shippingAddress, paymentMethod } = body;
      const orderNumber = 'ORD' + Date.now().toString().slice(-8);
      const orderId = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

      const enrichedItems = [];
      for (const item of items) {
          const { data: product, error } = await supabase.from('productsdata').select('*').eq('id', item.productId).single();
          if (error || !product) throw new Error(`Product not found: ${item.productId}`);
          enrichedItems.push({
              id: [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
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

      if (!razorpay) throw new Error('Razorpay keys not configured');

      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: orderNumber,
        notes: { customerName, email }
      });

      await supabase.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', orderId);

      return NextResponse.json({
        success: true,
        message: 'Razorpay order created successfully',
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderNumber: orderNumber
      });
    }

    if (pathString === 'verify-payment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = body;

      const { data: order, error } = await supabase.from('orders').select('*').eq('razorpay_order_id', razorpay_order_id).single();
      if (error || !order) return NextResponse.json({ success: false, message: 'Order not found in database.' }, { status: 404 });

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
          return NextResponse.json({ success: true, message: 'Payment verified and email sent.', orderId: order.order_number });
      } else {
          await supabase.from('orders').update({
              status: 'failed',
              razorpay_payment_id,
              razorpay_signature
          }).eq('id', order.id);
          return NextResponse.json({ success: false, message: 'Payment verification failed.' }, { status: 400 });
      }
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Order POST Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const path = params.path;

  try {
    if (path[0] === 'cancel' && path[1]) {
      const user = authMiddleware(request);
      const { data: order, error } = await supabase.from('orders').select('*').match({ id: path[1], email: user.email }).single();
      if (error || !order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      if (order.status === 'delivered' || order.status === 'cancelled') return NextResponse.json({ message: 'Order cannot be cancelled' }, { status: 400 });
      
      const { data: updated } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id).select().single();
      return NextResponse.json({ message: 'Order cancelled successfully', order: mapOrder({...updated, order_items:[]}) });
    }

    if (path[0] === 'seller' && path[1] === 'orderitem' && path[2] && path[3]) {
      const seller = authMiddleware(request);
      const orderId = path[2];
      const itemId = path[3];
      const { status } = await request.json();
      const allowedStatuses = ['pending', 'completed', 'failed', 'shipped', 'delivered', 'cancelled'];
      if (!allowedStatuses.includes(status)) return NextResponse.json({ message: 'Invalid status' }, { status: 400 });

      const { data: item, error } = await supabase.from('order_items').update({ status }).match({ id: itemId, order_id: orderId, seller_id: seller.id }).select().single();
      if (error || !item) return NextResponse.json({ message: 'Order item not found or unauthorized' }, { status: 404 });
      
      return NextResponse.json({ message: 'Order item status updated' });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Order PUT Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
