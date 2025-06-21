'use client';
import { useFormik } from 'formik'
import { useState } from "react"
import { Infinity } from 'ldrs/react'
import { Image, Package, DollarSign, Tag, Info, Star, X } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import * as Yup from 'yup';
import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/app/components/SectionHeading';
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
  images: Yup.array()
    .min(1, 'At least one image is required')
    .required('Images are required'),
  mainImage: Yup.string()
    .required('Main image is required'),
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mainImage, setMainImage] = useState('')
  const [additionalImages, setAdditionalImages] = useState([])

  const productForm = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      images: [],
      mainImage: '',
      stock: '',
      brand: '',
      rating: '',
      inStock: true,
      featured: false
    },
    validationSchema: ProductSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true)
        const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken")
        if (!token) {
          toast.error("Please login to add products")
          router.push("/seller/login")
          return
        }

        const productData = {
          ...values,
          price: Number(values.price),
          discountPrice: Number(values.discountPrice) || Number(values.price),
          stock: Number(values.stock),
          rating: Number(values.rating),
          inStock: values.stock > 0,
          featured: false,
          images: [mainImage, ...additionalImages].filter(Boolean),
          mainImage: mainImage
        };

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/product/seller/add`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (res.data) {
          toast.success('Product Added Successfully!');
          router.push('/seller/products');
          resetForm();
          setMainImage('');
          setAdditionalImages([]);
        } else {
          throw new Error('No data received from server');
        }
      } catch (error) {
        console.error('Error adding product:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem("sellerToken")
          sessionStorage.removeItem("sellerToken")
          toast.error("Session expired. Please login again.")
          router.push("/seller/login")
        } else {
          toast.error(error?.response?.data?.message || 'Failed to add product');
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  });

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return toast.error('Please select a main image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size should be less than 5MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return toast.error('Please upload an image file');
    }

    const pd = new FormData();
    pd.append('file', file);
    pd.append('upload_preset','VoiceCart');
    pd.append('cloud_name', 'dx87ugjhk');

    try {
      const result = await axios.post(
        `https://api.cloudinary.com/v1_1/dx87ugjhk/image/upload`,
        pd
      );
      
      if (result.data && result.data.url) {
        setMainImage(result.data.url);
        productForm.setFieldValue('mainImage', result.data.url);
        toast.success('Main image uploaded successfully');
      } else {
        throw new Error('No URL received from Cloudinary');
      }
    } catch (err) {
      console.error('Error uploading main image:', err);
      toast.error(err.response?.data?.error?.message || 'Failed to upload main image');
    }
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      return toast.error('Please select at least one image');
    }

    // Validate total size (max 20MB for all images)
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 20 * 1024 * 1024) {
      return toast.error('Total size of all images should be less than 20MB');
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      return toast.error('Please upload only image files');
    }

    const uploadPromises = files.map(async (file) => {
      const pd = new FormData();
      pd.append('file', file);
      pd.append('upload_preset','VoiceCart');
      pd.append('cloud_name', 'dx87ugjhk');

      try {
        const result = await axios.post(
          `https://api.cloudinary.com/v1_1/dx87ugjhk/image/upload`,
          pd
        );
        return result.data.url;
      } catch (err) {
        console.error('Error uploading image:', err);
        toast.error(err.response?.data?.error?.message || 'Failed to upload image');
        return null;
      }
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);
      
      if (validUrls.length > 0) {
        setAdditionalImages(prev => [...prev, ...validUrls]);
        productForm.setFieldValue('images', [mainImage, ...additionalImages, ...validUrls].filter(Boolean));
        toast.success('Additional images uploaded successfully');
      }
    } catch (error) {
      console.error('Error handling image uploads:', error);
      toast.error('Failed to upload images');
    }
  };

  const removeMainImage = () => {
    setMainImage('');
    productForm.setFieldValue('mainImage', '');
  };

  const removeAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
    productForm.setFieldValue('images', [mainImage, ...newImages].filter(Boolean));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-8 mt-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <SectionHeading
              title="Add New Product"
              subtitle="Fill in the details to add a new product to your store"
              colors={["#E11D48", "#7C3AED", "#E11D48"]}
              animationSpeed={3}
              className="text-3xl font-bold"
              align="center"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <form onSubmit={productForm.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="space-y-1"
                  >
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={productForm.values.name}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter product name"
                      />
                    </div>
                    {productForm.touched.name && productForm.errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="space-y-1"
                  >
                    <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                      Brand
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <input
                        id="brand"
                        name="brand"
                        type="text"
                        value={productForm.values.brand}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter brand name"
                      />
                    </div>
                    {productForm.touched.brand && productForm.errors.brand && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.brand}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="space-y-1"
                  >
                    <label htmlFor="price" className="text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 mt-4 text-gray-400">
                        &#8377;
                      </div>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={productForm.values.price}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    {productForm.touched.price && productForm.errors.price && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.price}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="space-y-1"
                  >
                    <label htmlFor="discountPrice" className="text-sm font-medium text-gray-700">
                      Discount Price (Optional)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 mt-4 text-gray-400">
                        &#8377;
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
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.discountPrice}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="space-y-1"
                  >
                    <label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <input
                        id="category"
                        name="category"
                        type="text"
                        value={productForm.values.category}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter category"
                      />
                    </div>
                    {productForm.touched.category && productForm.errors.category && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.category}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="space-y-1"
                  >
                    <label htmlFor="stock" className="text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        value={productForm.values.stock}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter stock quantity"
                      />
                    </div>
                    {productForm.touched.stock && productForm.errors.stock && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.stock}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className="space-y-1"
                  >
                    <label htmlFor="rating" className="text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Star className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <input
                        id="rating"
                        name="rating"
                        type="number"
                        value={productForm.values.rating}
                        onChange={productForm.handleChange}
                        onBlur={productForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter rating (0-5)"
                        step="0.1"
                        min="0"
                        max="5"
                      />
                    </div>
                    {productForm.touched.rating && productForm.errors.rating && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.rating}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    className="space-y-1"
                  >
                    <label className="text-sm font-medium text-gray-700">
                      Main Product Image
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <input
                        type="file"
                        onChange={handleMainImageUpload}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        accept="image/*"
                      />
                    </div>
                    {mainImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 relative group"
                      >
                        <img
                          src={mainImage}
                          alt="Main product image"
                          className="w-full h-48 object-cover rounded-lg ring-2 ring-rose-500"
                        />
                        <button
                          type="button"
                          onClick={removeMainImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded">
                          Main Image
                        </div>
                      </motion.div>
                    )}
                    {productForm.touched.mainImage && productForm.errors.mainImage && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.mainImage}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1 }}
                    className="space-y-1"
                  >
                    <label className="text-sm font-medium text-gray-700">
                      Additional Images
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleAdditionalImagesUpload}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                        accept="image/*"
                      />
                    </div>
                    {additionalImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {additionalImages.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group"
                          >
                            <img
                              src={image}
                              alt={`Additional image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg hover:ring-2 hover:ring-gray-300 transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {productForm.touched.images && productForm.errors.images && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 mt-2"
                      >
                        {productForm.errors.images}
                      </motion.p>
                    )}
                  </motion.div>
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1 }}
                  className="flex justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Infinity size="20" speed="2.5" color="white" />
                        <span className="ml-2">Adding Product...</span>
                      </div>
                    ) : (
                      'Add Product'
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProductPage; 