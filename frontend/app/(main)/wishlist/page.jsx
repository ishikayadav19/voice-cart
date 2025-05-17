"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ProductCard from "../../components/ProductCard";
import { useShop } from '@/context/ShopContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useShop();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Heart className="mx-auto h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Save items you like by clicking the heart icon. They'll appear here for easy access.
              </p>
              <Link
                href="/products"
                className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">You have {wishlist.length} items in your wishlist</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <div key={product._id} className="relative">
                    <ProductCard product={product} />
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage; 