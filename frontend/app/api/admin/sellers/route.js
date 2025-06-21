export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
    }

    const response = await fetch(`${backendUrl}/api/admin/sellers?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend response error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch sellers: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in sellers API route:', error);
    return Response.json(
      { message: `Error fetching sellers: ${error.message}` },
      { status: 500 }
    );
  }
} 