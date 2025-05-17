const express = require('express');
const router = express.Router();
const User = require('../models/UserModels');
const Product = require('../models/ProductModels');
const Seller = require('../models/SellerModels');

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await User.countDocuments();
    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User status updated successfully', user: result });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get all products with pagination
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find().populate('seller').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Product.countDocuments();
    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Update product status (assuming product status exists in model)
// router.put('/products/:id/status', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     // You would need to add a 'status' field to your ProductModels if you want this functionality
//     const result = await Product.findByIdAndUpdate(id, { status }, { new: true });
//     if (!result) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product status updated successfully', product: result });
//   } catch (error) {
//     console.error('Error updating product status:', error);
//     res.status(500).json({ message: 'Error updating product status' });
//   }
// });

// Get all sellers with pagination
router.get('/sellers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sellers = await Seller.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Seller.countDocuments();
    res.json({
      sellers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSellers: total
    });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Error fetching sellers' });
  }
});

// Delete a seller
router.delete('/sellers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Seller.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Error deleting seller' });
  }
});

// Update seller status
router.put('/sellers/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await Seller.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller status updated successfully', seller: result });
  } catch (error) {
    console.error('Error updating seller status:', error);
    res.status(500).json({ message: 'Error updating seller status' });
  }
});

module.exports = router; 