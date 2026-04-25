import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request, { params }) {
  try {
    const { data, error } = await supabase.from('productsdata').delete().eq('id', params.id).select().single();
    if (error || !data) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}