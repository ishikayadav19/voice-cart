import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(request, { params }) {
  try {
    const { data, error } = await supabase.from('usersdata').delete().eq('id', params.id).select().single();
    if (error || !data) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}