export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
    }

    const response = await fetch(`${backendUrl}/api/admin/products?page=${page}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend response error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in products API route:', error);
    return Response.json(
      { message: `Error fetching products: ${error.message}` },
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

    const response = await fetch(`${backendUrl}/api/admin/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend DELETE response error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in products DELETE API route:', error);
    return Response.json(
      { message: `Error deleting product: ${error.message}` },
      { status: 500 }
    );
  }
}

// Note: Product status update endpoint is commented out in the backend as the Product model might not have a status field.
// If you add a status field to the Product model and uncomment the backend endpoint, you can uncomment and use this frontend PUT handler.
// export async function PUT(request) {
//   try {
//     const { pathname } = new URL(request.url);
//     const parts = pathname.split('/');
//     const id = parts[parts.length - 2]; // Get ID before 'status'

//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//     if (!backendUrl) {
//       throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
//     }

//     const body = await request.json();

//     const response = await fetch(`${backendUrl}/api/admin/products/${id}/status`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`Backend PUT response error: ${response.status} - ${errorText}`);
//       throw new Error(`Failed to update product status: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return Response.json(data);
//   } catch (error) {
//     console.error('Error in products PUT API route:', error);
//     return Response.json(
//       { message: `Error updating product status: ${error.message}` },
//       { status: 500 }
//     );
//   }
// } 