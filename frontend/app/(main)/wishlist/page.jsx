"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist items from localStorage or state management
    const savedWishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    setWishlistItems(savedWishlistItems);
    setLoading(false);
  }, []);

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== productId);
      localStorage.setItem("wishlistItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const addToCart = (product) => {
    // Get existing cart items
    const existingCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    // Check if product already exists in cart
    const existingItem = existingCartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      // Update quantity if item exists
      const updatedCartItems = existingCartItems.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      // Add new item to cart
      const updatedCartItems = [...existingCartItems, { ...product, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

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
      <Navbar wishlistItems={wishlistItems} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your wishlist yet.</p>
            <Link
              href="/products"
              className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Link href={`/product/${item._id}`}>
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    {item.discountPrice && (
                      <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                        {Math.round((1 - item.discountPrice / item.price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${item._id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-rose-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center mb-3">
                    {item.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-rose-600">
                          ${item.discountPrice.toFixed(2)}
                        </span>
                        <span className="ml-2 text-sm line-through text-gray-500">
                          ${item.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-800">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-medium transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage; 