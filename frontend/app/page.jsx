"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "./components/navbar"
import ProductCard from "./components/ProductCard"
import Footer from "./components/footer";
import OfferBanner from "./components/offer-banner"
import VoiceAssistant from "./components/voice-assistant"
import SignatureShowcase from "./components/SignatureShowcase"
import CuratedCollections from "./components/CuratedCollections"
import MembershipTier from "./components/MembershipTier"
import EcosystemIntegration from "./components/EcosystemIntegration"
import LuxuryFAQ from "./components/LuxuryFAQ"
import AIExperience from "./components/AIExperience"
import CuratedDepartments from "./components/CuratedDepartments"
import BrandPhilosophy from "./components/BrandPhilosophy"
import { ShinyText } from "./components/ShinyText"
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
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Shop the Collection",
    link: "/products",
  },
  {
    id: 2,
    title: "New Arrivals: The Future",
    subtitle: "Discover the latest cutting-edge designs",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Now",
    link: "/category/fashion",
  },
  {
    id: 3,
    title: "AI Voice Concierge",
    subtitle: "Try our exclusive voice shopping experience",
    image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Experience It",
    link: "/products",
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A] selection:bg-[#E6B9A6]/40 overflow-x-hidden font-sans relative">
      {/* Deep 3D Floating Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ y: [0, -150, 0], x: [0, 50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-[10%] w-64 h-64 bg-[#E6B9A6]/30 rounded-full blur-[100px]" />
        <motion.div animate={{ y: [0, 150, 0], x: [0, -50, 0], scale: [1, 1.5, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[120px]" />
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E6B9A6]/20 blur-[120px] rounded-full pointer-events-none" />

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
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-[#FAF9F6]"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10 flex flex-col items-center justify-center text-center px-12 md:px-20 w-full"
              >
                <BlurText 
                  text={slide.title} 
                  className="text-4xl sm:text-5xl md:text-7xl font-serif font-light mb-4 md:mb-6 tracking-wider text-[#1A1A1A] drop-shadow-xl leading-tight"
                />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-sm sm:text-lg md:text-2xl mb-8 md:mb-10 text-[#5C5C5C] max-w-2xl font-light tracking-wide leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
                <Link href={slide.link}>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(212,175,55,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-[#1A1A1A] text-white font-light tracking-[0.2em] uppercase text-sm rounded-full transition-all duration-300 hover:bg-[#D4AF37]"
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
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md border border-[#E5E0D8] text-[#1A1A1A] p-2 md:p-4 rounded-full hover:bg-[#FDFBF7] hover:text-[#D4AF37] transition-all duration-300 hover:scale-110 shadow-md z-20"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>
        <button
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md border border-[#E5E0D8] text-[#1A1A1A] p-2 md:p-4 rounded-full hover:bg-[#FDFBF7] hover:text-[#D4AF37] transition-all duration-300 hover:scale-110 shadow-md z-20"
          onClick={nextSlide}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* 3D Flash Deals Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col items-center">
            <ShinyText text="Exclusive Flash Deals" className="text-3xl md:text-5xl font-serif font-light mb-4 drop-shadow-sm text-[#1A1A1A]" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-[2000px]">
            {deals.slice(0, 4).map((deal, index) => (
              <motion.div
                key={deal._id}
                initial={{ opacity: 0, rotateY: 15, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.03, rotateY: 5, rotateX: -5, zIndex: 20, boxShadow: "0px 20px 40px rgba(212,175,55,0.15)" }}
                className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden group shadow-sm transition-all duration-500 transform-gpu preserve-3d"
              >
                <Link href={`/product/${deal._id}`}>
                  <div className="relative h-64 overflow-hidden bg-[#FDFBF7] p-6">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={deal.mainImage || (deal.images && deal.images[0]) || "/placeholder.svg"}
                      alt={deal.name}
                      className="w-full h-full object-contain filter drop-shadow-md mix-blend-multiply"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6] text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-sm border border-white/40">
                      {Math.round((1 - deal.discountPrice / deal.price) * 100)}% OFF
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/product/${deal._id}`}>
                    <h3 className="text-lg font-medium mb-2 text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors line-clamp-1">{deal.name}</h3>
                  </Link>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-serif text-[#1A1A1A]">&#8377;{deal.discountPrice.toFixed(2)}</span>
                    <span className="ml-3 text-sm line-through text-[#7A7571]">&#8377;{deal.price.toFixed(2)}</span>
                  </div>

                  <div className="mb-6 bg-[#FAF9F6] rounded-lg p-3 border border-[#E5E0D8]">
                    <p className="text-xs text-[#5C5C5C] mb-1 uppercase tracking-wider">Offer ends in</p>
                    <CountdownTimer endTime={dealEndTime} />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => addToCart(deal)}
                      className="flex-1 bg-[#1A1A1A] text-white hover:bg-[#D4AF37] py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => addToWishlist(deal)}
                      className="p-3 bg-white hover:bg-[#FDFBF7] border border-[#E5E0D8] rounded-xl transition-colors shadow-sm"
                    >
                      <Heart size={20} className={wishlist.some((item) => item._id === deal._id) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#7A7571]"} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BrandPhilosophy />
      <AIExperience />
      <CuratedDepartments />

      {/* Voice Shopping 3D Feature */}
      <section className="py-32 relative overflow-hidden bg-[#FDFBF7]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-[#FDFBF7] to-[#FDFBF7]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-3xl border border-[#D4AF37]/30 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.15)] relative"
          >
            {/* Inner Glow Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E6B9A6]/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            <div className="py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-12 md:mb-0">
                <ShinyText text="Command Elegance" className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] drop-shadow-sm mb-6" />
                <p className="text-[#5C5C5C] text-lg mb-8 font-light leading-relaxed max-w-lg">
                  Experience the pinnacle of luxury shopping. Simply speak your desires to our AI concierge, and watch as it curates the perfect selection instantly.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(212,175,55,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVoiceActive(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6] text-white font-medium tracking-[0.2em] text-sm uppercase rounded-full flex items-center space-x-3 transition-all"
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
                  <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 border border-[#E6B9A6]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-8 bg-gradient-to-br from-[#D4AF37]/20 to-[#E6B9A6]/20 rounded-full blur-xl"></div>
                  <div className="w-32 h-32 bg-white backdrop-blur-xl border border-[#E5E0D8] rounded-full flex items-center justify-center shadow-md relative z-10">
                    <Mic size={48} className="text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SignatureShowcase />

      {/* Popular Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex flex-col items-center text-center">
            <ShinyText text="Trending Now" className="text-3xl md:text-5xl font-serif font-light mb-4 drop-shadow-sm text-[#1A1A1A]" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          </div>

          {loading ? (
            <div className="flex justify-center h-64"><Infinity size="40" speed="2" color="#D4AF37" /></div>
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
                  className="bg-[#FDFBF7] rounded-2xl border border-[#E5E0D8] overflow-hidden shadow-sm"
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
      <section className="py-24 relative overflow-hidden bg-[#FAF9F6]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E6B9A6]/10 via-[#FAF9F6] to-[#FAF9F6]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16 flex flex-col items-center text-center">
            <ShinyText text="The Voice Cart Advantage" className="text-3xl md:text-5xl font-serif font-light mb-4 drop-shadow-sm text-[#1A1A1A]" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
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
                whileHover={{ y: -10, scale: 1.02, rotateY: 5, rotateX: 5, zIndex: 20, boxShadow: "0px 20px 40px rgba(212,175,55,0.15)" }}
                className="bg-white border border-[#E5E0D8] rounded-2xl p-10 flex flex-col items-center text-center group shadow-sm transform-gpu preserve-3d transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E6B9A6]/30 to-[#D4AF37]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="text-[#D4AF37] w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-[#1A1A1A] mb-4 tracking-wide">{feature.title}</h3>
                <p className="text-[#5C5C5C] font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MembershipTier />
      <EcosystemIntegration />

      {/* Trusted By Marquee */}
      <section className="py-16 border-y border-[#E5E0D8] bg-[#FDFBF7] overflow-hidden flex flex-col items-center relative">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
        <p className="text-[#5C5C5C] uppercase tracking-[0.4em] text-xs mb-10">Recognized By Industry Leaders</p>
        <div className="relative w-full overflow-hidden flex">
          <div className="flex whitespace-nowrap opacity-50 space-x-24 md:space-x-48 px-12 animate-marquee w-max">
            {["VOGUE", "FORBES", "WIRED", "GQ", "TECHCRUNCH", "BLOOMBERG", "VOGUE", "FORBES", "WIRED", "GQ", "TECHCRUNCH", "BLOOMBERG"].map((brand, i) => (
              <span key={i} className="text-2xl md:text-4xl font-serif tracking-widest text-[#1A1A1A] inline-block">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CuratedCollections />

      {/* Client Testimonials (Social Proof) */}
      <section className="py-32 relative overflow-hidden bg-[#FAF9F6]">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#E6B9A6]/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#D4AF37]/20 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-20 flex flex-col items-center text-center">
            <ShinyText text="The Elite Experience" className="text-3xl md:text-5xl font-serif font-light mb-6 drop-shadow-sm text-[#1A1A1A]" />
            <p className="text-[#5C5C5C] font-light tracking-wide max-w-xl mb-8">Discover what our most exclusive members are saying about the Voice Cart revolution.</p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
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
                whileHover={{ y: -10, scale: 1.02, rotateY: -5, rotateX: 5, zIndex: 30, boxShadow: "0px 20px 40px rgba(212,175,55,0.15)" }}
                className="bg-white border border-[#E5E0D8] rounded-3xl p-10 relative group shadow-sm transform-gpu preserve-3d transition-all duration-500"
              >
                <div className="absolute top-0 right-10 -mt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E6B9A6] to-[#D4AF37] flex items-center justify-center text-white font-serif text-3xl shadow-sm group-hover:rotate-12 transition-transform">
                    "
                  </div>
                </div>
                <div className="flex mb-8 text-[#D4AF37]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-[#1A1A1A] font-light leading-relaxed mb-10 italic text-lg">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#1A1A1A] font-serif text-xl mr-5 border border-[#E5E0D8]">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="text-[#1A1A1A] font-medium tracking-wide">{review.name}</h4>
                    <p className="text-[#7A7571] text-xs tracking-wider uppercase mt-1">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LuxuryFAQ />

      {/* Newsletter / Join Elite */}
      <section className="py-32 relative bg-[#FAF9F6]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E6B9A6]/10 via-[#FAF9F6] to-[#FAF9F6]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#FDFBF7]/90 backdrop-blur-3xl border border-[#D4AF37]/30 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.15)] max-w-5xl mx-auto"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E6B9A6]/20 rounded-full blur-[80px]"></div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[#1A1A1A] mb-6 relative z-10">Join The Elite</h2>
            <p className="text-[#5C5C5C] text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light relative z-10">
              Subscribe to receive exclusive access to private sales, early arrivals, and personalized recommendations curated just for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-4 relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-white/50 border border-[#E5E0D8] text-[#1A1A1A] px-8 py-5 rounded-full focus:outline-none focus:border-[#D4AF37] transition-colors w-full text-lg placeholder-[#7A7571]"
              />
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(212,175,55,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#1A1A1A] text-white px-10 py-5 rounded-full font-medium tracking-widest text-sm uppercase whitespace-nowrap hover:bg-[#D4AF37] transition-all"
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
