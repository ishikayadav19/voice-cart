const { Schema, model } = require('../connection');

const reviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'productsdata', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'usersdata', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('reviews', reviewSchema); 