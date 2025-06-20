"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Search, Mic, Menu, X, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useShop } from '@/context/ShopContext'

const Navbar = () => {
  const { cart } = useShop()
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef(null)
  const router = useRouter()

  // Auth state for user and seller
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [isLoggedInSeller, setIsLoggedInSeller] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken');
    const sellerToken = localStorage.getItem('sellerToken') || sessionStorage.getItem('sellerToken');
    setIsLoggedInUser(!!userToken);
    setIsLoggedInSeller(!!sellerToken);
  }, []);

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

  // Enhanced profile click logic for user/seller context
  const handleProfileClick = () => {
    if (isLoggedInUser) {
      router.push('/user/profile');
    } else if (isLoggedInSeller) {
      router.push('/seller/profile');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usertoken');
    sessionStorage.removeItem('usertoken');
    localStorage.removeItem('sellerToken');
    sessionStorage.removeItem('sellerToken');
    router.push('/');
    // Optionally, reload the page to reset state
    // window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
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
                className="text-black font-bold hover:text-rose-600 font-medium transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, Wishlist, Account */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block relative">
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none w-64 text-sm"
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
              className="lg:hidden p-2 text-black font-bold hover:text-rose-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Search Popup */}
            {isSearchOpen && (
              <div className="lg:hidden fixed inset-0 bg-white z-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Search</h2>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-gray-500 hover:text-rose-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent border-none outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 text-gray-500 hover:text-rose-600"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={`p-2 ${isVoiceListening ? "text-rose-600 animate-pulse" : "text-gray-500 hover:text-rose-600"}`}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <div className="relative p-2 text-black hover:text-rose-600 transition-colors">
                <Heart className="h-5 w-5" />
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <div className="relative p-2 text-black hover:text-rose-600 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Account */}
            <div className="hidden sm:block p-2 text-black hover:text-rose-600 transition-colors cursor-pointer" onClick={handleProfileClick}>
                <User className="h-5 w-5" />
              </div>

            {(isLoggedInUser || isLoggedInSeller) && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 border border-rose-600 text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
              >
                Logout
              </button>
            )}

            {/* Login/Register Buttons */}
            {!(isLoggedInUser || isLoggedInSeller) && (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <span className="px-4 py-2 border border-rose-600 text-rose-600 rounded-md hover:bg-rose-50 transition-colors">
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.path}
                  className="text-gray-700 hover:text-rose-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <div className="pt-4 border-t flex flex-col space-y-2">
                <span className="block px-4 py-2 border border-rose-600 text-rose-600 rounded-md text-center hover:bg-rose-50 transition-colors cursor-pointer" onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }}>
                  Profile
                  </span>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="block px-4 py-2 bg-rose-600 text-white rounded-md text-center hover:bg-rose-700 transition-colors">
                    Sign Up
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
