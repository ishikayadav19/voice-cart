"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

const ShopContext = createContext()

export const ShopProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])

  // Load saved state from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist')
      const savedCart = localStorage.getItem('cart')
      
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
      if (savedCart) setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [wishlist, cart])

  const addToWishlist = (product) => {
    setWishlist(prev => {
      // Check if product already exists in wishlist
      if (prev.some(item => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
  }

  const addToCart = (product) => {
    setCart(prev => {
      // Check if product already exists in cart
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  const moveToCart = (product) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  return (
    <ShopContext.Provider value={{
      wishlist,
      cart,
      addToWishlist,
      removeFromWishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      moveToCart
    }}>
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
} 