const express = require('express');
const router = express.Router();
const Review = require('../models/ReviewModels');
const User = require('../models/UserModels'); // Import User model
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Submit a new review
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // Get userId from token

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({ productId, userId, rating, comment });
    await review.save();
    
    // Populate user name for response
    await review.populate({ path: 'userId', model: User, select: 'name' });
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Fetch reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate({ path: 'userId', model: User, select: 'name' })
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(reviews);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get user's review for a specific product
router.get('/user/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await Review.findOne({ 
      productId: req.params.productId, 
      userId 
    }).populate({ path: 'userId', model: User, select: 'name' });
    
    res.json(review);
  } catch (error) {
    console.error('Get user review error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update user's review
router.put('/update/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, userId },
      { rating, comment },
      { new: true }
    ).populate({ path: 'userId', model: User, select: 'name' });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }
    
    res.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete user's review
router.delete('/delete/:reviewId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const review = await Review.findOneAndDelete({ 
      _id: req.params.reviewId, 
      userId 
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 