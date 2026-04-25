import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const { count: total } = await supabase.from('usersdata').select('*', { count: 'exact', head: true });
    const { data: users } = await supabase.from('usersdata').select('*').order('created_at', { ascending: false }).range(skip, skip + limit - 1);

    return NextResponse.json({
      users: (users || []).map(u => ({ ...u, _id: u.id, createdAt: u.created_at })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}