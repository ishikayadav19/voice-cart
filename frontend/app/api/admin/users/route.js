export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log('Backend URL:', backendUrl);

    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
    }

    const response = await fetch(`${backendUrl}/api/admin/users?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Log the response status and text for more details
      const errorText = await response.text();
      console.error(`Backend response error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in users API route:', error);
    return Response.json(
      { message: `Error fetching users: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.substring(pathname.lastIndexOf('/') + 1);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
    }

    const response = await fetch(`${backendUrl}/api/admin/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend DELETE response error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in users DELETE API route:', error);
    return Response.json(
      { message: `Error deleting user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { pathname } = new URL(request.url);
    const parts = pathname.split('/');
    const id = parts[parts.length - 2]; // Get ID before 'status'

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
    }

    const body = await request.json();

    const response = await fetch(`${backendUrl}/api/admin/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend PUT response error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to update user status: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in users PUT API route:', error);
    return Response.json(
      { message: `Error updating user status: ${error.message}` },
      { status: 500 }
    );
  }
} 