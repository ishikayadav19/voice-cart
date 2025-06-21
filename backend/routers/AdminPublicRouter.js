const express = require('express');
const router = express.Router();
const User = require('../models/UserModels');
const Product = require('../models/ProductModels');
const Seller = require('../models/SellerModels');
const { sendEmail } = require('../services/emailService');

// Admin Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments({ isApproved: true });
    const totalProducts = await Product.countDocuments();
    const pendingSellers = await Seller.countDocuments({ isApproved: false });

    // Get recent data
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentSellers = await Seller.find({ isApproved: true }).sort({ createdAt: -1 }).limit(5);
    const recentProducts = await Product.find().populate('seller').sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        pendingSellers
      },
      recent: {
        users: recentUsers,
        sellers: recentSellers,
        products: recentProducts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

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

// Get all sellers with pagination (including approval status)
router.get('/sellers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sellers = await Seller.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Seller.countDocuments();
    const approvedCount = await Seller.countDocuments({ isApproved: true });
    const pendingCount = await Seller.countDocuments({ isApproved: false });
    
    res.json({
      sellers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSellers: total,
      approvedSellers: approvedCount,
      pendingSellers: pendingCount
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

// Approve/Reject seller
router.put('/sellers/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const updateData = { isApproved };
    if (isApproved) {
      updateData.approvedAt = new Date();
    }

    const result = await Seller.findByIdAndUpdate(id, updateData, { new: true });
    
    // Send email notification to seller
    if (isApproved) {
      const subject = 'Account Approved - Voice Cart';
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Account Approved!</h2>
          <p>Dear ${seller.name},</p>
          <p>Congratulations! Your seller account has been approved by our admin team.</p>
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #444;">Account Details:</h3>
            <p><strong>Store Name:</strong> ${seller.storeName}</p>
            <p><strong>Email:</strong> ${seller.email}</p>
            <p><strong>Approved On:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You can now log in to your seller dashboard and start adding products to your store.</p>
          <p>Best regards,<br>Voice Cart Admin Team</p>
        </div>
      `;
      
      await sendEmail(seller.email, subject, 'Your account has been approved!', html);
    }

    res.status(200).json({ 
      message: `Seller ${isApproved ? 'approved' : 'rejected'} successfully`, 
      seller: result 
    });
  } catch (error) {
    console.error('Error updating seller approval:', error);
    res.status(500).json({ message: 'Error updating seller approval' });
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