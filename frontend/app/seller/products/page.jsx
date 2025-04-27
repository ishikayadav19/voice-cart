'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { IconPencil, IconTrash } from '@tabler/icons-react';

import SellerProductCard from '../../components/SellerProductCard';
import { Infinity } from 'ldrs/react';
import 'ldrs/react/Infinity.css';
import { Link } from 'lucide-react';

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

  const deleteProduct = async (id) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/delete/${id}`)
    console.log(res.data);
    fetchProducts();
    toast.success('Product Deleted Successfully!');
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
          
          
                    <table className='w-full mt-10 border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='p-2'>ID</th>
                                <th className='p-2'>Name</th>
                                <th className='p-2'>Email</th>
                                <th className='p-2'>City</th>
                                <th className='p-2'>Created At</th>
                                <th className='p-2 ' colSpan={2}></th>

                            </tr>
                        </thead>
                        <tbody className=''>
                            {products.map((user, index) => {
                                return <tr key={products._id} className='border-b border-gray-300'>
                                    <td className='p-2'>{products._id}</td>
                                    <td className='p-2'>{products.name}</td>
                                    <td className='p-2'>{products.email}</td>
                                    <td className='p-2'>{products.city}</td>
                                    <td className='p-2'>{new Date(products.createdAt).toLocaleDateString()}</td>
                                    <td className='p-2'>
                                        <Link  href={'/products/edit/'+products._id} className='p-2 block w-fit bg-blue-500 text-white rounded'>
                                            <IconPencil />
                                        </Link>
                                    </td>
                                    <td className='p-2'>
                                        <button className='p-2 bg-red-500 text-white rounded'
                                        //  onClick={() => {
                                        //     deleteProduct(products._id)
                                        // }}
                                        >
                                            <IconTrash />
                                        </button>

                                    </td>
                                </tr>
                            })}

                        </tbody>
                    </table>

            

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage; 