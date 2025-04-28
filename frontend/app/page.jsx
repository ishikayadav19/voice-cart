"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
// import { ShoppingCart, Heart, Mic, ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "./components/navbar"
import ProductCard from "./components/product-card"
import Footer from "./components/footer";

import OfferBanner from "./components/offer-banner"
import VoiceAssistant from "./components/voice-assistant"
import axios from "axios"
import { Infinity } from "ldrs/react"
import "ldrs/react/Infinity.css"
import { ChevronLeft, ChevronRight, Heart, Mic, ShoppingCart } from "lucide-react"

// Sample product data
const products = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 199.99,
    discountPrice: 149.99,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 128,
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
  },
  {
    id: 3,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    discountPrice: 19.99,
    category: "fashion",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 4,
    name: "Designer Denim Jeans",
    price: 79.99,
    discountPrice: 59.99,
    category: "fashion",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 112,
  },
  {
    id: 5,
    name: "Modern Coffee Table",
    price: 249.99,
    discountPrice: 199.99,
    category: "home",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 6,
    name: "Luxury Scented Candle Set",
    price: 39.99,
    discountPrice: 29.99,
    category: "home",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 7,
    name: "Anti-Aging Face Serum",
    price: 59.99,
    discountPrice: 44.99,
    category: "beauty",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 203,
  },
  {
    id: 8,
    name: "Professional Makeup Brush Set",
    price: 49.99,
    discountPrice: 34.99,
    category: "beauty",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 178,
  },
]

