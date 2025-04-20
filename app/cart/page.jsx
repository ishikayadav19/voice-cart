"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Truck } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

// Sample cart items
const initialCartItems = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 199.99,
    discountPrice: 149.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 1,
  },
  {
    id: 7,
    name: "Designer Denim Jeans",
    price: 79.99,
    discountPrice: 59.99,
    image: "/placeholder.svg?height=80&width=80",
    quantity: 2,
  },
]

const CartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.discountPrice || item.price) * item.quantity
    }, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateShipping = () => {
    return calculateSubtotal() > 100 ? 0 : 10 // Free shipping over $100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping() - promoDiscount
  }

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Apply promo code
  const applyPromoCode = () => {
    // In a real app, this would validate the promo code with the backend
    if (promoCode.toUpperCase() === "SAVE20") {
      const discount = calculateSubtotal() * 0.2 // 20% off
      setPromoDiscount(discount)
      setPromoApplied(true)
    } else {
      setPromoApplied(false)
      setPromoDiscount(0)
      alert("Invalid promo code")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItems={cartItems} />

      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Cart Items ({cartItems.length})</h2>

                    <div className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-6 flex flex-col sm:flex-row">
                          <div className="flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full sm:w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-1">{item.name}</h3>
                                <div className="flex items-center mb-4">
                                  <span className="text-lg font-bold text-rose-600 mr-2">
                                    ${(item.discountPrice || item.price).toFixed(2)}
                                  </span>
                                  {item.discountPrice && (
                                    <span className="text-sm line-through text-gray-500">${item.price.toFixed(2)}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="ml-4 text-gray-500 hover:text-red-500"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 text-right">
                              <span className="text-gray-600">
                                Subtotal: ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="flex justify-between items-center">
                  <Link href="/products">
                    <span className="flex items-center text-rose-600 hover:text-rose-700 font-medium">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Continue Shopping
                    </span>
                  </Link>
                  <button onClick={() => setCartItems([])} className="text-gray-600 hover:text-gray-800">
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800 font-medium">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (8%)</span>
                        <span className="text-gray-800 font-medium">${calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-800 font-medium">
                          {calculateShipping() === 0 ? "Free" : `$${calculateShipping().toFixed(2)}`}
                        </span>
                      </div>

                      {promoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo Discount</span>
                          <span>-${promoDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-800">Total</span>
                          <span className="text-xl font-bold text-rose-600">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="mt-6">
                      <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                        Promo Code
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="promo"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Try "SAVE20" for 20% off</p>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-6">
                      <Link href="/checkout">
                        <span className="block w-full px-4 py-3 bg-rose-600 text-white text-center font-medium rounded-md hover:bg-rose-700 transition-colors">
                          Proceed to Checkout
                        </span>
                      </Link>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-2">We Accept:</p>
                      <div className="flex space-x-2">
                        <img src="/placeholder.svg?height=30&width=40" alt="Visa" className="h-8" />
                        <img src="/placeholder.svg?height=30&width=40" alt="Mastercard" className="h-8" />
                        <img src="/placeholder.svg?height=30&width=40" alt="Amex" className="h-8" />
                        <img src="/placeholder.svg?height=30&width=40" alt="PayPal" className="h-8" />
                      </div>
                    </div>

                    {/* Shipping & Returns */}
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start">
                        <Truck className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Free Shipping</h3>
                          <p className="text-xs text-gray-500">On orders over $100</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Secure Payment</h3>
                          <p className="text-xs text-gray-500">Your data is protected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/products">
                <span className="inline-flex items-center px-6 py-3 bg-rose-600 text-white font-medium rounded-md hover:bg-rose-700 transition-colors">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CartPage
