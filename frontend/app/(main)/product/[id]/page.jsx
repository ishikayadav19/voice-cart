"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import { Star } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const ProductViewPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const { id } = useParams(); // Access the product ID from the URL
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
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/submit`, {
        productId: id,
        userId: 'user123', // Replace with actual user ID from context/auth
        rating: newReview.rating,
        comment: newReview.comment
      });
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen">Product not found</div>;
  }

  // Helper to check if product is in cart/wishlist
  const isInCart = cart.some(item => item.id === product?._id);
  const isInWishlist = wishlist.some(item => item.id === product?._id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto mt-6 py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="shadow-lg rounded-xl overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-96 object-cover" />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="flex items-center mb-2">
              {/* Rating Stars */}
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                />
              ))}
              <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
            </div>
            {/* Show category and stock */}
            <div className="mb-2 text-gray-600">
              Category: <span className="font-medium">{product.category || "N/A"}</span>
              <span className="ml-4">
                Stock: <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </span>
              </span>
            </div>
            {product.discountPrice ? (
              <div className="flex items-center mb-3">
                <span className="text-2xl font-bold text-rose-600">&#8377;{product.discountPrice.toFixed(2)}</span>
                <span className="ml-2 text-lg line-through text-gray-500">&#8377;{product.price.toFixed(2)}</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-800 mb-3">${product.price.toFixed(2)}</div>
            )}
            <p className="text-gray-700 mb-6">{product.description || "No description available."}</p>

            {/* Add to Cart and Wishlist Buttons */}
            <div className="flex gap-4">
              <button
                className={`bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-full transition-colors ${isInCart ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => addToCart({ ...product, id: product._id })}
                disabled={isInCart || product.stock <= 0}
              >
                {isInCart ? "In Cart" : "Add to Cart"}
              </button>
              <button
                className={`bg-white border border-rose-600 text-rose-600 font-semibold py-3 px-6 rounded-full transition-colors hover:bg-rose-50 ${isInWishlist ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => addToWishlist({ ...product, id: product._id })}
                disabled={isInWishlist}
              >
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Rating and Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ratings and Reviews</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Review Form (for logged-in users) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={`cursor-pointer ${i < newReview.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
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
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">by {review.userId?.name || 'Anonymous'}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
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