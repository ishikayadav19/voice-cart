"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import { Star } from 'lucide-react';

const ProductViewPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Access the product ID from the URL

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

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
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
            {product.discountPrice ? (
              <div className="flex items-center mb-3">
                <span className="text-2xl font-bold text-rose-600">${product.discountPrice.toFixed(2)}</span>
                <span className="ml-2 text-lg line-through text-gray-500">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-800 mb-3">${product.price.toFixed(2)}</div>
            )}
            <p className="text-gray-700 mb-6">{product.description || "No description available."}</p>

            {/* Add to Cart Button */}
            <button className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-6 rounded-full transition-colors">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Rating and Reviews Section (See next steps) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ratings and Reviews</h2>
          {/* Implement rating and review display and submission here */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductViewPage;