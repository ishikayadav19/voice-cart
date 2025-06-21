"use client"
import { Heart } from "lucide-react"
import Link from "next/link"
import ReviewSummary from "./ReviewSummary"

const ProductCard = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
          {product.discountPrice && (
            <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md text-xs font-bold">
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold mb-1 text-gray-800 hover:text-rose-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2">
          <ReviewSummary 
            rating={product.rating || 0} 
            reviewCount={product.reviews || 0} 
            size="sm" 
          />
        </div>

        <div className="flex items-center mb-3">
          {product.discountPrice ? (
            <>
              <span className="text-lg font-bold text-rose-600"> &#8377;{product.discountPrice.toFixed(2)}</span>
              <span className="ml-2 text-sm line-through text-gray-500"> &#8377;{product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800"> &#8377;{product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-medium transition-colors text-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={() => onAddToWishlist(product)}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <Heart size={18} className={isInWishlist ? "fill-rose-600 text-rose-600" : ""} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
