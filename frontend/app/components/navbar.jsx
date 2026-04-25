"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Search, Mic, Menu, X, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useShop } from '@/context/ShopContext'
import { useAuth } from '@/context/AuthContext'

const Navbar = () => {
  const { cart } = useShop()
  const { profile, signOut } = useAuth()
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef(null)
  const router = useRouter()

  const isLoggedIn = !!profile;
  const isSeller = profile?.role === 'seller';
  const isAdmin = profile?.role === 'admin';


  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Handle voice search
  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = "en-US"
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsVoiceListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsVoiceListening(false)
        handleSearch(event, transcript)
      }

      recognition.onerror = () => {
        setIsVoiceListening(false)
      }

      recognition.onend = () => {
        setIsVoiceListening(false)
      }

      recognition.start()
    } else {
      alert("Voice recognition is not supported in your browser.")
    }
  }

  const handleSearch = (e, query = searchQuery) => {
    e?.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Open search with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      // Close search with Escape
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isSearchOpen])

  // Categories for the navbar
  const categories = [
    { name: "Electronics", path: "/category/electronics" },
    { name: "Fashion", path: "/category/fashion" },
    { name: "Home", path: "/category/home" },
    { name: "Beauty", path: "/category/beauty" },
    { name: "Sports", path: "/category/sports" },
    { name: "Books", path: "/category/books" },
  ]

  // Enhanced profile click logic for user/seller/admin context
  const handleProfileClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (isAdmin) {
      router.push('/admin/dashboard');
    } else if (isSeller) {
      router.push('/seller/dashboard');
    } else {
      router.push('/user/profile');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${isScrolled ? "bg-[#030014]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-purple-600">
                VoiceCart
              </span>
              <Mic className="ml-1 h-6 w-6 text-rose-600" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.path}
                className="text-gray-300 font-light tracking-widest text-xs uppercase hover:text-rose-400 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, Wishlist, Account */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block relative">
              <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 hover:bg-white/10 transition-colors">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none w-64 text-sm text-white placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="p-1 text-gray-500 hover:text-rose-600"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={`p-1 ${isVoiceListening ? "text-rose-600 animate-pulse" : "text-gray-500 hover:text-rose-600"}`}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-rose-400 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Search Popup */}
            {isSearchOpen && (
              <div className="lg:hidden fixed inset-0 bg-[#030014]/95 backdrop-blur-3xl z-50 p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-serif font-light text-white">Search</h2>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-gray-400 hover:text-rose-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-3">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="p-2 text-gray-400 hover:text-rose-400"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={`p-2 ${isVoiceListening ? "text-rose-500 animate-pulse drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]" : "text-gray-400 hover:text-rose-400"}`}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <div className="relative p-2 text-gray-300 hover:text-rose-400 transition-colors">
                <Heart className="h-5 w-5" />
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <div className="relative p-2 text-gray-300 hover:text-rose-400 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                    {totalCartItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Account */}
            <div className="hidden sm:block p-2 text-gray-300 hover:text-rose-400 transition-colors cursor-pointer" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
            </div>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 border border-rose-600 text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
              >
                Logout
              </button>
            )}

            {/* Login/Register Buttons */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center space-x-3 ml-2">
                <Link href="/login">
                  <span className="px-5 py-2.5 border border-white/20 bg-white/5 text-white font-light tracking-widest uppercase text-xs rounded-full hover:bg-white/10 transition-colors">
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-light tracking-widest uppercase text-xs rounded-full hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-300 hover:text-rose-400 transition-colors ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-6 border-t border-white/10 bg-[#030014]/95 backdrop-blur-3xl absolute left-0 right-0 px-6 shadow-2xl">
            <nav className="flex flex-col space-y-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.path}
                  className="text-gray-300 hover:text-white font-light tracking-widest text-sm uppercase transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-white/10 flex flex-col space-y-4">
                {isLoggedIn ? (
                  <>
                    <span className="block px-4 py-3 border border-white/20 bg-white/5 text-white rounded-full text-center hover:bg-white/10 transition-colors cursor-pointer tracking-widest text-xs uppercase" onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }}>
                      Profile
                    </span>
                    <span className="block px-4 py-3 border border-rose-500/50 bg-rose-500/10 text-rose-400 rounded-full text-center hover:bg-rose-500/20 transition-colors cursor-pointer tracking-widest text-xs uppercase" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                      Logout
                    </span>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="block px-4 py-3 border border-white/20 bg-white/5 text-white rounded-full text-center hover:bg-white/10 transition-colors tracking-widest text-xs uppercase">
                        Login
                      </span>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="block px-4 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full text-center hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-colors tracking-widest text-xs uppercase">
                        Sign Up
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
