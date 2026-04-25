import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const authenticateToken = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Access token required');
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'mytopsecretkey');
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

export async function GET(request, { params }) {
  const path = params.path;

  try {
    if (path[0] === 'product' && path[1]) {
      const { data: reviews, error } = await supabase.from('reviews').select('*, usersdata(name)').eq('product_id', path[1]).order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json((reviews || []).map(r => ({ _id: r.id, productId: r.product_id, userId: { _id: r.user_id, name: r.usersdata ? r.usersdata.name : '' }, rating: r.rating, comment: r.comment, createdAt: r.created_at })));
    }

    if (path[0] === 'user' && path[1]) {
      const user = authenticateToken(request);
      const { data: review, error } = await supabase.from('reviews').select('*, usersdata(name)').match({ product_id: path[1], user_id: user.id }).single();
      if (error || !review) return NextResponse.json(null);
      return NextResponse.json({ _id: review.id, productId: review.product_id, userId: { _id: review.user_id, name: review.usersdata ? review.usersdata.name : '' }, rating: review.rating, comment: review.comment, createdAt: review.created_at });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Review GET Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const pathString = params.path.join('/');

  try {
    if (pathString === 'submit') {
      const user = authenticateToken(request);
      const { productId, rating, comment } = await request.json();

      const { data: existingReview } = await supabase.from('reviews').select('*').match({ product_id: productId, user_id: user.id }).single();
      if (existingReview) return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 });

      const id = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const { error } = await supabase.from('reviews').insert([{ id, product_id: productId, user_id: user.id, rating, comment }]);
      if (error) throw error;
      
      const { data: userData } = await supabase.from('usersdata').select('name').eq('id', user.id).single();
      return NextResponse.json({ _id: id, productId, userId: { _id: user.id, name: userData ? userData.name : '' }, rating, comment }, { status: 201 });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Review POST Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const path = params.path;

  try {
    if (path[0] === 'update' && path[1]) {
      const user = authenticateToken(request);
      const { rating, comment } = await request.json();
      
      const { data: review, error } = await supabase.from('reviews').update({ rating, comment }).match({ id: path[1], user_id: user.id }).select('*, usersdata(name)').single();
      if (error || !review) return NextResponse.json({ message: 'Review not found or unauthorized' }, { status: 404 });
      
      return NextResponse.json({ _id: review.id, productId: review.product_id, userId: { _id: review.user_id, name: review.usersdata ? review.usersdata.name : '' }, rating: review.rating, comment: review.comment, createdAt: review.created_at });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Review PUT Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const path = params.path;

  try {
    if (path[0] === 'delete' && path[1]) {
      const user = authenticateToken(request);
      const { data: review, error } = await supabase.from('reviews').delete().match({ id: path[1], user_id: user.id }).select().single();
      if (error || !review) return NextResponse.json({ message: 'Review not found or unauthorized' }, { status: 404 });
      return NextResponse.json({ message: 'Review deleted successfully' });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Review DELETE Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
