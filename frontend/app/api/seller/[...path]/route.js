import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const authenticateSeller = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'mytopsecretkey');
  } catch (err) {
    throw new Error('Invalid token');
  }
};

export async function GET(request, { params }) {
  const path = params.path.join('/');
  
  try {
    if (path === 'getall') {
      const { data, error } = await supabase.from('sellersdata').select('*');
      if (error) throw error;
      return NextResponse.json(data);
    }
    
    if (path === 'profile') {
      const seller = authenticateSeller(request);
      const { data: sellerData, error } = await supabase.from('sellersdata').select('*').eq('id', seller.id).single();
      if (error || !sellerData) return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
      delete sellerData.password;
      delete sellerData.confirm_password;
      sellerData.storeName = sellerData.store_name;
      sellerData.role = "seller";
      return NextResponse.json(sellerData);
    }
    
    if (path === 'dashboard') {
      const seller = authenticateSeller(request);
      const sellerId = seller.id;
      
      const { data: products } = await supabase.from('productsdata').select('*').eq('seller', sellerId);
      const { data: orderItems } = await supabase.from('order_items').select('*, orders(*)').eq('seller_id', sellerId);

      let totalSales = 0;
      let totalOrders = 0;
      const customerEmails = new Set();
      const recentOrdersMap = new Map();

      (orderItems || []).forEach(item => {
        totalSales += item.price * item.quantity;
        if (item.orders) {
          customerEmails.add(item.orders.email);
          if (!recentOrdersMap.has(item.order_id)) {
            totalOrders++;
            recentOrdersMap.set(item.order_id, {
              ...item.orders,
              items: []
            });
          }
          recentOrdersMap.get(item.order_id).items.push(item);
        }
      });

      const recentOrders = Array.from(recentOrdersMap.values());
      recentOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return NextResponse.json({
        stats: {
          totalSales,
          totalOrders,
          totalProducts: (products || []).length,
          totalCustomers: customerEmails.size
        },
        recentOrders: recentOrders.slice(0, 5)
      });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Seller GET Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const path = params.path.join('/');
  
  try {
    const body = await request.json();
    
    if (path === 'add') {
      const id = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      // Whitelist real columns. `role` is client-side only; `storeName`
      // arrives camelCase from the form but the DB column is `store_name`.
      const row = { id };
      if (body.email !== undefined) row.email = body.email;
      if (body.password !== undefined) row.password = body.password;
      if (body.name !== undefined) row.name = body.name;
      if (body.phone !== undefined) row.phone = body.phone;
      if (body.address !== undefined) row.address = body.address;
      if (body.storeName !== undefined) row.store_name = body.storeName;
      const { error } = await supabase.from('sellersdata').insert([row]);
      if (error) {
        if (error.code === '23505') return NextResponse.json({ message: "Seller already registered" }, { status: 400 });
        throw error;
      }
      return NextResponse.json(row);
    }
    
    if (path === 'login') {
      const { email, password } = body;
      const { data: seller, error } = await supabase.from('sellersdata').select('*').eq('email', email).single();
      
      if (error || !seller || seller.password !== password) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
      }

      if (!seller.is_approved) {
        return NextResponse.json({ message: "Your account is pending approval. Please wait for admin approval before logging in." }, { status: 403 });
      }

      const token = jwt.sign({ id: seller.id, email: seller.email }, process.env.JWT_SECRET || 'mytopsecretkey', { expiresIn: '24h' });
      return NextResponse.json({
        message: "Login successful",
        token,
        seller: { id: seller.id, name: seller.name, email: seller.email, storeName: seller.store_name, role: "seller" }
      });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Seller POST Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const path = params.path.join('/');
  
  try {
    const body = await request.json();
    
    if (path === 'profile') {
      const seller = authenticateSeller(request);
      const allowedFields = ['name', 'phone', 'storeName', 'address'];
      const updates = {};
      allowedFields.forEach(field => {
        if (body[field] !== undefined) {
          if (field === 'storeName') updates.store_name = body[field];
          else updates[field] = body[field];
        }
      });
      const { data: sellerData, error } = await supabase.from('sellersdata').update(updates).eq('id', seller.id).select().single();
      if (error || !sellerData) return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
      delete sellerData.password;
      delete sellerData.confirm_password;
      sellerData.storeName = sellerData.store_name;
      sellerData.role = "seller";
      return NextResponse.json({ seller: sellerData });
    }
    
    if (params.path[0] === 'update' && params.path[1]) {
      const allowedFields = ['name', 'phone', 'storeName', 'address'];
      const updates = {};
      allowedFields.forEach(field => {
        if (body[field] !== undefined) {
          if (field === 'storeName') updates.store_name = body[field];
          else updates[field] = body[field];
        }
      });
      const { data: seller, error } = await supabase.from('sellersdata').update(updates).eq('id', params.path[1]).select().single();
      if (error || !seller) return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
      delete seller.password;
      delete seller.confirm_password;
      return NextResponse.json({ seller });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Seller PUT Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (params.path[0] === 'delete' && params.path[1]) {
    try {
      const { data, error } = await supabase.from('sellersdata').delete().eq('id', params.path[1]).select().single();
      if (error) throw error;
      return NextResponse.json({ message: 'Seller deleted successfully', deletedSeller: data });
    } catch (error) {
      return NextResponse.json({ message: error.message || 'Failed to delete seller' }, { status: 500 });
    }
  }
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
}
