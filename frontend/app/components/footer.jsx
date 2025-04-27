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
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-b border-gray-800 pb-12">
          <div className="flex flex-col items-center text-center">
            <Truck className="h-10 w-10 text-rose-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Free Shipping</h3>
            <p className="text-gray-400 text-sm">On orders over $50</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-10 w-10 text-rose-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Secure Payment</h3>
            <p className="text-gray-400 text-sm">100% secure payment</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CreditCard className="h-10 w-10 text-rose-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Easy Returns</h3>
            <p className="text-gray-400 text-sm">30 day return policy</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Clock className="h-10 w-10 text-rose-500 mb-3" />
            <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
            <p className="text-gray-400 text-sm">Customer support</p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">VoiceCart</h3>
            <p className="text-gray-400 mb-4">
              VoiceCart is a revolutionary e-commerce platform that combines traditional shopping with voice-enabled
              technology for a seamless shopping experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-rose-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-rose-500 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Commerce Street, Tech City, TC 12345, United States</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-rose-500 mr-2" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-rose-500 mr-2" />
                <span className="text-gray-400">support@voicecart.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <img src="/placeholder.svg?height=30&width=50" alt="Visa" className="h-8" />
            <img src="/placeholder.svg?height=30&width=50" alt="Mastercard" className="h-8" />
            <img src="/placeholder.svg?height=30&width=50" alt="American Express" className="h-8" />
            <img src="/placeholder.svg?height=30&width=50" alt="PayPal" className="h-8" />
            <img src="/placeholder.svg?height=30&width=50" alt="Apple Pay" className="h-8" />
            <img src="/placeholder.svg?height=30&width=50" alt="Google Pay" className="h-8" />
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} VoiceCart. All rights reserved.</p>
            <p className="mt-1">Designed and developed with ❤️ for a better shopping experience.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
