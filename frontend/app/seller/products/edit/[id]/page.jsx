"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Image as ImageIcon, Package, Tag, IndianRupee, Hash } from "lucide-react"
import Navbar from "../../../../components/navbar"
import Footer from "../../../../components/footer"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams } from 'next/navigation';
import { Formik } from 'formik';



import React from 'react'
// import { useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const EditProductPage = () => {
  const router = useRouter();
  const {id} = useParams();
  const [productData, setProductData] = React.useState(null);
  const fetchProductData = async () => {
    const res = await axios.get(`${BASE_URL}/product/getbyid/${id}`);
    console.log(res.data);
    setProductData(res.data);
  };

  useEffect(() => {
    fetchProductData()
  }, [])

  const handleUpdate =  (values, { setSubmitting }) => {
    const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
    axios.put(`${BASE_URL}/product/seller/update/${id}`, values, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      toast.success('Product updated successfully');
      setSubmitting(false);
      router.push('/seller/products');
    })
    .catch((err) => {
      toast.error('Error updating product');
      setSubmitting(false);
    });
  }
  if(productData === null){
    return <p className='text-center text-2xl font-bold'>Loading...</p>
  }



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-0 bg-gray-50">
        <div className="max-w-3xl mx-auto w-full px-4 py-16">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
              <p className="text-sm text-gray-500 mt-1">Update your product information</p>
            </div>
          </div>
          <Formik initialValues={productData}
          onSubmit={handleUpdate}>

            {(productForm)=>(
          <form onSubmit={productForm.handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-8">
              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Image
                </label>
                <div className="flex items-center gap-6">
                  <div className="relative h-40 w-40 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                    {productForm.image ? (
                      <img
                        src={productForm.values.image}
                        alt={productForm.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="image"
                      value={productForm.values.image}
                      onChange={productForm.handleChange}
                      placeholder="Enter image URL"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter a valid image URL (e.g., https://example.com/image.jpg)
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={productForm.values.name}
                    onChange={productForm.handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={productForm.values.description}
                  onChange={productForm.handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  placeholder="Enter product description"
                />
              </div>

              {/* Price, Discount, and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={productForm.values.price}
                      onChange={productForm.handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Discount Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="discountPrice"
                      value={productForm.values.discountPrice || ''}
                      onChange={productForm.handleChange}
                      min="0"
                      max={productForm.values.price}
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave blank or 0 for no discount.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Stock
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="stock"
                      value={productForm.values.stock}
                      onChange={productForm.handleChange}
                      required
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="category"
                    value={productForm.values.category}
                    onChange={productForm.handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                    placeholder="Enter product category"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={productForm.isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-lg shadow hover:from-rose-700 hover:to-purple-700 transition-all font-semibold text-lg disabled:opacity-60"
                >
                  <Save className="h-5 w-5" />
                  {productForm.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
            )}
          </Formik>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default EditProductPage 