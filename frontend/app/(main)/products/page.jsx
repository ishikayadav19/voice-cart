'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import ProductCard from '../../components/ProductCard';
import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/getall`);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    // Implement cart functionality
    console.log('Adding to cart:', product);
  };

  const handleAddToWishlist = (product) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item._id === product._id);
      if (isInWishlist) {
        return prev.filter(item => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Infinity size="30" speed="2.5" color="#E11D48" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  isInWishlist={wishlist.some(item => item._id === product._id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage; 