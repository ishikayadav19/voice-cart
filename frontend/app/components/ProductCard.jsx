"use client"
import React from 'react';
import { Heart } from "lucide-react"
import Link from "next/link"
import { useShop } from '@/context/ShopContext';
import { motion } from 'framer-motion';
import ReviewSummary from "./ReviewSummary";

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, wishlist } = useShop();
  const isInWishlist = wishlist.some(item => (item.id || item._id) === (product.id || product._id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotateY: 3, rotateX: 3, zIndex: 10 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transform-gpu transition-all duration-300 hover:shadow-[0_20px_50px_rgba(225,29,72,0.15)] group"
    >
      <Link href={`/product/${product.id || product._id}`}>
        <div className="relative aspect-w-1 aspect-h-1 p-6 bg-white/5 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.6 }}
            src={product.main_image || product.mainImage || (product.images && product.images[0]) || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-contain filter drop-shadow-xl"
          />
          {(product.discount_price || product.discountPrice) && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest shadow-lg border border-white/20 z-10">
              {Math.round((1 - (product.discount_price || product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/product/${product.id || product._id}`}>
          <h3 className="text-lg font-medium mb-1 text-gray-200 line-clamp-1 group-hover:text-rose-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3">
          <ReviewSummary
            rating={product.rating || 0}
            reviewCount={product.reviews || 0}
            size="sm"
          />
        </div>

        <div className="flex items-center mb-5">
          {(product.discount_price || product.discountPrice) ? (
            <>
              <span className="text-xl font-serif font-bold text-white">&#8377;{(product.discount_price || product.discountPrice).toFixed(2)}</span>
              <span className="ml-3 text-sm line-through text-gray-500">&#8377;{product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-serif font-bold text-white">&#8377;{product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors"
          >
            ADD TO CART
          </button>
          <button
            onClick={() => addToWishlist(product)}
            className={`p-3 rounded-xl border transition-colors ${isInWishlist
                ? "bg-rose-500/20 border-rose-500/50 text-rose-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
          >
            <Heart
              size={20}
              className={isInWishlist ? "fill-rose-400" : ""}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;