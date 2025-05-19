"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Filter, Search, SlidersHorizontal } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import ProductCard from "../../components/ProductCard"
import axios from "axios"
import { useShop } from '@/context/ShopContext'
import SectionHeading from '@/app/components/SectionHeading'
import { Infinity } from "lucide-react"

const CategoryPage = () => {
  const params = useParams()
  const { slug } = params
  const { addToCart, addToWishlist, wishlist } = useShop()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brands: [],
    rating: 0,
    availability: false,
    sortBy: 'featured'
  })
  const [searchQuery, setSearchQuery] = useState('')

  // Get category name with proper capitalization
  const getCategoryName = () => {
    return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
  }

  // Fetch products by category from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/category/${slug.toLowerCase()}`);
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setError(null);
        } else {
          setError('No products found in this category');
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [slug]);

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

  // Format price in rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
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
    switch (filters.sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => {
          const priceA = Number(a.price) || 0
          const priceB = Number(b.price) || 0
          if (priceA < priceB) return -1
          if (priceA > priceB) return 1
          return 0
        })
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => {
          const priceA = Number(a.price) || 0
          const priceB = Number(b.price) || 0
          if (priceA > priceB) return -1
          if (priceA < priceB) return 1
          return 0
        })
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => {
          const ratingA = Number(a.rating) || 0
          const ratingB = Number(b.rating) || 0
          if (ratingA > ratingB) return -1
          if (ratingA < ratingB) return 1
          return 0
        })
        break
      case "featured":
        filtered = [...filtered].sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
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

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality if needed
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>

  const filteredProducts = getFilteredProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-rose-500 to-purple-600 mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <SectionHeading
              title={getCategoryName()}
              subtitle={`Explore our ${getCategoryName().toLowerCase()} collection`}
              colors={["#ffffff", "#f0f0f0", "#ffffff", "#f0f0f0"]}
              animationSpeed={4}
              className="text-4xl font-bold mb-2"
            />
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center">
            {/* Left side - Search and Filter */}
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={`Search ${getCategoryName().toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </form>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>

            {/* Right side - Sort */}
            <div className="flex items-center gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
          
          <p className="text-gray-600">
            Showing {filteredProducts.length} items
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          {isFilterOpen && (
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <SectionHeading
                  title="Filters"
                  colors={["#E11D48", "#7C3AED", "#E11D48"]}
                  animationSpeed={3}
                  className="text-lg font-semibold"
                  showUnderline={false}
                  align="left"
                />
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 100000],
                      brands: [],
                      rating: 0,
                      availability: false,
                      sortBy: 'newest'
                    });
                  }}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{formatPrice(filters.priceRange[0])}</span>
                  <span>{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Brands</h3>
                <div className="space-y-2">
                  {getBrands().map((brand) => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                        className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-gray-300"
                      />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Rating</h3>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-gray-300"
                  />
                  <span className="text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${isFilterOpen ? 'md:col-span-3' : 'md:col-span-4'}`}>
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <Infinity size="30" speed="2.5" color="#E11D48" />
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onAddToWishlist={() => addToWishlist(product)}
                    isInWishlist={wishlist.some(item => item._id === product._id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <SectionHeading
                  title="No items found"
                  subtitle="Try adjusting your filters or search criteria"
                  colors={["#E11D48", "#7C3AED", "#E11D48"]}
                  animationSpeed={3}
                  className="text-lg font-medium mb-2"
                  showUnderline={false}
                />
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 100000],
                      brands: [],
                      rating: 0,
                      availability: false,
                      sortBy: 'newest'
                    });
                  }}
                  className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
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
