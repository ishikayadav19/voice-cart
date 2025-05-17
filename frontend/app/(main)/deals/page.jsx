"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import ProductCard from '@/app/components/ProductCard';
import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css';
import { Filter, X, Search, SlidersHorizontal, Heart } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import CountdownTimer from '@/app/components/CountdownTimer';

const DealsPage = () => {
  const { addToCart, addToWishlist, wishlist } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brands: [],
    rating: 0,
    availability: false,
    sortBy: 'discount'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dealEndTime] = useState(new Date().getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`);
        // Filter products with 50% or more discount
        const deals = response.data.filter(product => {
          if (!product.discountPrice || !product.price) return false;
          const discountPercentage = ((product.price - product.discountPrice) / product.price) * 100;
          return discountPercentage >= 50;
        });
        setProducts(deals);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  // Get unique brands for filter
  const getBrands = () => {
    const brands = [...new Set(products.map((product) => product.brand))];
    return brands;
  };

  // Handle brand filter toggle
  const toggleBrandFilter = (brand) => {
    setFilters((prev) => {
      const brands = [...prev.brands];
      if (brands.includes(brand)) {
        return { ...prev, brands: brands.filter((b) => b !== brand) };
      }
      return { ...prev, brands: [...brands, brand] };
    });
  };

  // Format price in rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get filtered products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      product => product.discountPrice >= filters.priceRange[0] && product.discountPrice <= filters.priceRange[1]
    );

    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = ((a.price - a.discountPrice) / a.price) * 100;
          const discountB = ((b.price - b.discountPrice) / b.price) * 100;
          return discountB - discountA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-rose-500 to-purple-600 mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Flash Deals</h1>
            <p className="text-lg opacity-90">Limited time offers with amazing discounts</p>
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
                  placeholder="Search deals..."
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
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <p className="text-gray-600">
            Showing {getFilteredProducts().length} deals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          {isFilterOpen && (
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 100000],
                      brands: [],
                      rating: 0,
                      availability: false,
                      sortBy: 'discount'
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
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => toggleBrandFilter(brand)}
                        className="rounded text-rose-500 focus:ring-rose-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Minimum Rating</h3>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="0">Any Rating</option>
                  <option value="4">4★ & Above</option>
                  <option value="3">3★ & Above</option>
                  <option value="2">2★ & Above</option>
                  <option value="1">1★ & Above</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.checked)}
                    className="rounded text-rose-500 focus:ring-rose-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">In Stock Only</span>
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
            ) : getFilteredProducts().length > 0 ? (
              getFilteredProducts().map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-64 object-cover" />
                    <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md font-bold">
                      {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                    <div className="flex items-center mb-3">
                      <span className="text-xl font-bold text-rose-600">₹{product.discountPrice.toFixed(2)}</span>
                      <span className="ml-2 text-sm line-through text-gray-500">₹{product.price.toFixed(2)}</span>
                    </div>

                    {/* Countdown Timer */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Offer ends in:</p>
                      <CountdownTimer endTime={dealEndTime} />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-medium transition-colors"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => addToWishlist(product)}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                      >
                        <Heart
                          size={20}
                          className={wishlist.some((item) => item._id === product._id) ? "fill-rose-600 text-rose-600" : ""}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No deals found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 100000],
                      brands: [],
                      rating: 0,
                      availability: false,
                      sortBy: 'discount'
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
  );
};

export default DealsPage; 