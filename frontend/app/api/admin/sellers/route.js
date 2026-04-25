import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const { count: total } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true });
    const { count: approvedCount } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', true);
    const { count: pendingCount } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', false);
    
    const { data: sellers } = await supabase.from('sellersdata').select('*').order('created_at', { ascending: false }).range(skip, skip + limit - 1);

    return NextResponse.json({
      sellers: (sellers || []).map(s => ({ ...s, _id: s.id, isApproved: s.is_approved, storeName: s.store_name, confirmPassword: s.confirm_password, approvedAt: s.approved_at, createdAt: s.created_at })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSellers: total,
      approvedSellers: approvedCount,
      pendingSellers: pendingCount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 });
  }
}