const express = require('express');
const router = express.Router();
const Review = require('../models/ReviewModels');

// Submit a new review
router.post('/submit', async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    const review = new Review({ productId, userId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 