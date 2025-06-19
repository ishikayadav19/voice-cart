"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

const ShopContext = createContext()

export const ShopProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState(null)

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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const addToWishlist = (product) => {
    setWishlist(prev => {
      // Check if product already exists in wishlist using either _id or id
      if (prev.some(item => 
        item.id === product.id || 
        item.id === product._id || 
        item._id === product.id || 
        item._id === product._id
      )) {
        showNotification('Item already in wishlist', 'info')
        return prev
      }
      showNotification('Added to wishlist')
      return [...prev, { ...product, id: product._id || product.id }]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(item => 
        item.id !== productId && item._id !== productId
      )
      showNotification('Removed from wishlist')
      return newWishlist
    })
  }

  const addToCart = (product) => {
    setCart(prev => {
      // Check if product already exists in cart using either _id or id
      const existingItem = prev.find(item => 
        item.id === product.id || 
        item.id === product._id || 
        item._id === product.id || 
        item._id === product._id
      );
      
      if (existingItem) {
        return prev.map(item => 
          (item.id === product.id || 
           item.id === product._id || 
           item._id === product.id || 
           item._id === product._id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new item with consistent id property
      return [...prev, { 
        ...product, 
        id: product._id || product.id, // Use _id if available, fallback to id
        quantity: 1 
      }];
    });
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => 
      item.id !== productId && item._id !== productId
    ));
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        (item.id === productId || item._id === productId)
          ? { ...item, quantity }
          : item
      )
    );
  }

  const moveToCart = (product) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  return (
    <ShopContext.Provider value={{
      wishlist,
      cart,
      notification,
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