"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useShop } from '@/context/ShopContext';
import SectionHeading from '@/app/components/SectionHeading';
import Link from "next/link";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useShop();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFromWishlist = (productId) => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromWishlist(productId);
      setIsRemoving(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="My Wishlist"
            subtitle="Save your favorite items for later"
            colors={["#E11D48", "#7C3AED", "#E11D48"]}
            animationSpeed={3}
          />

          <AnimatePresence>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Wishlist Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {wishlist.map((product) => (
                      <motion.div
                        key={product._id || product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center p-4 border-b border-gray-200 last:border-b-0"
                      >
                        <Link href={`/product/${product._id || product.id}`} className="flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </Link>
                        <div className="ml-4 flex-1">
                          <Link href={`/product/${product._id || product.id}`}>
                            <h3 className="text-lg font-semibold text-gray-800 hover:text-rose-600">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center mt-2">
                            <span className="text-lg font-bold text-rose-600">
                              &#8377;{(product.discountPrice || product.price).toFixed(2)}
                            </span>
                            {product.discountPrice && (
                              <span className="ml-2 text-sm line-through text-gray-500">
                                &#8377;{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(product)}
                            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors flex items-center gap-2"
                          >
                            <ShoppingCart size={18} />
                            Add to Cart
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveFromWishlist(product._id || product.id)}
                            className="p-2 text-gray-500 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={20} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Wishlist Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Items</span>
                        <span className="font-semibold">{wishlist.length}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-600 text-sm">
                          Add items to your cart to proceed with checkout. You can also remove items from your wishlist if you no longer want them.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-6">Start adding items you love to your wishlist.</p>
                <Link
                  href="/products"
                  className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage; 