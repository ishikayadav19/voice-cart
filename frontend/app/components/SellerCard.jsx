"use client";

import React, { useState } from 'react';
import { Pencil, Trash2, IndianRupee } from "lucide-react";
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SellerCard = ({product}) => {
  const router = useRouter();

  const handleDelete = async (id) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/delete/${product._id}`);
    console.log(res.data);
    // fetchProducts();
    toast.success('Product Deleted Successfully!');
};

  const handleEdit = () => {
    router.push(`/seller/products/edit/${product._id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative group">
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative aspect-w-1 aspect-h-1 bg-gradient-to-br from-rose-50 to-purple-50">
          <img 
            src={product.mainImage || (product.images && product.images[0]) || "/placeholder.svg"} 
            alt={product.name} 
            className="w-full h-48 object-contain p-4 transition-transform duration-300 group-hover:scale-105" 
          />
          {product.discountPrice && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-rose-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>
      <div className="p-5 flex flex-col h-44 justify-between">
        <div>
          <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
          <div className="flex items-center mb-3 space-x-2">
            {product.discountPrice ? (
              <>
                <span className="text-xl font-bold text-rose-600 flex items-center"><IndianRupee className="h-4 w-4 mr-0.5" />{product.discountPrice.toFixed(2)}</span>
                <span className="text-sm line-through text-gray-500 flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-800 flex items-center"><IndianRupee className="h-4 w-4 mr-0.5" />{product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleEdit}
            title="Edit Product"
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm shadow"
          >
            <Pencil size={16} className="mr-1" /> Edit
          </button>
          <button
            onClick={handleDelete}
            title="Delete Product"
            className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm shadow"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerCard;