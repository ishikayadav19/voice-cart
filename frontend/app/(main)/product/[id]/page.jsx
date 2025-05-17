"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import { Star, Heart, ShoppingCart, Share2, ChevronRight, MessageSquare } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css';

const ProductViewPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const { id } = useParams();
  const { addToCart, addToWishlist, cart, wishlist } = useShop();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/getbyid/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!newReview.rating) {
      setReviewError('Please select a rating');
      return;
    }

    if (!newReview.comment.trim()) {
      setReviewError('Please write a review comment');
      return;
    }

    try {
      // Get user token from localStorage or sessionStorage
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
      
      if (!token) {
        setReviewError('Please login to submit a review');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/submit`,
        {
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Add the new review to the list
      const newReviewWithDate = {
        ...response.data,
        createdAt: new Date().toISOString()
      };
      setReviews([newReviewWithDate, ...reviews]);

      // Update product rating
      const updatedProduct = { ...product };
      const newRating = ((product.rating * product.reviews) + newReview.rating) / (product.reviews + 1);
      updatedProduct.rating = parseFloat(newRating.toFixed(1));
      updatedProduct.reviews = product.reviews + 1;
      setProduct(updatedProduct);

      // Reset form and show success message
      setNewReview({ rating: 0, comment: '' });
      setReviewSuccess('Thank you for your review!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setReviewSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 401) {
        setReviewError('Please login to submit a review');
      } else {
        setReviewError(error.response?.data?.message || 'Failed to submit review. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Infinity size="30" speed="2.5" color="#E11D48" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const isInCart = cart.some(item => item.id === product?._id);
  const isInWishlist = wishlist.some(item => item.id === product?._id);

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b mt-16">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-rose-600">Home</a>
            <ChevronRight size={16} className="mx-2" />
            <a href={`/category/${product.category}`} className="hover:text-rose-600 capitalize">{product.category}</a>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img 
                src={product.image || "/placeholder.svg"} 
                alt={product.name} 
                className="w-full h-[500px] object-contain p-4"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-rose-500">
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={`${product.name} ${index}`} 
                    className="w-full h-24 object-contain p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            {/* Rating and Reviews */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
              </div>
              <button className="ml-4 text-rose-600 hover:text-rose-700 flex items-center">
                <MessageSquare size={16} className="mr-1" />
                Write a Review
              </button>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              {product.discountPrice ? (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-rose-600">₹{product.discountPrice.toFixed(2)}</span>
                  <span className="text-xl line-through text-gray-500">₹{product.price.toFixed(2)}</span>
                  <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded text-sm font-medium">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-800">₹{product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  min="1"
                  max={product.stock}
                  className="w-16 text-center border border-gray-300 rounded-md py-1"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                className={`flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isInCart ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => addToCart({ ...product, id: product._id, quantity })}
                disabled={isInCart || product.stock <= 0}
              >
                <ShoppingCart size={20} />
                {isInCart ? "In Cart" : "Add to Cart"}
              </button>
              <button
                className={`flex-1 bg-white border border-rose-600 text-rose-600 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-rose-50 flex items-center justify-center gap-2 ${
                  isInWishlist ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => addToWishlist({ ...product, id: product._id })}
                disabled={isInWishlist}
              >
                <Heart size={20} />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 size={20} />
              </button>
            </div>

            {/* Product Info Tabs */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-4 mb-4">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'description'
                      ? 'text-rose-600 border-b-2 border-rose-600'
                      : 'text-gray-600 hover:text-rose-600'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'reviews'
                      ? 'text-rose-600 border-b-2 border-rose-600'
                      : 'text-gray-600 hover:text-rose-600'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === 'description' ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{product.description || "No description available."}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Review Form */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>
                      {reviewError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                          {reviewError}
                        </div>
                      )}
                      {reviewSuccess && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                          {reviewSuccess}
                        </div>
                      )}
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={24}
                                className={`cursor-pointer transition-colors ${
                                  i < newReview.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                }`}
                                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                          <textarea
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                            placeholder="Share your thoughts about this product..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>

                    {/* Existing Reviews */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                by {review.userId?.name || 'Anonymous'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductViewPage;