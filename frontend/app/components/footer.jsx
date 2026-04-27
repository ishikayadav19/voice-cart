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
    <footer className="relative bg-[#FAF9F6] text-[#1A1A1A] pt-16 pb-8 border-t border-[#E5E0D8] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E6B9A6]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-b border-[#E5E0D8] pb-16">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-[#E5E0D8] shadow-sm">
              <Truck className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1 text-[#1A1A1A]">Free Shipping</h3>
            <p className="text-[#7A7571] font-light text-sm">On elite orders over $50</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-[#E5E0D8] shadow-sm">
              <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1 text-[#1A1A1A]">Secure Payment</h3>
            <p className="text-[#7A7571] font-light text-sm">Military-grade encryption</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-[#E5E0D8] shadow-sm">
              <CreditCard className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1 text-[#1A1A1A]">Easy Returns</h3>
            <p className="text-[#7A7571] font-light text-sm">30-day effortless returns</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-[#E5E0D8] shadow-sm">
              <Clock className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="font-medium tracking-wide text-lg mb-1 text-[#1A1A1A]">24/7 Concierge</h3>
            <p className="text-[#7A7571] font-light text-sm">Premium AI support</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-3xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6] drop-shadow-sm">
                VoiceCart
              </span>
            </div>
            <p className="text-[#5C5C5C] font-light leading-relaxed mb-6">
              The pinnacle of luxury e-commerce. Experience seamless, voice-activated shopping powered by cutting-edge artificial intelligence.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#7A7571] hover:text-[#D4AF37] hover:bg-[#FDFBF7] hover:border-[#D4AF37]/30 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#7A7571] hover:text-[#D4AF37] hover:bg-[#FDFBF7] hover:border-[#D4AF37]/30 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#7A7571] hover:text-[#D4AF37] hover:bg-[#FDFBF7] hover:border-[#D4AF37]/30 transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-light tracking-wide mb-6 text-[#1A1A1A]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-serif font-light tracking-wide mb-6 text-[#1A1A1A]">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#5C5C5C] font-light hover:text-[#D4AF37] transition-colors flex items-center">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-light tracking-wide mb-6 text-[#1A1A1A]">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#D4AF37] mr-3 mt-0.5" strokeWidth={1.5} />
                <span className="text-[#5C5C5C] font-light">123 Commerce Street, Tech City, TC 12345, United States</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#D4AF37] mr-3" strokeWidth={1.5} />
                <span className="text-[#5C5C5C] font-light">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#D4AF37] mr-3" strokeWidth={1.5} />
                <span className="text-[#5C5C5C] font-light">support@voicecart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-[#E5E0D8] pt-8 pb-4 flex flex-col md:flex-row items-center justify-center">
          {/* Copyright */}
          <div className="text-center text-[#7A7571] text-sm font-light">
            <p>&copy; {new Date().getFullYear()} VoiceCart. All rights reserved.</p>
            <p className="mt-1">Designed for the elite shopping experience.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
