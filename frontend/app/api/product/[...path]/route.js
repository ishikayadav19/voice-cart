import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

const sellerAuth = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'mytopsecretkey');
  } catch (err) {
    throw new Error('Invalid token');
  }
};

export async function GET(request, { params }) {
  const path = params.path;
  const pathString = path.join('/');
  
  try {
    if (pathString === 'getall') {
      const { data, error } = await supabase.from('productsdata').select('id, name, price, discount_price, category, main_image, in_stock, rating');
      if (error) throw error;
      const formatted = (data||[]).map(d => ({ ...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock }));
      return NextResponse.json(formatted);
    }
    
    if (path[0] === 'getbyid' && path[1]) {
      const { data, error } = await supabase.from('productsdata').select('*').eq('id', path[1]).single();
      if (error) return NextResponse.json(error, { status: 500 });
      if (data) {
        data._id = data.id;
        data.discountPrice = data.discount_price;
        data.mainImage = data.main_image;
        data.inStock = data.in_stock;
      }
      return NextResponse.json(data);
    }

    if (path[0] === 'category' && path[1]) {
      const { data, error } = await supabase.from('productsdata').select('*').ilike('category', path[1]);
      if (error) return NextResponse.json({ message: 'Failed to fetch products', error }, { status: 500 });
      if (!data || data.length === 0) return NextResponse.json({ message: 'No products found' }, { status: 404 });
      return NextResponse.json(data.map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
    }

    if (pathString === 'search') {
      const { searchParams } = new URL(request.url);
      const q = searchParams.get('q');
      if (!q) return NextResponse.json({ message: 'Search query is required' }, { status: 400 });
      const { data, error } = await supabase.from('productsdata').select('*').or(`name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
      if (error) throw error;
      return NextResponse.json((data||[]).map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
    }

    if (path[0] === 'wishlist' && path[1] === 'check' && path[2] && path[3]) {
      const userId = path[2];
      const productId = path[3];
      const { data } = await supabase.from('productsdata').select('wishlist').eq('id', productId).single();
      return NextResponse.json({ isInWishlist: (data && data.wishlist && data.wishlist.includes(userId)) || false });
    }

    if (path[0] === 'wishlist' && path.length === 2) {
      const userId = path[1];
      const { data } = await supabase.from('productsdata').select('*').contains('wishlist', [userId]);
      return NextResponse.json((data||[]).map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
    }

    if (pathString === 'seller/myproducts') {
      const seller = sellerAuth(request);
      const { data, error } = await supabase.from('productsdata').select('*').eq('seller', seller.id);
      if (error) throw error;
      return NextResponse.json((data||[]).map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Product GET Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const path = params.path;
  const pathString = path.join('/');
  
  try {
    const body = await request.json();
    
    if (pathString === 'add') {
      if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
        return NextResponse.json({ message: "At least one image is required" }, { status: 400 });
      }
      if (!body.mainImage) body.mainImage = body.images[0];
      const id = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const productData = {
          id,
          name: body.name,
          description: body.description,
          price: body.price,
          discount_price: body.discountPrice || 0,
          category: body.category,
          images: body.images,
          main_image: body.mainImage,
          stock: body.stock || 0,
          brand: body.brand || '',
          rating: body.rating || 0,
          in_stock: body.inStock ?? true,
          featured: body.featured ?? false,
          seller: body.seller || null
      };
      const { error } = await supabase.from('productsdata').insert([productData]);
      if (error) throw error;
      return NextResponse.json({ _id: id, ...productData });
    }

    if (pathString === 'wishlist/add') {
      const { userId, productId } = body;
      if (!userId || !productId) return NextResponse.json({ message: 'User ID and Product ID are required' }, { status: 400 });
      const { data: product } = await supabase.from('productsdata').select('wishlist').eq('id', productId).single();
      if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      let wishlist = product.wishlist || [];
      if (wishlist.includes(userId)) return NextResponse.json({ message: 'Product already in wishlist' }, { status: 400 });
      wishlist.push(userId);
      const { data } = await supabase.from('productsdata').update({ wishlist }).eq('id', productId).select().single();
      return NextResponse.json(data);
    }

    if (pathString === 'seller/add') {
      const seller = sellerAuth(request);
      const id = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const productData = {
          id,
          name: body.name,
          description: body.description,
          price: body.price,
          discount_price: body.discountPrice || 0,
          category: body.category,
          images: body.images,
          main_image: body.mainImage || (body.images ? body.images[0] : ''),
          stock: body.stock || 0,
          brand: body.brand || '',
          rating: body.rating || 0,
          in_stock: body.inStock ?? true,
          featured: body.featured ?? false,
          seller: seller.id
      };
      const { data, error } = await supabase.from('productsdata').insert([productData]).select().single();
      if (error) throw error;
      data._id = data.id;
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Product POST Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const path = params.path;
  const pathString = path.join('/');
  
  try {
    const body = await request.json();
    
    if (path[0] === 'update' && path[1]) {
      const updateData = {
          name: body.name,
          description: body.description,
          price: body.price,
          discount_price: body.discountPrice,
          category: body.category,
          images: body.images,
          main_image: body.mainImage,
          stock: body.stock,
          brand: body.brand,
          rating: body.rating,
          in_stock: body.inStock,
          featured: body.featured
      };
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
      
      const { data, error } = await supabase.from('productsdata').update(updateData).eq('id', path[1]).select().single();
      if (error || !data) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      data._id = data.id;
      return NextResponse.json(data);
    }

    if (path[0] === 'seller' && path[1] === 'update' && path[2]) {
      const seller = sellerAuth(request);
      const updateData = {
          name: body.name,
          description: body.description,
          price: body.price,
          discount_price: body.discountPrice,
          category: body.category,
          images: body.images,
          main_image: body.mainImage,
          stock: body.stock,
          brand: body.brand,
          rating: body.rating,
          in_stock: body.inStock,
          featured: body.featured
      };
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
  
      const { data, error } = await supabase.from('productsdata').update(updateData).match({ id: path[2], seller: seller.id }).select().single();
      if (error || !data) return NextResponse.json({ message: 'Product not found or not owned by seller' }, { status: 404 });
      data._id = data.id;
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Product PUT Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const path = params.path;
  const pathString = path.join('/');

  try {
    if (path[0] === 'delete' && path[1]) {
      const { data, error } = await supabase.from('productsdata').delete().eq('id', path[1]).select().single();
      if (error) return NextResponse.json({ message: 'Failed to delete product', error }, { status: 500 });
      if (data) data._id = data.id;
      return NextResponse.json({ message: 'Product deleted successfully', deletedProduct: data });
    }

    if (pathString === 'wishlist/remove') {
      const body = await request.json();
      const { userId, productId } = body;
      const { data: product } = await supabase.from('productsdata').select('wishlist').eq('id', productId).single();
      if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      let wishlist = (product.wishlist || []).filter(id => id !== userId);
      const { data } = await supabase.from('productsdata').update({ wishlist }).eq('id', productId).select().single();
      return NextResponse.json(data);
    }

    if (path[0] === 'seller' && path[1] === 'delete' && path[2]) {
      const seller = sellerAuth(request);
      const { data, error } = await supabase.from('productsdata').delete().match({ id: path[2], seller: seller.id }).select().single();
      if (error || !data) return NextResponse.json({ message: 'Product not found or not owned by seller' }, { status: 404 });
      data._id = data.id;
      return NextResponse.json({ message: 'Product deleted successfully', product: data });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Product DELETE Error:', error.message);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
