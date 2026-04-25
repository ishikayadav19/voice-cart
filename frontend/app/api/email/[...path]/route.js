import { NextResponse } from 'next/server';
import { sendEmail, sendOrderConfirmationEmail } from '@/lib/emailService';

export async function GET(request, { params }) {
  const pathString = params.path.join('/');

  if (pathString === 'verify-config') {
    const emailConfig = {
      emailUser: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
      emailPassword: process.env.EMAIL_PASSWORD ? 'Configured' : 'Not configured'
    };
    return NextResponse.json(emailConfig);
  }

  return NextResponse.json({ message: 'Not found' }, { status: 404 });
}

export async function POST(request, { params }) {
  const pathString = params.path.join('/');

  try {
    const body = await request.json();

    if (pathString === 'test') {
      const { to, subject, text } = body;
      const result = await sendEmail(to, subject, text);
      return NextResponse.json(result);
    }

    if (pathString === 'order-confirmation') {
      const { userEmail, orderDetails } = body;
      const result = await sendOrderConfirmationEmail(userEmail, orderDetails);
      return NextResponse.json(result);
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Email POST Error:', error.message);
    return NextResponse.json({ success: false, message: 'Failed', error: error.message }, { status: 500 });
  }
}
