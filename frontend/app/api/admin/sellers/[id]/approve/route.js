import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/emailService';

export async function PUT(request, { params }) {
  try {
    const { isApproved } = await request.json();
    
    const updateData = { is_approved: isApproved };
    if (isApproved) updateData.approved_at = new Date().toISOString();

    const { data: seller, error } = await supabase.from('sellersdata').update(updateData).eq('id', params.id).select().single();
    if (error || !seller) return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
    
    if (isApproved) {
      const subject = 'Account Approved - Voice Cart';
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Account Approved!</h2>
          <p>Dear ${seller.name},</p>
          <p>Congratulations! Your seller account has been approved by our admin team.</p>
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #444;">Account Details:</h3>
            <p><strong>Store Name:</strong> ${seller.store_name}</p>
            <p><strong>Email:</strong> ${seller.email}</p>
            <p><strong>Approved On:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You can now log in to your seller dashboard and start adding products to your store.</p>
          <p>Best regards,<br>Voice Cart Admin Team</p>
        </div>
      `;
      await sendEmail(seller.email, subject, 'Your account has been approved!', html);
    }

    return NextResponse.json({ 
      message: `Seller ${isApproved ? 'approved' : 'rejected'} successfully`, 
      seller: { ...seller, _id: seller.id, isApproved: seller.is_approved, storeName: seller.store_name }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating seller approval' }, { status: 500 });
  }
}