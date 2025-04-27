"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

// Sample wishlist items
const sampleWishlistItems = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 199.99,
    discountPrice: 149.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 128,
    inStock: true,
  },
  {
    id: 2,
    name: "Smart 4K Ultra HD TV - 55 inch",
    price: 699.99,
    discountPrice: 549.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 245,
    inStock: true,
  },
]

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(sampleWishlistItems)
  const [cartItems, setCartItems] = useState([])

  // Load wishlist items from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  // Save wishlist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const handleRemoveFromWishlist = (itemId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item])
    handleRemoveFromWishlist(item.id)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItems={cartItems} wishlistItems={wishlistItems} />

      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

            {wishlistItems.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-6 flex-1">
                        <h2 className="text-lg font-medium text-gray-800">{item.name}</h2>
                        <div className="mt-1 flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating)
                                    ? "text-yellow-400"
                                    : i < item.rating
                                    ? "text-yellow-400 opacity-50"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-sm text-gray-500">
                              ({item.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center">
                          {item.discountPrice ? (
                            <>
                              <span className="text-lg font-semibold text-rose-600">
                                ${item.discountPrice.toFixed(2)}
                              </span>
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-semibold text-gray-800">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-4">
                  Save items you like by clicking the heart icon on product pages.
                </p>
                <a
                  href="/category/electronics"
                  className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors inline-block"
                >
                  Browse Products
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default WishlistPage
