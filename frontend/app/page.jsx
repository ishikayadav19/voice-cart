"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "./components/navbar"
import ProductCard from "./components/ProductCard"
import Footer from "./components/footer";
import OfferBanner from "./components/offer-banner"
import VoiceAssistant from "./components/voice-assistant"
import axios from "axios"
import { Infinity } from "ldrs/react"
import "ldrs/react/Infinity.css"
import {
  ChevronLeft, ChevronRight, Heart, Mic, ShoppingCart, ArrowUp,
  Smartphone, Shirt, Home as HomeIcon, Sparkles, Trophy, BookOpen, Star
} from "lucide-react"
import CountdownTimer from "./components/CountdownTimer"
import { useShop } from '@/context/ShopContext';
import { BlurText } from "./components/AnimatedText";
import { motion, useScroll, useTransform } from "framer-motion";

// Banner slides - Giving them a luxury 3D perspective
const bannerSlides = [
  {
    id: 1,
    title: "The Royal Summer Collection",
    subtitle: "Experience luxury with up to 50% off selected premium items",
    image: "/summer.png?height=500&width=1200",
    buttonText: "Shop the Collection",
    link: "/sale",
  },
  {
    id: 2,
    title: "New Arrivals: The Future",
    subtitle: "Discover the latest cutting-edge designs",
    image: "/NewArrival.png?height=500&width=1200",
    buttonText: "Explore Now",
    link: "/new-arrivals",
  },
  {
    id: 3,
    title: "AI Voice Concierge",
    subtitle: "Try our exclusive voice shopping experience",
    image: "/voice.png?height=500&width=1200",
    buttonText: "Experience It",
    link: "/voice-shopping",
  },
]

