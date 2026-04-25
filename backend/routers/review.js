const express = require('express');
const router = express.Router();
const supabase = require('../connection');
const jwt = require('jsonwebtoken');
const ObjectId = require('bson-objectid');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const { data: existingReview, error: err1 } = await supabase.from('reviews').select('*').match({ product_id: productId, user_id: userId }).single();
    if (existingReview) return res.status(400).json({ message: 'You have already reviewed this product' });

    const id = new ObjectId().toString();
    const { error } = await supabase.from('reviews').insert([{ id, product_id: productId, user_id: userId, rating, comment }]);
    if (error) throw error;
    
    const { data: user } = await supabase.from('usersdata').select('name').eq('id', userId).single();
    res.status(201).json({ _id: id, productId, userId: { _id: userId, name: user ? user.name : '' }, rating, comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const { data: reviews, error } = await supabase.from('reviews').select('*, usersdata(name)').eq('product_id', req.params.productId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json((reviews || []).map(r => ({ _id: r.id, productId: r.product_id, userId: { _id: r.user_id, name: r.usersdata ? r.usersdata.name : '' }, rating: r.rating, comment: r.comment, createdAt: r.created_at })));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/user/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: review, error } = await supabase.from('reviews').select('*, usersdata(name)').match({ product_id: req.params.productId, user_id: userId }).single();
    if (error || !review) return res.json(null);
    res.json({ _id: review.id, productId: review.product_id, userId: { _id: review.user_id, name: review.usersdata ? review.usersdata.name : '' }, rating: review.rating, comment: review.comment, createdAt: review.created_at });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/update/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    const { data: review, error } = await supabase.from('reviews').update({ rating, comment }).match({ id: req.params.reviewId, user_id: userId }).select('*, usersdata(name)').single();
    if (error || !review) return res.status(404).json({ message: 'Review not found or unauthorized' });
    
    res.json({ _id: review.id, productId: review.product_id, userId: { _id: review.user_id, name: review.usersdata ? review.usersdata.name : '' }, rating: review.rating, comment: review.comment, createdAt: review.created_at });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete/:reviewId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: review, error } = await supabase.from('reviews').delete().match({ id: req.params.reviewId, user_id: userId }).select().single();
    if (error || !review) return res.status(404).json({ message: 'Review not found or unauthorized' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;