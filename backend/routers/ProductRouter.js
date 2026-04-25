const express = require('express');
const supabase = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require('bson-objectid');

// Seller auth middleware
const sellerAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/add', async (req, res) => {
    if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
    }
    if (!req.body.mainImage) req.body.mainImage = req.body.images[0];
    
    try {
        const id = new ObjectId().toString();
        const productData = {
            id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discount_price: req.body.discountPrice || 0,
            category: req.body.category,
            images: req.body.images,
            main_image: req.body.mainImage,
            stock: req.body.stock || 0,
            brand: req.body.brand || '',
            rating: req.body.rating || 0,
            in_stock: req.body.inStock ?? true,
            featured: req.body.featured ?? false,
            seller: req.body.seller || null
        };
        const { error } = await supabase.from('productsdata').insert([productData]);
        if (error) throw error;
        res.status(200).json({ _id: id, ...productData });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ message: "Error adding product", error: err.message });
    }
});

router.get('/getbyid/:id', async (req, res) => {
  const { data, error } = await supabase.from('productsdata').select('*').eq('id', req.params.id).single();
  if (error) return res.status(500).json(error);
  if(data) {
      data._id = data.id;
      data.discountPrice = data.discount_price;
      data.mainImage = data.main_image;
      data.inStock = data.in_stock;
  }
  res.status(200).json(data);
});

router.put('/update/:id', async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            discount_price: req.body.discountPrice,
            category: req.body.category,
            images: req.body.images,
            main_image: req.body.mainImage,
            stock: req.body.stock,
            brand: req.body.brand,
            rating: req.body.rating,
            in_stock: req.body.inStock,
            featured: req.body.featured
        };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        
        const { data, error } = await supabase.from('productsdata').update(updateData).eq('id', req.params.id).select().single();
        if (error || !data) return res.status(404).json({ message: 'Product not found' });
        data._id = data.id;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update product', error: err.message });
    }
});

router.get('/getall', async (req, res) => {
   const { data, error } = await supabase.from('productsdata').select('*');
   if (error) return res.status(500).json(error);
   const formatted = (data||[]).map(d => ({ ...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock }));
   res.status(200).json(formatted);
});

router.delete('/delete/:id', async (req, res) => {
  const { data, error } = await supabase.from('productsdata').delete().eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ message: 'Failed to delete product', error });
  if (data) data._id = data.id;
  res.status(200).json({ message: 'Product deleted successfully', deletedProduct: data });
});

router.get('/category/:category', async (req, res) => {
  const { data, error } = await supabase.from('productsdata').select('*').ilike('category', req.params.category);
  if (error) return res.status(500).json({ message: 'Failed to fetch products', error });
  if (!data || data.length === 0) return res.status(404).json({ message: 'No products found in this category' });
  res.status(200).json(data.map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });
    const { data, error } = await supabase.from('productsdata').select('*').or(`name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
    if (error) throw error;
    res.json((data||[]).map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
  } catch (error) {
    res.status(500).json({ message: 'Error searching products' });
  }
});

router.post('/wishlist/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ message: 'User ID and Product ID are required' });
    const { data: product } = await supabase.from('productsdata').select('wishlist').eq('id', productId).single();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let wishlist = product.wishlist || [];
    if (wishlist.includes(userId)) return res.status(400).json({ message: 'Product already in wishlist' });
    wishlist.push(userId);
    const { data } = await supabase.from('productsdata').update({ wishlist }).eq('id', productId).select().single();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
});

router.delete('/wishlist/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const { data: product } = await supabase.from('productsdata').select('wishlist').eq('id', productId).single();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let wishlist = (product.wishlist || []).filter(id => id !== userId);
    const { data } = await supabase.from('productsdata').update({ wishlist }).eq('id', productId).select().single();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

router.get('/wishlist/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data } = await supabase.from('productsdata').select('*').contains('wishlist', [userId]);
    res.status(200).json((data||[]).map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

router.get('/wishlist/check/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { data } = await supabase.from('productsdata').select('wishlist').eq('id', productId).single();
    res.status(200).json({ isInWishlist: (data && data.wishlist && data.wishlist.includes(userId)) || false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking wishlist' });
  }
});

router.get('/seller/myproducts', sellerAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('productsdata').select('*').eq('seller', req.seller.id);
    if (error) throw error;
    res.status(200).json((data||[]).map(d => ({...d, _id: d.id, discountPrice: d.discount_price, mainImage: d.main_image, inStock: d.in_stock})));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seller products' });
  }
});

router.post('/seller/add', sellerAuth, async (req, res) => {
  try {
    const id = new ObjectId().toString();
    const productData = {
        id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        discount_price: req.body.discountPrice || 0,
        category: req.body.category,
        images: req.body.images,
        main_image: req.body.mainImage || (req.body.images ? req.body.images[0] : ''),
        stock: req.body.stock || 0,
        brand: req.body.brand || '',
        rating: req.body.rating || 0,
        in_stock: req.body.inStock ?? true,
        featured: req.body.featured ?? false,
        seller: req.seller.id
    };
    const { data, error } = await supabase.from('productsdata').insert([productData]).select().single();
    if (error) throw error;
    data._id = data.id;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

router.put('/seller/update/:id', sellerAuth, async (req, res) => {
  try {
    const updateData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        discount_price: req.body.discountPrice,
        category: req.body.category,
        images: req.body.images,
        main_image: req.body.mainImage,
        stock: req.body.stock,
        brand: req.body.brand,
        rating: req.body.rating,
        in_stock: req.body.inStock,
        featured: req.body.featured
    };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const { data, error } = await supabase.from('productsdata').update(updateData).match({ id: req.params.id, seller: req.seller.id }).select().single();
    if (error || !data) return res.status(404).json({ message: 'Product not found or not owned by seller' });
    data._id = data.id;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

router.delete('/seller/delete/:id', sellerAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('productsdata').delete().match({ id: req.params.id, seller: req.seller.id }).select().single();
    if (error || !data) return res.status(404).json({ message: 'Product not found or not owned by seller' });
    data._id = data.id;
    res.status(200).json({ message: 'Product deleted successfully', product: data });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
