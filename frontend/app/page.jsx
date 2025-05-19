"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
// import { ShoppingCart, Heart, Mic, ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "./components/navbar"
import ProductCard from "./components/ProductCard"
import Footer from "./components/footer";

import OfferBanner from "./components/offer-banner"
import VoiceAssistant from "./components/voice-assistant"
import axios from "axios"
import { Infinity } from "ldrs/react"
import "ldrs/react/Infinity.css"
import { ChevronLeft, ChevronRight, Heart, Mic, ShoppingCart, ArrowUp, 
  Smartphone, Shirt, Home as HomeIcon, Sparkles, Trophy, BookOpen } from "lucide-react"
import CountdownTimer from "./components/CountdownTimer"
import { useShop } from '@/context/ShopContext';
import SectionHeading from './components/SectionHeading';




// Banner slides
const bannerSlides = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 50% off on selected items",
    image: "/summer.png?height=500&width=1200",
    buttonText: "Shop Now",
    link: "/sale",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Check out our latest collection",
    image: "/NewArrival.png?height=500&width=1200",
    buttonText: "Explore",
    link: "/new-arrivals",
  },
  {
    id: 3,
    title: "Voice Shopping",
    subtitle: "Try our new voice shopping experience",
    image: "/voice.png?height=500&width=1200",
    buttonText: "Learn More",
    link: "/voice-shopping",
  },
]

export default function Home() {
  const { addToCart, addToWishlist, cart, wishlist } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [deals, setDeals] = useState([])
  const [dealEndTime] = useState(new Date().getTime() + 48 * 60 * 60 * 1000); // 48 hours from now
  const [popularProducts, setPopularProducts] = useState([])
  const [showBackToTop, setShowBackToTop] = useState(false)

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

  useEffect(() => {
    // Filter products with more than 50% discount
    const filteredDeals = products.filter((product) => {
      const discountPercentage = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
      return discountPercentage > 40;
    });
    setDeals(filteredDeals);

    // Filter products with rating between 4 and 5
    const filteredPopularProducts = products.filter(
      (product) => product.rating >= 4 && product.rating <= 5
    );
    setPopularProducts(filteredPopularProducts);
  }, [products]);

  // Add scroll event listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        cartItems={cart} 
        wishlistItems={wishlist} 
        totalCartItems={cart.length}
      />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-rose-600 text-white p-3 rounded-full shadow-lg hover:bg-rose-700 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Voice Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceAssistant isActive={isVoiceActive} setIsActive={setIsVoiceActive} onCommand={handleVoiceCommand} />
      </div>

      {/* Hero Banner Slider */}
      <div className="relative overflow-hidden h-[500px] mb-8">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative">
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 hover:scale-105" 
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center transform transition-all duration-500 hover:scale-105">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl transform transition-all duration-500 hover:scale-105">{slide.subtitle}</p>
                <Link href={slide.link}>
                  <span className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    {slide.buttonText}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Slider Controls */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 transform hover:scale-110"
          onClick={prevSlide}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 transform hover:scale-110"
          onClick={nextSlide}
        >
          <ChevronRight size={24} />
        </button>

        {/* Enhanced Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white bg-opacity-50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Featured Deals Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Flash Deals"
            subtitle="Limited time offers with amazing discounts"
            colors={["#E11D48", "#7C3AED", "#E11D48"]}
            animationSpeed={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <div
                key={deal._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Link href={`/product/${deal._id}`}>
                  <div className="relative">
                    <img 
                      src={deal.mainImage || (deal.images && deal.images[0]) || "/placeholder.svg"} 
                      alt={deal.name} 
                      className="w-full h-64 object-contain p-4 bg-white" 
                    />
                    <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md font-bold">
                      {Math.round((1 - deal.discountPrice / deal.price) * 100)}% OFF
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${deal._id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-rose-600 transition-colors">{deal.name}</h3>
                  </Link>
                  <div className="flex items-center mb-3">
                    <span className="text-xl font-bold text-rose-600">&#8377;{deal.discountPrice.toFixed(2)}</span>
                    <span className="ml-2 text-sm line-through text-gray-500">&#8377;{deal.price.toFixed(2)}</span>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Offer ends in:</p>
                    <CountdownTimer endTime={dealEndTime} />
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
                        className={wishlist.some((item) => item._id === deal._id) ? "fill-rose-600 text-rose-600" : ""}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <OfferBanner />

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Shop by Category"
            subtitle="Browse through our wide range of categories"
            colors={["#059669", "#2563EB", "#059669"]}
            animationSpeed={3.5}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", slug: "electronics", icon: Smartphone },
              { name: "Fashion", slug: "fashion", icon: Shirt },
              { name: "Home", slug: "home", icon: HomeIcon },
              { name: "Beauty", slug: "beauty", icon: Sparkles },
              { name: "Sports", slug: "sports", icon: Trophy },
              { name: "Books", slug: "books", icon: BookOpen }
            ].map((category) => (
              <Link href={`/category/${category.slug}`} key={category.slug}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="p-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-rose-100 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                      <category.icon className="w-8 h-8 text-rose-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 transform transition-all duration-300 hover:scale-105">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Popular Products"
            subtitle="Most loved items by our customers"
            colors={["#2563EB", "#7C3AED", "#2563EB"]}
            animationSpeed={4}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                isInWishlist={wishlist.some((item) => item._id === product._id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Voice Shopping Feature */}
      <section className="container mx-auto px-4 mb-12 bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="py-12 px-6 md:px-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 transform transition-all duration-300 hover:scale-105">Shop with Your Voice</h2>
            <p className="text-white text-lg mb-6 transform transition-all duration-300 hover:scale-105">
              Experience the future of shopping with our voice-enabled assistant. Just say what you're looking for, and
              we'll find it for you.
            </p>
            <button
              onClick={() => setIsVoiceActive(true)}
              className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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
                <Mic size={64} className="text-white transform transition-all duration-300 hover:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="bg-gray-100 rounded-xl p-8 md:p-12 transform transition-all duration-300 hover:shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 transform transition-all duration-300 hover:scale-105">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6 transform transition-all duration-300 hover:scale-105">Stay updated with our latest offers, products, and deals.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <main className="flex-1 px-4 py-16">
        <div className="max-w-7xl mx-auto">
        <SectionHeading
            title="Featured Products"
            
            colors={["#E11D48", "#7C3AED", "#E11D48"]}
            animationSpeed={3}
          />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Infinity size="30" speed="2.5" color="#E11D48" />
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0,4).map((product) => (
                <div key={product._id} className="transform transition-all duration-300 hover:scale-105">
                  <ProductCard 
                    product={product}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                    isInWishlist={wishlist.some(item => item._id === product._id)}
                  />
                </div>
              ))}
            </div>
             <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-rose-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              View All Products
            </Link>
          </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
