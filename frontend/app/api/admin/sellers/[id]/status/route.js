import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { status } = await request.json();
    const { data, error } = await supabase.from('sellersdata').update({ status }).eq('id', params.id).select().single();
    if (error || !data) return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
    return NextResponse.json({ message: 'Seller status updated successfully', seller: { ...data, _id: data.id } });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating seller status' }, { status: 500 });
  }
}
