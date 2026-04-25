import Link from "next/link"

import {
  
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react"

const Footer = () => {
  return (
    <footer className="relative bg-[#030014] text-white pt-16 pb-8 border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-white/10 pb-16">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
              <Truck className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1">Free Shipping</h3>
            <p className="text-gray-400 font-light text-sm">On elite orders over $50</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
              <ShieldCheck className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1">Secure Payment</h3>
            <p className="text-gray-400 font-light text-sm">Military-grade encryption</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
              <CreditCard className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1">Easy Returns</h3>
            <p className="text-gray-400 font-light text-sm">30-day effortless returns</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-white/10 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
              <Clock className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1">24/7 Concierge</h3>
            <p className="text-gray-400 font-light text-sm">Premium AI support</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-3xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                VoiceCart
              </span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              The pinnacle of luxury e-commerce. Experience seamless, voice-activated shopping powered by cutting-edge artificial intelligence.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-light tracking-wide mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-serif font-light tracking-wide mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 font-light hover:text-rose-400 transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-rose-500 mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-light tracking-wide mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-rose-500 mr-3 mt-0.5" strokeWidth={1.5} />
                <span className="text-gray-400 font-light">123 Commerce Street, Tech City, TC 12345, United States</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-rose-500 mr-3" strokeWidth={1.5} />
                <span className="text-gray-400 font-light">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-rose-500 mr-3" strokeWidth={1.5} />
                <span className="text-gray-400 font-light">support@voicecart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-8 pb-4 flex flex-col md:flex-row items-center justify-center">
          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm font-light">
            <p>&copy; {new Date().getFullYear()} VoiceCart. All rights reserved.</p>
            <p className="mt-1">Designed for the elite shopping experience.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
