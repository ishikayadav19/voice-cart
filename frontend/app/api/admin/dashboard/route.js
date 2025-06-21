import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard data',
        stats: {
          totalUsers: 0,
          totalSellers: 0,
          totalProducts: 0,
          pendingSellers: 0
        },
        recent: {
          users: [],
          sellers: [],
          products: []
        }
      },
      { status: 500 }
    );
  }
} 