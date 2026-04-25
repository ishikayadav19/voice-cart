import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const { count: total } = await supabase.from('productsdata').select('*', { count: 'exact', head: true });
    const { data: products } = await supabase.from('productsdata').select('*, sellersdata(*)').order('created_at', { ascending: false }).range(skip, skip + limit - 1);

    return NextResponse.json({
      products: (products || []).map(p => ({ ...p, _id: p.id, seller: p.sellersdata, discountPrice: p.discount_price, mainImage: p.main_image, inStock: p.in_stock })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}