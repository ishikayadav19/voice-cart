'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css';
import SellerProductCard from '@/app/components/SellerProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


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

 

  

  useEffect(() => {
    fetchProducts();
  }, []);
  const handleEdit = (id) => {
    console.log('Edit product with ID:', id);
    // Navigate to the edit page or open a modal
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/delete/${id}`)
    console.log(res.data);
    fetchProducts();
    toast.success('Product Deleted Successfully!');
};


  const handleUpdateStock = (id) => {
    console.log('Update stock for product with ID:', id);
    // Implement stock update logic
  };


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
                <SellerProductCard
                  key={product._id} 
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdateStock={handleUpdateStock}
                 
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