"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Truck } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import { useShop } from '@/context/ShopContext'
import SectionHeading from '@/app/components/SectionHeading'

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity } = useShop()
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  useEffect(() => {
    setLoading(false)
  }, [])

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
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
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    updateCartQuantity(productId, newQuantity)
  }

  // Remove item from cart
  const removeItem = (productId) => {
    removeFromCart(productId)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartItems={cart} />

      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Shopping Cart"
            subtitle="Review your items and proceed to checkout"
            colors={["#E11D48", "#7C3AED", "#E11D48"]}
            animationSpeed={3}
          />

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link
                href="/products"
                className="inline-block bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-4 border-b border-gray-200 last:border-b-0"
                    >
                      <Link href={`/product/${item.id}`} className="flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </Link>
                      <div className="ml-4 flex-1">
                        <Link href={`/product/${item.id}`}>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-rose-600">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center mt-2">
                          <span className="text-lg font-bold text-rose-600">
                          &#8377;{(item.discountPrice || item.price).toFixed(2)}
                          </span>
                          {item.discountPrice && (
                            <span className="ml-2 text-sm line-through text-gray-500">
                               &#8377;{item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:text-rose-600"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:text-rose-600"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-500 hover:text-rose-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold"> &#8377;{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-semibold"> &#8377;{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {calculateShipping() === 0 ? "Free" : `$${calculateShipping().toFixed(2)}`}
                      </span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Discount</span>
                        <span>- &#8377;{promoDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span> &#8377;{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      className="mt-6 w-full bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors flex items-center justify-center"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CartPage
