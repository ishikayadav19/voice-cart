"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Filter, ChevronDown, SlidersHorizontal, Heart, ShoppingCart } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import ProductCard from "../../components/ProductCard"
import axios from "axios"

const CategoryPage = () => {
  const params = useParams()
  const { slug } = params
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brands: [],
    rating: 0,
    availability: false,
  })
  const [sortOption, setSortOption] = useState("featured")

  // Get category name with proper capitalization
  const getCategoryName = () => {
    return slug.charAt(0).toUpperCase() + slug.slice(1)
  }

  // Fetch products by category from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/product/category/${slug}`)
        setProducts(response.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [slug])

  // Get unique brands for filter
  const getBrands = () => {
    const brands = [...new Set(products.map((product) => product.brand))]
    return brands
  }

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  // Handle brand filter toggle
  const toggleBrandFilter = (brand) => {
    setFilters((prev) => {
      const brands = [...prev.brands]
      if (brands.includes(brand)) {
        return { ...prev, brands: brands.filter((b) => b !== brand) }
      }
      return { ...prev, brands: [...brands, brand] }
    })
  }

  // Get filtered and sorted products
  const getFilteredProducts = () => {
    let filtered = products.filter((product) => {
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand)
      const matchesRating = product.rating >= filters.rating
      const matchesAvailability = !filters.availability || product.inStock

      return matchesPrice && matchesBrand && matchesRating && matchesAvailability
    })

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        // Sort by price ascending (low to high)
        filtered = [...filtered].sort((a, b) => {
          const priceA = Number(a.price) || 0
          const priceB = Number(b.price) || 0
          if (priceA < priceB) return -1
          if (priceA > priceB) return 1
          return 0
        })
        break
      case "price-high":
        // Sort by price descending (high to low)
        filtered = [...filtered].sort((a, b) => {
          const priceA = Number(a.price) || 0
          const priceB = Number(b.price) || 0
          if (priceA > priceB) return -1
          if (priceA < priceB) return 1
          return 0
        })
        break
      case "rating":
        // Sort by rating descending
        filtered = [...filtered].sort((a, b) => {
          const ratingA = Number(a.rating) || 0
          const ratingB = Number(b.rating) || 0
          if (ratingA > ratingB) return -1
          if (ratingA < ratingB) return 1
          return 0
        })
        break
      case "featured":
        // Sort by featured status first, then by rating
        filtered = [...filtered].sort((a, b) => {
          // First sort by featured status
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          // If featured status is the same, sort by rating
          const ratingA = Number(a.rating) || 0
          const ratingB = Number(b.rating) || 0
          if (ratingA > ratingB) return -1
          if (ratingA < ratingB) return 1
          return 0
        })
        break
      default:
        break
    }

    return filtered
  }

  // Format price in rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Handle add to cart
  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product])
  }

  // Handle add to wishlist
  const handleAddToWishlist = (product) => {
    setWishlistItems((prev) => [...prev, product])
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>

  const filteredProducts = getFilteredProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto mt-8 px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{getCategoryName()}</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm ${
                isFilterOpen ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {isFilterOpen && (
            <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setFilters({
                    priceRange: [0, 100000],
                    brands: [],
                    rating: 0,
                    availability: false,
                  })}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Clear All
                </button>
              </div>
              
              {/* Price Range */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(filters.priceRange[0])}</span>
                  <span>{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Brands</h3>
                <div className="space-y-2">
                  {getBrands().map((brand) => (
                    <label key={brand} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                        className="rounded"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Rating</h3>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.checked)}
                    className="rounded"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${isFilterOpen ? 'md:col-span-3' : 'md:col-span-4'}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onAddToWishlist={() => handleAddToWishlist(product)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={() => setFilters({
                    priceRange: [0, 100000],
                    brands: [],
                    rating: 0,
                    availability: false,
                  })}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CategoryPage
