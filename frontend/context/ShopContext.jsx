"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ShopContext = createContext()

export const ShopProvider = ({ children }) => {
  const { profile, loading: authLoading } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState(null)

  const userEmail = profile?.email || "";


  // Load cart for the current user
  useEffect(() => {
    if (userEmail) {
      const savedCart = localStorage.getItem(`cart_${userEmail}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, [userEmail]);

  // Save cart to localStorage for the current user
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    }
  }, [cart, userEmail]);

  // Save wishlist globally (not user-specific)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist])

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

  useEffect(() => {
    const matchById = (item, id) =>
      item && (item.id === id || item._id === id);

    // Resolve a product object from the event payload. Prefers the full product
    // shipped from the voice matcher; falls back to existing cart/wishlist
    // entries; last resort is an id-only stub.
    const resolveProduct = (detail) => {
      if (detail?.product?.id || detail?.product?._id) return detail.product;
      const id = detail?.product_id;
      if (!id) return null;
      return (
        cart.find(item => matchById(item, id)) ||
        wishlist.find(item => matchById(item, id)) ||
        { _id: id, id }
      );
    };

    const handleVoiceAddCart = (e) => {
      const product = resolveProduct(e?.detail);
      if (product) addToCart(product);
    };
    const handleVoiceRemoveCart = (e) => {
      const id = e?.detail?.product_id;
      if (id) removeFromCart(id);
    };
    const handleVoiceAddWishlist = (e) => {
      const product = resolveProduct(e?.detail);
      if (product) addToWishlist(product);
    };
    const handleVoiceRemoveWishlist = (e) => {
      const id = e?.detail?.product_id;
      if (id) removeFromWishlist(id);
    };

    window.addEventListener('voice:add-to-cart', handleVoiceAddCart);
    window.addEventListener('voice:remove-from-cart', handleVoiceRemoveCart);
    window.addEventListener('voice:add-to-wishlist', handleVoiceAddWishlist);
    window.addEventListener('voice:remove-from-wishlist', handleVoiceRemoveWishlist);
    return () => {
      window.removeEventListener('voice:add-to-cart', handleVoiceAddCart);
      window.removeEventListener('voice:remove-from-cart', handleVoiceRemoveCart);
      window.removeEventListener('voice:add-to-wishlist', handleVoiceAddWishlist);
      window.removeEventListener('voice:remove-from-wishlist', handleVoiceRemoveWishlist);
    };
  }, [cart, wishlist]);

  return (
    <ShopContext.Provider value={{
      wishlist,
      cart,
      notification,
      userEmail,
      addToWishlist,
      removeFromWishlist,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      moveToCart,
      setCart,
      showNotification
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