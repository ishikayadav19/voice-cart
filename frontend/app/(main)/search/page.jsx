"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import ProductCard from "../../components/ProductCard"
import { useShop } from '@/context/ShopContext'
import Link from "next/link"

const SearchPage = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart, addToWishlist, wishlist } = useShop()

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('Searching for:', query)
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/search?q=${encodeURIComponent(query)}`
        console.log('API URL:', apiUrl)
        
        const response = await axios.get(apiUrl)
        console.log('Search response:', response.data)
        
        setProducts(response.data)
        setError(null)
      } catch (err) {
        console.error('Error searching products:', err)
        setError(err.response?.data?.message || 'Failed to search products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Search Results for "{query}"
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">Please check your connection and try again.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No products found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}". Try different keywords or browse our categories.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/products" className="text-rose-600 hover:text-rose-700 font-medium">
                  Browse All Products
                </Link>
                <Link href="/" className="text-rose-600 hover:text-rose-700 font-medium">
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">Found {products.length} products</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPageWrapper() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
} 