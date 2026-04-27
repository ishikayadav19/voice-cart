import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

// Helper to authenticate user from request header
const authenticateUser = (request) => {
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
      const { data, error } = await supabase.from('usersdata').select('*');
      if (error) throw error;
      return NextResponse.json(data);
    }
    
    if (path === 'profile') {
      const user = authenticateUser(request);
      const { data: userData, error } = await supabase.from('usersdata').select('*').eq('id', user.id).single();
      if (error || !userData) return NextResponse.json({ message: 'User not found' }, { status: 404 });
      delete userData.password;
      userData.role = "user";
      return NextResponse.json({ user: userData });
    }
    
    // Dynamic gets
    if (params.path[0] === 'getbyid' && params.path[1]) {
      const { data, error } = await supabase.from('usersdata').select('*').eq('id', params.path[1]).single();
      if (error) throw error;
      return NextResponse.json(data);
    }
    
    if (params.path[0] === 'getbycity' && params.path[1]) {
      const { data, error } = await supabase.from('usersdata').select('*').eq('city', params.path[1]);
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('User GET Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const path = params.path.join('/');
  
  try {
    const body = await request.json();
    
    if (path === 'add') {
      // Create random 24 char hex string like bson-objectid
      const id = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      // Whitelist real columns. The client sends `role` for routing, but
      // the usersdata table doesn't have that column — including it in the
      // insert causes a 500 from Supabase.
      const row = { id };
      if (body.email !== undefined) row.email = body.email;
      if (body.password !== undefined) row.password = body.password;
      if (body.name !== undefined) row.name = body.name;
      if (body.phone !== undefined) row.phone = body.phone;
      if (body.city !== undefined) row.city = body.city;
      const { error } = await supabase.from('usersdata').insert([row]);
      if (error) {
        if (error.code === '23505') return NextResponse.json({ message: "Email already registered" }, { status: 400 });
        throw error;
      }
      return NextResponse.json(row);
    }
    
    if (path === 'login') {
      const { email, password } = body;
      const { data: user, error } = await supabase.from('usersdata').select('*').eq('email', email).single();
      
      if (error || !user || user.password !== password) {
        return NextResponse.json({ message: "Invalid Email or password" }, { status: 401 });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'mytopsecretkey', { expiresIn: '24h' });
      return NextResponse.json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: "user" }
      });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('User POST Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const path = params.path.join('/');
  
  try {
    const body = await request.json();
    
    if (path === 'profile') {
      const authUser = authenticateUser(request);
      const allowedFields = ['name', 'email', 'phone', 'city'];
      const updates = {};
      allowedFields.forEach(field => {
        if (body[field] !== undefined) updates[field] = body[field];
      });
      const { data: user, error } = await supabase.from('usersdata').update(updates).eq('id', authUser.id).select().single();
      if (error || !user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
      delete user.password;
      user.role = "user";
      return NextResponse.json({ user });
    }
    
    if (params.path[0] === 'update' && params.path[1]) {
      const { data, error } = await supabase.from('usersdata').update(body).eq('id', params.path[1]).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('User PUT Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (params.path[0] === 'delete' && params.path[1]) {
    try {
      const { data, error } = await supabase.from('usersdata').delete().eq('id', params.path[1]).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
  }
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
}
