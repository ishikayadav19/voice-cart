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

  // Handle voice search. The global VoiceAssistant also owns a recognition
  // instance; Chrome only allows ONE active mic stream at a time, so we must
  // release the global one before starting our own — otherwise both abort.
  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      window.dispatchEvent(new CustomEvent('voice:deactivate'));

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

      // Small delay so the global recognition has time to release the mic stream
      setTimeout(() => {
        try { recognition.start(); }
        catch (e) { setIsVoiceListening(false); console.error('navbar mic start failed:', e); }
      }, 200);
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
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${isScrolled ? "bg-white/95 backdrop-blur-2xl border-b border-[#E5E0D8] shadow-sm py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center w-full sm:w-auto flex-shrink-0">
              <span className="text-3xl font-bold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6]">
                VoiceCart
              </span>
              <Mic className="ml-1 h-6 w-6 flex-shrink-0 text-[#D4AF37]" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.path}
                onClick={(e) => { e.preventDefault(); router.push(category.path); }}
                className="font-bold tracking-[0.15em] text-sm uppercase transition-colors text-[#1A1A1A] hover:text-[#D4AF37]"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, Wishlist, Account */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block relative">
              <form onSubmit={handleSearch} className={`flex items-center border backdrop-blur-md rounded-full px-4 py-2 transition-colors ${isScrolled ? "bg-white border-[#E5E0D8] hover:bg-[#FAF9F6]" : "bg-white/40 border-white/50 shadow-sm hover:bg-white/60"}`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none w-64 text-sm text-[#1A1A1A] placeholder-[#7A7571]"
                />
                <button
                  type="submit"
                  className="p-1 text-[#1A1A1A] hover:text-[#D4AF37]"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={`p-1 ${isVoiceListening ? "text-[#D4AF37] animate-pulse" : "text-[#1A1A1A] hover:text-[#D4AF37]"}`}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 transition-colors text-[#1A1A1A] hover:text-[#D4AF37]"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Search Popup */}
            {isSearchOpen && (
              <div className="lg:hidden fixed inset-0 bg-[#FDFBF7]/95 backdrop-blur-3xl z-50 p-4 border-b border-[#E5E0D8]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-serif font-light text-[#1A1A1A]">Search</h2>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-[#5C5C5C] hover:text-[#D4AF37]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSearch} className="flex items-center bg-white border border-[#E5E0D8] rounded-full px-4 py-3 shadow-sm">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent border-none outline-none text-[#1A1A1A] placeholder-[#7A7571]"
                  />
                  <button
                    type="submit"
                    className="p-2 text-[#5C5C5C] hover:text-[#D4AF37]"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={`p-2 ${isVoiceListening ? "text-[#D4AF37] animate-pulse drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "text-[#5C5C5C] hover:text-[#D4AF37]"}`}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <div className="relative p-2 transition-colors text-[#1A1A1A] hover:text-[#D4AF37]">
                <Heart className="h-5 w-5" />
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <div className="relative p-2 transition-colors text-[#1A1A1A] hover:text-[#D4AF37]">
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                    {totalCartItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Account */}
            <div className="hidden sm:block p-2 transition-colors cursor-pointer text-[#1A1A1A] hover:text-[#D4AF37]" onClick={handleProfileClick}>
              <User className="h-5 w-5" />
            </div>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-md hover:bg-[#FAF9F6] transition-colors"
              >
                Logout
              </button>
            )}

            {/* Login/Register Buttons */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center space-x-3 ml-2">
                <Link href="/login">
                  <span className={`px-5 py-2.5 border font-bold tracking-[0.15em] uppercase text-xs rounded-full transition-colors ${isScrolled ? "bg-white border-[#E5E0D8] text-[#1A1A1A] hover:bg-[#FAF9F6]" : "border-white/50 bg-white/40 shadow-sm text-[#1A1A1A] hover:bg-white/60"}`}>
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6] text-white font-bold tracking-[0.15em] uppercase text-xs rounded-full hover:shadow-md transition-all">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 transition-colors ml-2 text-[#1A1A1A] hover:text-[#D4AF37]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-6 border-t border-[#E5E0D8] bg-[#FDFBF7]/95 backdrop-blur-3xl absolute left-0 right-0 px-6 shadow-md overflow-y-auto max-h-screen">
            <nav className="flex flex-col space-y-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.path}
                  className="text-[#1A1A1A] hover:text-[#D4AF37] font-medium tracking-widest text-sm uppercase transition-colors"
                  onClick={(e) => { e.preventDefault(); router.push(category.path); setIsMobileMenuOpen(false); }}
                >
                  {category.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-[#E5E0D8] flex flex-col space-y-4">
                {isLoggedIn ? (
                  <>
                    <span className="block px-4 py-3 border border-[#E5E0D8] bg-white text-[#1A1A1A] rounded-full text-center hover:bg-[#FAF9F6] transition-colors cursor-pointer tracking-widest text-xs uppercase" onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }}>
                      Profile
                    </span>
                    <span className="block px-4 py-3 border border-[#E5E0D8] bg-[#FAF9F6] text-[#1A1A1A] rounded-full text-center hover:bg-[#E5E0D8] transition-colors cursor-pointer tracking-widest text-xs uppercase" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                      Logout
                    </span>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="block px-4 py-3 border border-[#E5E0D8] bg-white text-[#1A1A1A] rounded-full text-center hover:bg-[#FAF9F6] transition-colors tracking-widest text-xs uppercase">
                        Login
                      </span>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="block px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6] text-white rounded-full text-center hover:shadow-sm transition-colors tracking-widest text-xs uppercase">
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
