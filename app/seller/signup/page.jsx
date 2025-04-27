'use client';
import { useFormik} from 'formik';
import { useState } from "react";
import { Infinity } from 'ldrs/react';
import { User, Mail, Lock, Phone, Store, MapPin } from "lucide-react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import 'ldrs/react/Infinity.css';

const SellerSignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  storeName: Yup.string()
    .min(3, 'Store name must be at least 3 characters')
    .max(50, 'Store name must be less than 50 characters')
    .required('Store name is required'),
  address: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be less than 200 characters')
    .required('Address is required'),
});

const SellerSignupPage = () => {
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      storeName: '',
      address: '',
    },
    validationSchema: SellerSignupSchema,
    onSubmit: async (values, { resetForm , setSubmitting}) => {
      try {
        // const { confirmPassword, ...signupData } = values;
        // console.log('Sending signup data:', signupData);
        // console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/seller/signup`);
        
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/add`,
          values
        );
        
        console.log('Signup response:', res.data);
        toast.success('Seller account created successfully!');
        router.push('/seller/login');
        resetForm();
      } catch (error) {
        console.error('Signup error:', error);
        console.error('Error response:', error.response?.data);
        toast.error(
          error.response?.data?.message || 'Failed to create seller account. Please check your internet connection and try again.');
          setSubmitting(false);
      } 
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Sign Up</h1>
                <p className="text-gray-600">Create your seller account to start selling</p>
              </div>

              <form onSubmit={signupForm.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={signupForm.values.name}
                        onChange={signupForm.handleChange}
                        onBlur={signupForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {signupForm.touched.name && signupForm.errors.name && (
                      <p className="text-xs text-red-600 mt-2">{signupForm.errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={signupForm.values.email}
                        onChange={signupForm.handleChange}
                        onBlur={signupForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    {signupForm.touched.email && signupForm.errors.email && (
                      <p className="text-xs text-red-600 mt-2">{signupForm.errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={signupForm.values.password}
                        onChange={signupForm.handleChange}
                        onBlur={signupForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter your password"
                      />
                    </div>
                    {signupForm.touched.password && signupForm.errors.password && (
                      <p className="text-xs text-red-600 mt-2">{signupForm.errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={signupForm.values.confirmPassword}
                        onChange={signupForm.handleChange}
                        onBlur={signupForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Confirm your password"
                      />
                    </div>
                    {signupForm.touched.confirmPassword && signupForm.errors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-2">{signupForm.errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={signupForm.values.phone}
                        onChange={signupForm.handleChange}
                        onBlur={signupForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {signupForm.touched.phone && signupForm.errors.phone && (
                      <p className="text-xs text-red-600 mt-2">{signupForm.errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="storeName" className="text-sm font-medium text-gray-700">
                      Store Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="storeName"
                        name="storeName"
                        type="text"
                        value={signupForm.values.storeName}
                        onChange={signupForm.handleChange}
                        onBlur={signupForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter your store name"
                      />
                    </div>
                    {signupForm.touched.storeName && signupForm.errors.storeName && (
                      <p className="text-xs text-red-600 mt-2">{signupForm.errors.storeName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Store Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={signupForm.values.address}
                      onChange={signupForm.handleChange}
                      onBlur={signupForm.handleBlur}
                      rows="3"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your store address"
                    />
                  </div>
                  {signupForm.touched.address && signupForm.errors.address && (
                    <p className="text-xs text-red-600 mt-2">{signupForm.errors.address}</p>
                  )}
                </div>

                <div>
                  <button
                                      type="submit"
                                      disabled={signupForm.isSubmitting}
                                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                                        signupForm.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                      }`}
                                    >
                                      {signupForm.isSubmitting ? (
                                        <Infinity size="30" speed="2.5" color="white" />
                                      ) : (
                                        'Create Seller Account'
                                      )}
                                    </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/seller/login')}
                      className="text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
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

export default SellerSignupPage; 