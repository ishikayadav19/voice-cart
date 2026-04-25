import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { status } = await request.json();
    const { data, error } = await supabase.from('usersdata').update({ status }).eq('id', params.id).select().single();
    if (error || !data) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User status updated successfully', user: { ...data, _id: data.id } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}