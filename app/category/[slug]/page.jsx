"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Filter, ChevronDown, SlidersHorizontal } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import ProductCard from "../../components/product-card"

// Sample product data
const allProducts = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 199.99,
    discountPrice: 149.99,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 128,
    brand: "SoundMaster",
    inStock: true,
  },
  {
    id: 2,
    name: "Smart 4K Ultra HD TV - 55 inch",
    price: 699.99,
    discountPrice: 549.99,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 245,
    brand: "VisionPlus",
    inStock: true,
  },
  {
    id: 3,
    name: "Bluetooth Portable Speaker",
    price: 89.99,
    discountPrice: 69.99,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    reviews: 112,
    brand: "SoundMaster",
    inStock: true,
  },
  {
    id: 4,
    name: "Smartphone - 128GB",
    price: 799.99,
    discountPrice: 749.99,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 320,
    brand: "TechPro",
    inStock: true,
  },
  {
    id: 5,
    name: "Laptop - 15.6 inch, 512GB SSD",
    price: 1299.99,
    discountPrice: 1099.99,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 189,
    brand: "TechPro",
    inStock: false,
  },
  {
    id: 6,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    discountPrice: 19.99,
    category: "fashion",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    reviews: 89,
    brand: "StyleX",
    inStock: true,
  },
  {
    id: 7,
    name: "Designer Denim Jeans",
    price: 79.99,
    discountPrice: 59.99,
    category: "fashion",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 112,
    brand: "UrbanFit",
    inStock: true,
  },
  {
    id: 8,
    name: "Leather Jacket",
    price: 199.99,
    discountPrice: 159.99,
    category: "fashion",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 76,
    brand: "StyleX",
    inStock: true,
  },
  {
    id: 9,
    name: "Modern Coffee Table",
    price: 249.99,
    discountPrice: 199.99,
    category: "home",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    reviews: 67,
    brand: "HomeEssentials",
    inStock: true,
  },
  {
    id: 10,
    name: "Luxury Scented Candle Set",
    price: 39.99,
    discountPrice: 29.99,
    category: "home",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 156,
    brand: "AromaLux",
    inStock: true,
  },
  {
    id: 11,
    name: "Anti-Aging Face Serum",
    price: 59.99,
    discountPrice: 44.99,
    category: "beauty",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 203,
    brand: "GlowUp",
    inStock: true,
  },
  {
    id: 12,
    name: "Professional Makeup Brush Set",
    price: 49.99,
    discountPrice: 34.99,
    category: "beauty",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 178,
    brand: "BeautyPro",
    inStock: true,
  },
  {
    id: 13,
    name: "Basketball",
    price: 29.99,
    discountPrice: 24.99,
    category: "sports",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 92,
    brand: "SportElite",
    inStock: true,
  },
  {
    id: 14,
    name: "Yoga Mat",
    price: 39.99,
    discountPrice: 29.99,
    category: "sports",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 145,
    brand: "FitLife",
    inStock: true,
  },
  {
    id: 15,
    name: "Bestselling Novel",
    price: 19.99,
    discountPrice: 14.99,
    category: "books",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 210,
    brand: "PageTurner",
    inStock: true,
  },
  {
    id: 16,
    name: "Cookbook Collection",
    price: 34.99,
    discountPrice: 29.99,
    category: "books",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 87,
    brand: "CulinaryPress",
    inStock: true,
  },
]

const CategoryPage = () => {
  const params = useParams()
  const { slug } = params

  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    brands: [],
    rating: 0,
    availability: false,
  })
  const [sortOption, setSortOption] = useState("featured")

  // Get category name with proper capitalization
  const getCategoryName = () => {
    return slug.charAt(0).toUpperCase() + slug.slice(1)
  }

  // Filter products by category
  useEffect(() => {
    const filteredProducts = allProducts.filter((product) => product.category === slug)
    setProducts(filteredProducts)
  }, [slug])

  // Add to cart function
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  // Add to wishlist function
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.filter((item) => item.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

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
        return {
          ...prev,
          brands: brands.filter((b) => b !== brand),
        }
      } else {
        return {
          ...prev,
          brands: [...brands, brand],
        }
      }
    })
  }

  // Apply filters to products
  const getFilteredProducts = () => {
    let filtered = [...products]

    // Apply price filter
    filtered = filtered.filter((product) => {
      const price = product.discountPrice || product.price
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) => filters.brands.includes(product.brand))
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating)
    }

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter((product) => product.inStock)
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
        break
      case "price-high-low":
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // In a real app, you would sort by date
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // 'featured' - no specific sorting
        break
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItems={cartItems} wishlistItems={wishlistItems} />

      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{getCategoryName()}</h1>
            <p className="text-gray-600">Explore our collection of {getCategoryName().toLowerCase()} products.</p>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className={`md:w-64 flex-shrink-0 ${isFilterOpen ? "block" : "hidden md:block"}`}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                  <button
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 2000],
                        brands: [],
                        rating: 0,
                        availability: false,
                      })
                    }
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">${filters.priceRange[0]}</span>
                    <span className="text-sm text-gray-500">${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange("priceRange", [filters.priceRange[0], Number.parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Brand</h3>
                  <div className="space-y-2">
                    {getBrands().map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          id={`brand-${brand}`}
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => toggleBrandFilter(brand)}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          id={`rating-${rating}`}
                          type="radio"
                          checked={filters.rating === rating}
                          onChange={() => handleFilterChange("rating", rating)}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                        />
                        <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700 flex items-center">
                          {Array(rating)
                            .fill()
                            .map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          <span className="ml-1">& Up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <div className="flex items-center">
                    <input
                      id="availability"
                      type="checkbox"
                      checked={filters.availability}
                      onChange={() => handleFilterChange("availability", !filters.availability)}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label htmlFor="availability" className="ml-2 text-sm text-gray-700">
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onAddToWishlist={addToWishlist}
                      isInWishlist={wishlistItems.some((item) => item.id === product.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                  <button
                    onClick={() =>
                      setFilters({
                        priceRange: [0, 2000],
                        brands: [],
                        rating: 0,
                        availability: false,
                      })
                    }
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CategoryPage
