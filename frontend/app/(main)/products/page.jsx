'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import ProductCard from '../../components/ProductCard';
import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css';
import { Filter, X, Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import SectionHeading from '../../components/SectionHeading';

const ProductsPage = () => {
  const { addToCart, addToWishlist, wishlist } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brands: [],
    rating: 0,
    availability: false,
    sortBy: 'featured'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const observer = useRef();

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`);
      setProducts(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    if (filters.availability) {
      filtered = filtered.filter(p => p.inStock);
    }

    filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered.slice(0, page * 12);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
  };

  // Get unique brands for filter
  const getBrands = () => {
    const brands = [...new Set(products.map((product) => product.brand))]
    return brands
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

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-[#D4AF37]/20 to-[#E6B9A6]/20 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#FAF9F6]/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center mt-8 text-[#1A1A1A]">
            <SectionHeading
              title="All Products"
              subtitle="Discover our amazing collection of products"
              colors={["#1A1A1A", "#D4AF37", "#1A1A1A"]}
              animationSpeed={4}
              className="text-4xl font-serif mb-2"
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
              <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 border border-[#E5E0D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#1A1A1A]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7A7571]" size={20} />
                </div>
              </form>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 border border-[#E5E0D8] ${isFilterOpen ? 'bg-[#D4AF37] text-white' : 'bg-white hover:bg-[#FDFBF7] text-[#1A1A1A]'
                  }`}
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>

            {/* Right side - Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-[#5C5C5C]">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#E5E0D8] text-[#1A1A1A]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <p className="text-[#5C5C5C]">
            Showing {products.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          {isFilterOpen && (
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-[#E5E0D8]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-serif text-[#1A1A1A]">Filters</h2>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 100000],
                      brands: [],
                      rating: 0,
                      availability: false,
                      sortBy: 'featured'
                    });
                  }}
                  className="text-sm text-[#D4AF37] hover:text-[#C5A030] font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-[#1A1A1A]">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-[#5C5C5C] mt-2">
                  <span>{formatPrice(filters.priceRange[0])}</span>
                  <span>{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-[#1A1A1A]">Brands</h3>
                <div className="space-y-2">
                  {getBrands().map((brand) => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                        className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] border-[#E5E0D8]"
                      />
                      <span className="text-[#5C5C5C]">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-[#1A1A1A]">Rating</h3>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                  className="w-full p-2 border border-[#E5E0D8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#1A1A1A]"
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
                    className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37] border-[#E5E0D8]"
                  />
                  <span className="text-[#5C5C5C]">In Stock Only</span>
                </label>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${isFilterOpen ? 'md:col-span-3' : 'md:col-span-4'}`}>
            {getFilteredProducts().length > 0 ? (
              getFilteredProducts().map((product, index) => (
                <div
                  key={product._id}
                  ref={index === getFilteredProducts().length - 1 ? lastProductElementRef : null}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                    isInWishlist={wishlist.some(item => item._id === product._id)}
                    onQuickView={() => handleQuickView(product)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <SlidersHorizontal className="h-12 w-12 text-[#E5E0D8] mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">No products found</h3>
                <p className="text-[#5C5C5C] mb-4">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 100000],
                      brands: [],
                      rating: 0,
                      availability: false,
                      sortBy: 'featured'
                    });
                  }}
                  className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C5A030] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Infinity size="30" speed="2.5" color="#D4AF37" />
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">No products found</h3>
            <p className="text-[#5C5C5C]">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage; 