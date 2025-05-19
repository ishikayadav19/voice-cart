"use client"
import React from 'react';
import { Heart, Star } from "lucide-react"
import Link from "next/link"
import { useShop } from '@/context/ShopContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, wishlist } = useShop();
  const isInWishlist = wishlist.some(item => item._id === product._id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-w-1 aspect-h-1">
          <div className="w-full h-48 bg-white p-4">
            <img 
              src={product.mainImage || (product.images && product.images[0]) || "/placeholder.svg"} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          {product.discountPrice && (
            <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md text-xs font-bold">
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold mb-1 text-gray-800 line-clamp-2 hover:text-rose-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-500">({product.rating})</span>
        </div>

        <div className="flex items-center mb-3">
          {product.discountPrice ? (
            <>
              <span className="text-lg font-bold text-rose-600">&#8377;{product.discountPrice.toFixed(2)}</span>
              <span className="ml-2 text-sm line-through text-gray-500">&#8377;{product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800">&#8377;{product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-medium transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={() => addToWishlist(product)}
            className={`p-2 rounded-md transition-colors ${
              isInWishlist
                ? "bg-rose-100 text-rose-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Heart
              size={20}
              className={isInWishlist ? "fill-current" : ""}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;