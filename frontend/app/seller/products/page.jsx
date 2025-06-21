'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css';
import SellerCard from '@/app/components/SellerCard';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SectionHeading from '@/app/components/SectionHeading';
import { Package, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product/seller/myproducts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
    router.push(`/seller/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/seller/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProducts();
    toast.success('Product Deleted Successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeading
              title="My Products"
              subtitle="Manage your product inventory"
              colors={["#E11D48", "#7C3AED", "#E11D48"]}
              animationSpeed={3}
            />
          </motion.div>

          {/* Search and Add Product Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Link
              href="/seller/addproduct"
              className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
            >
              <Plus size={20} />
              Add New Product
            </Link>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Infinity size="30" speed="2.5" color="#E11D48" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <SellerCard
                    product={product}
                    onEdit={() => handleEdit(product._id)}
                    onDelete={() => handleDelete(product._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Start by adding your first product to your store.</p>
                <Link
                  href="/seller/addproduct"
                  className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  <Plus size={20} />
                  Add New Product
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;