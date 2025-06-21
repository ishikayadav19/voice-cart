const express = require('express');
const Model = require('../models/SellerModels');
const jwt = require('jsonwebtoken'); // import the jwt library
require('dotenv').config(); // import the dotenv library to use environment variables
const Product = require('../models/ProductModels');
const Order = require('../models/OrderModel');

const router = express.Router();

// POST /seller/signup - Register a new seller
router.post('/add', (req, res) => {
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            if (err?.code === 11000) {
                res.status(400).json({ message: "Seller already registered" });
            } else {
                res.status(500).json({ message: "Some error occurred" });
            }
        });
});

// POST /seller/login - Login seller
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find seller by email
        const seller = await Model.findOne({ email });
        if (!seller) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        if (seller.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if seller is approved
        if (!seller.isApproved) {
            return res.status(403).json({ 
                message: "Your account is pending approval. Please wait for admin approval before logging in." 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: seller._id, email: seller.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                storeName: seller.storeName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
});

// GET /seller/getall - Get all sellers
router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /seller/delete/:id - Delete a seller by ID
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    Model.findByIdAndDelete(id)
        .then((deletedSeller) => {
            if (!deletedSeller) {
                return res.status(404).json({ message: 'Seller not found' });
            }
            res.status(200).json({ message: 'Seller deleted successfully', deletedSeller });
        })
        .catch((err) => {
            console.error('Error deleting seller:', err);
            res.status(500).json({ message: 'Failed to delete seller', error: err });
        });
});

// Update seller profile
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ['name', 'phone', 'storeName', 'address'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const seller = await Model.findByIdAndUpdate(id, updates, { new: true }).select('-password -confirmPassword');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ seller });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update seller profile' });
  }
});

// Seller auth middleware (reuse from ProductRouter)
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
    const seller = await Model.findById(req.seller.id).select('-password -confirmPassword');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
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
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const seller = await Model.findByIdAndUpdate(req.seller.id, updates, { new: true }).select('-password -confirmPassword');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ seller });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update seller profile' });
  }
});

// Seller dashboard endpoint
router.get('/dashboard', sellerAuth, async (req, res) => {
  try {
    const sellerId = req.seller.id;
    // Get all products for this seller
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);
    // Get all orders with at least one item for this seller
    const orders = await Order.find({ 'items.sellerId': sellerId });
    // Calculate stats
    let totalSales = 0;
    let totalOrders = 0;
    const customerEmails = new Set();
    const recentOrders = [];
    orders.forEach(order => {
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId);
      if (sellerItems.length > 0) {
        totalOrders++;
        sellerItems.forEach(item => {
          totalSales += item.price * item.quantity;
        });
        customerEmails.add(order.email);
        recentOrders.push({
          ...order.toObject(),
          items: sellerItems
        });
      }
    });
    // Sort recentOrders by createdAt desc and take top 5
    recentOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({
      stats: {
        totalSales,
        totalOrders,
        totalProducts: products.length,
        totalCustomers: customerEmails.size
      },
      recentOrders: recentOrders.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});

module.exports = router;