// Featured deals
const featuredDeals = [
  {
    id: 101,
    name: "Limited Edition Smartwatch",
    price: 299.99,
    discountPrice: 199.99,
    discount: "33%",
    image: "/placeholder.svg?height=300&width=300",
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    id: 102,
    name: "Premium Bluetooth Speaker",
    price: 149.99,
    discountPrice: 89.99,
    discount: "40%",
    image: "/placeholder.svg?height=300&width=300",
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    id: 103,
    name: "Ergonomic Office Chair",
    price: 249.99,
    discountPrice: 179.99,
    discount: "28%",
    image: "/placeholder.svg?height=300&width=300",
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
]

// Banner slides
const bannerSlides = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 50% off on selected items",
    image: "/placeholder.svg?height=500&width=1200",
    buttonText: "Shop Now",
    link: "/sale",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Check out our latest collection",
    image: "/placeholder.svg?height=500&width=1200",
    buttonText: "Explore",
    link: "/new-arrivals",
  },
  {
    id: 3,
    title: "Voice Shopping",
    subtitle: "Try our new voice shopping experience",
    image: "/placeholder.svg?height=500&width=1200",
    buttonText: "Learn More",
    link: "/voice-shopping",
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Handle banner slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1))
  }

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

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    if (command.includes("search")) {
      const searchTerm = command.replace("search", "").trim()
      setSearchQuery(searchTerm)
    } else if (command.includes("go to") || command.includes("navigate to")) {
      const destination = command.replace("go to", "").replace("navigate to", "").trim()

      // Map voice commands to categories
      const categoryMap = {
        electronics: "/category/electronics",
        fashion: "/category/fashion",
        home: "/category/home",
        beauty: "/category/beauty",
        sports: "/category/sports",
        books: "/category/books",
        cart: "/cart",
        wishlist: "/wishlist",
        login: "/login",
        "sign up": "/signup",
        contact: "/contact",
      }

      if (categoryMap[destination]) {
        window.location.href = categoryMap[destination]
      }
    }
  }

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/all`)
        // Get the first 4 products as featured products
        setFeaturedProducts(response.data.slice(0, 4))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const ProductsPage = () => {
    const [productList, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
  
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`);
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

  
    useEffect(() => {
      fetchProducts();
    }, []);
  }

 

  const handleAddToCart = (product) => {  
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      if (existingItem) {
        return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }
  const handleAddToWishlist = (product) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item._id === product._id);
      if (isInWishlist) {
        return prev.filter(item => item._id !== product._id);
      }
      return [...prev, product];
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar cartItems={cartItems} wishlistItems={wishlistItems} />

      {/* Voice Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceAssistant isActive={isVoiceActive} setIsActive={setIsVoiceActive} onCommand={handleVoiceCommand} />
      </div>

      {/* Hero Banner Slider */}
      <div className="relative overflow-hidden h-[500px] mb-8">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center animate-fadeIn">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl animate-slideUp">{slide.subtitle}</p>
                <Link href={slide.link}>
                  <span className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 animate-pulse">
                    {slide.buttonText}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Featured Deals Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Flash Deals</h2>
          <Link href="/deals">
            <span className="text-rose-600 hover:text-rose-700 font-medium">View All</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative">
                <img src={deal.image || "/placeholder.svg"} alt={deal.name} className="w-full h-64 object-cover" />
                <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md font-bold">
                  {deal.discount} OFF
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{deal.name}</h3>
                <div className="flex items-center mb-3">
                  <span className="text-xl font-bold text-rose-600">${deal.discountPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm line-through text-gray-500">${deal.price.toFixed(2)}</span>
                </div>

                {/* Countdown Timer */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Offer ends in:</p>
                  <div className="flex space-x-2">
                    <div className="bg-gray-200 px-2 py-1 rounded text-center">
                      <span className="font-mono font-bold">48</span>
                      <p className="text-xs">Hours</p>
                    </div>
                    <div className="bg-gray-200 px-2 py-1 rounded text-center">
                      <span className="font-mono font-bold">23</span>
                      <p className="text-xs">Mins</p>
                    </div>
                    <div className="bg-gray-200 px-2 py-1 rounded text-center">
                      <span className="font-mono font-bold">59</span>
                      <p className="text-xs">Secs</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(deal)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-medium transition-colors"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => addToCart(deal)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  <button
                    onClick={() => addToWishlist(deal)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  >
                    <Heart
                      size={20}
                      className={wishlistItems.some((item) => item.id === deal.id) ? "fill-rose-600 text-rose-600" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offer Banner */}
      <OfferBanner />

      {/* Categories Section */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books"].map((category) => (
            <Link href={`/category/${category.toLowerCase()}`} key={category}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="p-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-rose-100 rounded-full flex items-center justify-center">
                    <img src={`/placeholder.svg?height=40&width=40`} alt={category} className="w-8 h-8" />
                  </div>
                  <h3 className="font-medium text-gray-800">{category}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Popular Products</h2>
          <Link href="/products">
            <span className="text-rose-600 hover:text-rose-700 font-medium">View All</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              isInWishlist={wishlistItems.some((item) => item.id === product.id)}
            />
          ))}
        </div>
      </section>

      {/* Voice Shopping Feature */}
      <section className="container mx-auto px-4 mb-12 bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl overflow-hidden">
        <div className="py-12 px-6 md:px-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Shop with Your Voice</h2>
            <p className="text-white text-lg mb-6">
              Experience the future of shopping with our voice-enabled assistant. Just say what you're looking for, and
              we'll find it for you.
            </p>
            <button
              onClick={() => setIsVoiceActive(true)}
              className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors"
            >
              <Mic size={20} />
              <span>Try Voice Shopping</span>
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full animate-ping-slow"></div>
              <div className="absolute inset-4 bg-white bg-opacity-30 rounded-full animate-ping-slow animation-delay-300"></div>
              <div className="absolute inset-8 bg-white bg-opacity-40 rounded-full animate-ping-slow animation-delay-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Mic size={64} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">Stay updated with our latest offers, products, and deals.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
          <div className="grid grid-cols-12 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Infinity size="30" speed="2.5" color="#E11D48" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  // isInWishlist={wishlist.some(item => item._id === product._id)}
                />
              ))}
            </div>
          )}
        </div>
     

          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-700 transition-colors"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
