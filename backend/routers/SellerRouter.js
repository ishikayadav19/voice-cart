const express = require('express');
const supabase = require('../connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ObjectId = require('bson-objectid');

const router = express.Router();

// POST /seller/signup - Register a new seller
router.post('/add', async (req, res) => {
    try {
        const id = new ObjectId().toString();
        const { error } = await supabase.from('sellersdata').insert([{ id, ...req.body }]);
        if (error) {
            if (error.code === '23505') return res.status(400).json({ message: "Seller already registered" });
            throw error;
        }
        res.status(200).json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Some error occurred" });
    }
});

// POST /seller/login - Login seller
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: seller, error } = await supabase.from('sellersdata').select('*').eq('email', email).single();
        if (error || !seller || seller.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!seller.is_approved) {
            return res.status(403).json({ 
                message: "Your account is pending approval. Please wait for admin approval before logging in." 
            });
        }

        const token = jwt.sign(
            { id: seller.id, email: seller.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            seller: { id: seller.id, name: seller.name, email: seller.email, storeName: seller.store_name, role: "seller" }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
});

// GET /seller/getall - Get all sellers
router.get('/getall', async (req, res) => {
    const { data, error } = await supabase.from('sellersdata').select('*');
    if (error) {
        console.error(error);
        return res.status(500).json(error);
    }
    res.status(200).json(data);
});

// DELETE /seller/delete/:id
router.delete('/delete/:id', async (req, res) => {
    const { data, error } = await supabase.from('sellersdata').delete().eq('id', req.params.id).select().single();
    if (error) {
        console.error('Error deleting seller:', error);
        return res.status(500).json({ message: 'Failed to delete seller', error });
    }
    res.status(200).json({ message: 'Seller deleted successfully', deletedSeller: data });
});

// Update seller profile (admin or generic update)
router.put('/update/:id', async (req, res) => {
    try {
        const allowedFields = ['name', 'phone', 'storeName', 'address'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'storeName') updates.store_name = req.body[field];
                else updates[field] = req.body[field];
            }
        });
        const { data: seller, error } = await supabase.from('sellersdata').update(updates).eq('id', req.params.id).select().single();
        if (error || !seller) return res.status(404).json({ message: 'Seller not found' });
        delete seller.password;
        delete seller.confirm_password;
        res.status(200).json({ seller });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update seller profile' });
    }
});

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

// GET /seller/profile - Get seller profile
router.get('/profile', sellerAuth, async (req, res) => {
    try {
        const { data: seller, error } = await supabase.from('sellersdata').select('*').eq('id', req.seller.id).single();
        if (error || !seller) return res.status(404).json({ message: 'Seller not found' });
        delete seller.password;
        delete seller.confirm_password;
        seller.storeName = seller.store_name;
        seller.role = "seller";
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load seller profile' });
    }
});

// PUT /seller/profile - Update seller profile for logged-in seller
router.put('/profile', sellerAuth, async (req, res) => {
    try {
        const allowedFields = ['name', 'phone', 'storeName', 'address'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'storeName') updates.store_name = req.body[field];
                else updates[field] = req.body[field];
            }
        });
        const { data: seller, error } = await supabase.from('sellersdata').update(updates).eq('id', req.seller.id).select().single();
        if (error || !seller) return res.status(404).json({ message: 'Seller not found' });
        delete seller.password;
        delete seller.confirm_password;
        seller.storeName = seller.store_name;
        seller.role = "seller";
        res.status(200).json({ seller });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update seller profile' });
    }
});

// Seller dashboard endpoint
router.get('/dashboard', sellerAuth, async (req, res) => {
    try {
        const sellerId = req.seller.id;
        
        // Get products
        const { data: products } = await supabase.from('productsdata').select('*').eq('seller', sellerId);
        
        // Get all order items for this seller, and their orders
        const { data: orderItems } = await supabase.from('order_items').select('*, orders(*)').eq('seller_id', sellerId);

        let totalSales = 0;
        let totalOrders = 0;
        const customerEmails = new Set();
        const recentOrdersMap = new Map();

        (orderItems || []).forEach(item => {
            totalSales += item.price * item.quantity;
            if (item.orders) {
                customerEmails.add(item.orders.email);
                if (!recentOrdersMap.has(item.order_id)) {
                    totalOrders++;
                    recentOrdersMap.set(item.order_id, {
                        ...item.orders,
                        items: []
                    });
                }
                recentOrdersMap.get(item.order_id).items.push(item);
            }
        });

        const recentOrders = Array.from(recentOrdersMap.values());
        recentOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.status(200).json({
            stats: {
                totalSales,
                totalOrders,
                totalProducts: (products || []).length,
                totalCustomers: customerEmails.size
            },
            recentOrders: recentOrders.slice(0, 5)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to load dashboard data' });
    }
});

module.exports = router;