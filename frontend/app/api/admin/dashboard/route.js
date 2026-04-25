import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { count: totalUsers } = await supabase.from('usersdata').select('*', { count: 'exact', head: true });
    const { count: totalSellers } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', true);
    const { count: totalProducts } = await supabase.from('productsdata').select('*', { count: 'exact', head: true });
    const { count: pendingSellers } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', false);

    const { data: recentUsers } = await supabase.from('usersdata').select('*').order('created_at', { ascending: false }).limit(5);
    const { data: recentSellers } = await supabase.from('sellersdata').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(5);
    const { data: recentProducts } = await supabase.from('productsdata').select('*, sellersdata(*)').order('created_at', { ascending: false }).limit(5);

    return NextResponse.json({
      stats: { totalUsers, totalSellers, totalProducts, pendingSellers },
      recent: {
        users: (recentUsers || []).map(u => ({ ...u, _id: u.id, createdAt: u.created_at })),
        sellers: (recentSellers || []).map(s => ({ ...s, _id: s.id, createdAt: s.created_at, storeName: s.store_name })),
        products: (recentProducts || []).map(p => ({ ...p, _id: p.id, createdAt: p.created_at, mainImage: p.main_image, seller: p.sellersdata }))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