export default function Home() {
  const { addToCart, addToWishlist, cart, wishlist } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [deals, setDeals] = useState([])
  const [dealEndTime] = useState(new Date().getTime() + 48 * 60 * 60 * 1000);
  const [popularProducts, setPopularProducts] = useState([])

  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1))
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1))

  const handleVoiceCommand = (command) => {
    if (command.includes("search")) {
      const searchTerm = command.replace("search", "").trim()
      setSearchQuery(searchTerm)
    } else if (command.includes("go to") || command.includes("navigate to")) {
      const destination = command.replace("go to", "").replace("navigate to", "").trim()
      const categoryMap = {
        electronics: "/category/electronics", fashion: "/category/fashion", home: "/category/home",
        beauty: "/category/beauty", sports: "/category/sports", books: "/category/books",
        cart: "/cart", wishlist: "/wishlist", login: "/login", signup: "/signup", contact: "/contact",
      }
      if (categoryMap[destination]) window.location.href = categoryMap[destination]
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`);
      setProducts(res.data);
      
      const filteredDeals = res.data.filter((product) => {
        const discountPercentage = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
        return discountPercentage > 40;
      });
      setDeals(filteredDeals);

      const filteredPopularProducts = res.data.filter((product) => product.rating >= 4 && product.rating <= 5);
      setPopularProducts(filteredPopularProducts);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#030014] text-white selection:bg-rose-500/30 overflow-x-hidden font-sans relative">
      {/* Deep 3D Floating Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ y: [0, -150, 0], x: [0, 50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-[10%] w-64 h-64 bg-rose-600/10 rounded-full blur-[100px]" />
        <motion.div animate={{ y: [0, 150, 0], x: [0, -50, 0], scale: [1, 1.5, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-[9999] w-full">
        <Navbar cartItems={cart} wishlistItems={wishlist} totalCartItems={cart.length} />
      </div>

      {/* Voice Assistant Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceAssistant isActive={isVoiceActive} setIsActive={setIsVoiceActive} onCommand={handleVoiceCommand} />
      </div>

      {/* Hero 3D Banner Slider */}
      <div className="relative overflow-hidden h-[85vh] perspective-1000">
        {/* Luxury Background Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerSlides.map((slide) => (
            <div key={slide.id} className="min-w-full h-full relative flex items-center justify-center">
              <motion.div
                initial={{ scale: 1.1, filter: "blur(10px)" }}
                animate={{ scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/60 via-[#030014]/40 to-[#030014] backdrop-blur-[2px]"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10 flex flex-col items-center justify-center text-center px-12 md:px-20 w-full"
              >
                <BlurText 
                  text={slide.title} 
                  className="text-4xl sm:text-5xl md:text-7xl font-serif font-light mb-4 md:mb-6 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-white drop-shadow-2xl leading-tight"
                />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-sm sm:text-lg md:text-2xl mb-8 md:mb-10 text-gray-300 max-w-2xl font-light tracking-wide leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
                <Link href={slide.link}>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(225,29,72,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-light tracking-[0.2em] uppercase text-sm rounded-full transition-all duration-300 hover:bg-white/10"
                  >
                    {slide.buttonText}
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>

        {/* 3D Glass Slider Controls */}
        <button
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-md border border-white/10 text-white p-2 md:p-4 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>
        <button
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-md border border-white/10 text-white p-2 md:p-4 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20"
          onClick={nextSlide}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* 3D Flash Deals Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col items-center">
            <BlurText text="Exclusive Flash Deals" className="text-4xl md:text-5xl font-serif font-light mb-4" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-[2000px]">
            {deals.slice(0, 4).map((deal, index) => (
              <motion.div
                key={deal._id}
                initial={{ opacity: 0, rotateY: 15, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.03, rotateY: 5, rotateX: -5, zIndex: 20, boxShadow: "0px 20px 40px rgba(225,29,72,0.2)" }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 transform-gpu preserve-3d"
              >
                <Link href={`/product/${deal._id}`}>
                  <div className="relative h-64 overflow-hidden bg-white/5 p-6">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={deal.mainImage || (deal.images && deal.images[0]) || "/placeholder.svg"}
                      alt={deal.name}
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-lg border border-white/20">
                      {Math.round((1 - deal.discountPrice / deal.price) * 100)}% OFF
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/product/${deal._id}`}>
                    <h3 className="text-lg font-medium mb-2 text-gray-200 group-hover:text-rose-400 transition-colors line-clamp-1">{deal.name}</h3>
                  </Link>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-serif text-white">&#8377;{deal.discountPrice.toFixed(2)}</span>
                    <span className="ml-3 text-sm line-through text-gray-500">&#8377;{deal.price.toFixed(2)}</span>
                  </div>

                  <div className="mb-6 bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Offer ends in</p>
                    <CountdownTimer endTime={dealEndTime} />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => addToCart(deal)}
                      className="flex-1 bg-white text-black hover:bg-gray-200 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => addToWishlist(deal)}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                      <Heart size={20} className={wishlist.some((item) => item._id === deal._id) ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Shopping 3D Feature */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#030014] to-[#030014]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-[#0a0515]/90 backdrop-blur-3xl border border-purple-500/30 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)] relative"
          >
            {/* Inner Glow Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-12 md:mb-0">
                <BlurText text="Command Elegance" className="text-4xl md:text-6xl font-serif font-light text-white mb-6" />
                <p className="text-gray-400 text-lg mb-8 font-light leading-relaxed max-w-lg">
                  Experience the pinnacle of luxury shopping. Simply speak your desires to our AI concierge, and watch as it curates the perfect selection instantly.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(225,29,72,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVoiceActive(true)}
                  className="px-8 py-4 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-light tracking-[0.2em] text-sm uppercase rounded-full flex items-center space-x-3 transition-all"
                >
                  <Mic size={20} />
                  <span>Activate Voice Concierge</span>
                </motion.button>
              </div>
              <div className="md:w-1/2 flex justify-center perspective-1000">
                <motion.div 
                  animate={{ rotateY: [0, 10, -10, 0], rotateX: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-80 h-80 flex items-center justify-center"
                >
                  <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 border border-rose-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-8 bg-gradient-to-br from-rose-600/20 to-purple-600/20 rounded-full blur-xl"></div>
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] relative z-10">
                    <Mic size={48} className="text-white" strokeWidth={1} />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Luxury Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex flex-col items-center">
            <BlurText text="Curated Departments" className="text-3xl md:text-4xl font-serif font-light mb-4" />
            <div className="h-px w-24 bg-white/20"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Electronics", slug: "electronics", icon: Smartphone },
              { name: "Fashion", slug: "fashion", icon: Shirt },
              { name: "Home", slug: "home", icon: HomeIcon },
              { name: "Beauty", slug: "beauty", icon: Sparkles },
              { name: "Sports", slug: "sports", icon: Trophy },
              { name: "Books", slug: "books", icon: BookOpen }
            ].map((category, i) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/category/${category.slug}`}>
                  <motion.div 
                    whileHover={{ y: -10, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-48 transition-colors group cursor-pointer"
                  >
                    <category.icon className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors mb-4" strokeWidth={1.5} />
                    <h3 className="font-light tracking-wider text-sm uppercase text-gray-300 group-hover:text-white">{category.name}</h3>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products with Splash Cards */}
      <section className="py-24 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex flex-col items-center">
            <BlurText text="Trending Now" className="text-4xl font-serif font-light mb-4" />
            <div className="h-px w-24 bg-white/20"></div>
          </div>

          {loading ? (
            <div className="flex justify-center h-64"><Infinity size="40" speed="2" color="#fff" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularProducts.slice(0, 4).map((product, index) => (
                <motion.div 
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
                >
                   {/* Wrapping original ProductCard to maintain its logic but injecting dark theme context if possible. 
                       Note: ProductCard itself might need styling updates separately to fully match dark mode. */}
                  <div className="p-2">
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                      onAddToWishlist={addToWishlist}
                      isInWishlist={wishlist.some(item => item._id === product._id)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* The Voice Cart Advantage */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-900/10 via-[#030014] to-[#030014]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16 flex flex-col items-center">
            <BlurText text="The Voice Cart Advantage" className="text-4xl font-serif font-light mb-4" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[2000px]">
            {[
              { title: "AI Precision", desc: "Our advanced voice recognition understands exactly what you desire.", icon: Mic },
              { title: "Curated Luxury", desc: "Every item is handpicked to ensure the highest standards of quality.", icon: Star },
              { title: "Secure & Swift", desc: "Experience seamless checkout with military-grade encryption.", icon: ShoppingCart }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.02, rotateY: 5, rotateX: 5, zIndex: 20, boxShadow: "0px 20px 40px rgba(168,85,247,0.15)" }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-10 flex flex-col items-center text-center group shadow-[0_10px_30px_rgba(0,0,0,0.3)] transform-gpu preserve-3d transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="text-rose-400 w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white mb-4 tracking-wide">{feature.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section className="py-16 border-y border-white/5 bg-white/[0.01] overflow-hidden flex flex-col items-center relative">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
        <p className="text-gray-500 uppercase tracking-[0.4em] text-xs mb-10">Recognized By Industry Leaders</p>
        <div className="relative w-full overflow-hidden flex">
          <div className="flex whitespace-nowrap opacity-40 space-x-24 md:space-x-48 px-12 animate-marquee w-max">
            {["VOGUE", "FORBES", "WIRED", "GQ", "TECHCRUNCH", "BLOOMBERG", "VOGUE", "FORBES", "WIRED", "GQ", "TECHCRUNCH", "BLOOMBERG"].map((brand, i) => (
              <span key={i} className="text-2xl md:text-4xl font-serif tracking-widest text-white inline-block">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials (Social Proof) */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-20 flex flex-col items-center text-center">
            <BlurText text="The Elite Experience" className="text-4xl md:text-5xl font-serif font-light mb-6" />
            <p className="text-gray-400 font-light tracking-wide max-w-xl mb-8">Discover what our most exclusive members are saying about the Voice Cart revolution.</p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 perspective-[2000px]">
            {[
              { name: "Elena R.", role: "Verified Member", text: "Voice Cart is a revolution. Simply asking for what I need and having it curated instantly feels like pure magic.", rating: 5 },
              { name: "James T.", role: "Tech Enthusiast", text: "The luxury aesthetic combined with cutting-edge AI is completely unmatched. Shopping has never been so elegant.", rating: 5 },
              { name: "Sophia M.", role: "Verified Member", text: "I've never experienced an interface this smooth. It understands my complex voice queries perfectly every single time.", rating: 5 }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.02, rotateY: -5, rotateX: 5, zIndex: 30, boxShadow: "0px 20px 40px rgba(225,29,72,0.15)" }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 relative group shadow-[0_10px_40px_rgba(0,0,0,0.4)] transform-gpu preserve-3d transition-all duration-500"
              >
                <div className="absolute top-0 right-10 -mt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white font-serif text-3xl shadow-[0_0_20px_rgba(225,29,72,0.4)] group-hover:rotate-12 transition-transform">
                    "
                  </div>
                </div>
                <div className="flex mb-8 text-rose-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 font-light leading-relaxed mb-10 italic text-lg">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-serif text-xl mr-5 border border-white/20">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-medium tracking-wide">{review.name}</h4>
                    <p className="text-gray-500 text-xs tracking-wider uppercase mt-1">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Join Elite */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-rose-900/10 to-[#030014]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0a0515]/80 backdrop-blur-3xl border border-rose-500/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_80px_rgba(225,29,72,0.15)] max-w-5xl mx-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"></div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-light text-white mb-6 relative z-10">Join The Elite</h2>
            <p className="text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light relative z-10">
              Subscribe to receive exclusive access to private sales, early arrivals, and personalized recommendations curated just for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-4 relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-black/50 border border-white/20 text-white px-8 py-5 rounded-full focus:outline-none focus:border-rose-500 transition-colors w-full text-lg placeholder-gray-500"
              />
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(225,29,72,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-10 py-5 rounded-full font-medium tracking-widest text-sm uppercase whitespace-nowrap hover:bg-gray-200 transition-all"
              >
                SUBSCRIBE
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
