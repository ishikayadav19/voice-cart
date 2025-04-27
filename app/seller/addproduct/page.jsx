'use client';
import { useFormik } from 'formik'
import { useState } from "react"
import { Infinity } from 'ldrs/react'
import { Image, Package, DollarSign, Tag, Info } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import * as Yup from 'yup';
import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import 'ldrs/react/Infinity.css'

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .required('Description is required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  discountPrice: Yup.number()
    .positive('Discount price must be positive')
    .test('less-than-price', 'Discount price must be less than regular price', function(value) {
      return !value || value < this.parent.price;
    }),
  category: Yup.string()
    .required('Category is required'),
  
  stock: Yup.number()
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  brand: Yup.string()
    .required('Brand is required'),
  rating: Yup.number()
    .min(0, 'Rating must be between 0 and 5')
    .max(5, 'Rating must be between 0 and 5')
    .required('Rating is required'),
});

const AddProductPage = () => {
  const router = useRouter()

  const productForm = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      image: '',
      stock: '',
      brand: '',
      rating: '',
    },
    validationSchema: ProductSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/product/add`,
          values
        );
        
        toast.success('Product Added Successfully!');
        router.push('/seller/products');
        resetForm();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to add product');
        setSubmitting(false);
      }
    }
  });
  const ProductImage = (e)=>{
    const file = e.target.files[0]
    if(!file){
      return toast.error('Please select product Image')
      }
      console.log(file)
  
      const pd = new FormData();
      pd.append('file', file)
      pd.append('upload_preset', 'VoiceCart')
      pd.append('cloud_name', 'dx87ugjhk'); //uplaoding image to cloudinary 


      axios.post("https://api.cloudinary.com/v1_1/dx87ugjhk/image/upload", pd)
      .then((result)=>
      {
        console.log(result.data.url)
        productForm.setFieldValue('image', result.data.url)
        toast.success('Image uploaded Successfully');
      }).catch((err)=>{
        console.log(err)
        toast.error('Image Uploaded Failed')
      })  
    }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
                <p className="text-gray-600">Fill in the details to add a new product to the store</p>
              </div>

              <form onSubmit={productForm.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={productForm.values.name}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter product name"
                      />
                    </div>
                    {productForm.touched.name && productForm.errors.name && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                      Brand
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="brand"
                        name="brand"
                        type="text"
                        value={productForm.values.brand}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter brand name"
                      />
                    </div>
                    {productForm.touched.brand && productForm.errors.brand && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.brand}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="price" className="text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={productForm.values.price}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    {productForm.touched.price && productForm.errors.price && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="discountPrice" className="text-sm font-medium text-gray-700">
                      Discount Price (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="discountPrice"
                        name="discountPrice"
                        type="number"
                        value={productForm.values.discountPrice}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    {productForm.touched.discountPrice && productForm.errors.discountPrice && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.discountPrice}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="category"
                        name="category"
                        value={productForm.values.category}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="books">Books</option>
                        <option value="home">Home & Kitchen</option>
                        <option value="beauty">Beauty & Personal Care</option>
                      </select>
                    </div>
                    {productForm.touched.category && productForm.errors.category && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="stock" className="text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        value={productForm.values.stock}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter stock quantity"
                      />
                    </div>
                    {productForm.touched.stock && productForm.errors.stock && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.stock}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="rating" className="text-sm font-medium text-gray-700">
                      Rating (0-5)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Info className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="rating"
                        name="rating"
                        type="number"
                        value={productForm.values.rating}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        max="5"
                      />
                    </div>
                    {productForm.touched.rating && productForm.errors.rating && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.rating}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="image" className="text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      </div>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        // value={productForm.values.image}
                        onChange={ProductImage}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="upload image"
                      />
                    </div>
                    {productForm.touched.image && productForm.errors.image && (
                      <p className="text-xs text-red-600 mt-2">{productForm.errors.image}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={productForm.values.description}
                    onChange={productForm.handleChange}
                    onBlur={productForm.handleBlur}
                    rows="4"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Enter product description"
                  />
                  {productForm.touched.description && productForm.errors.description && (
                    <p className="text-xs text-red-600 mt-2">{productForm.errors.description}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={productForm.isSubmitting}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                      productForm.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {productForm.isSubmitting ? (
                      <Infinity size="30" speed="2.5" color="white" />
                    ) : (
                      'Add Product'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProductPage; 