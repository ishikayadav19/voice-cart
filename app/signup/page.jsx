'use client';
import { useFormik } from 'formik'
import { useState } from "react"
import { Infinity } from 'ldrs/react'
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import * as Yup from 'yup';
import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import 'ldrs/react/Infinity.css'

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Password is required')
    .matches(/[a-z]/, 'lowercase letter is required')
    .matches(/[A-Z]/, 'uppercase letter is required')
    .matches(/[0-9]/, 'number is required')
    .matches(/\W/, 'special character is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: Yup.string().required('Confirm Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  const signForm = useFormik({
      initialValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
    validationSchema: SignupSchema,
      onSubmit: async (values, { resetForm, setSubmitting }) => {
      if (!agreeTerms) {
        toast.error('Please agree to the Terms and Conditions');
        return;
      }

        try {
          const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/user/add`,
              values
          );
          
          toast.success('User Registered Successfully!');
          router.push('/login');
          resetForm();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Registration failed');
        setSubmitting(false);
      }
    }
  });

  const handlePasswordChange = (e) => {
    signForm.handleChange(e);
    const value = e.target.value;
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gray-50">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h1>
                <p className="text-gray-600">Join VoiceCart for a better shopping experience</p>
              </div>

              <form onSubmit={signForm.handleSubmit} className="space-y-6">
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
                      value={signForm.values.name}
                        onChange={signForm.handleChange}
                      onBlur={signForm.handleBlur}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="John Doe"
                      />
                  </div>
                  {signForm.touched.name && signForm.errors.name && (
                    <p className="text-xs text-red-600 mt-2">{signForm.errors.name}</p>
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
                      onChange={signForm.handleChange}
                      value={signForm.values.email}
                      onBlur={signForm.handleBlur}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  {signForm.touched.email && signForm.errors.email && (
                    <p className="text-xs text-red-600 mt-2">{signForm.errors.email}</p>
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
                      type={showPassword ? "text" : "password"}
                      onChange={handlePasswordChange}
                      value={signForm.values.password}
                      onBlur={signForm.handleBlur}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {signForm.touched.password && signForm.errors.password && (
                    <p className="text-xs text-red-600 mt-2">{signForm.errors.password}</p>
                  )}

                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Password strength:</span>
                      <span className="text-xs font-medium">
                        {passwordStrength === 0 && "Weak"}
                        {passwordStrength === 1 && "Fair"}
                        {passwordStrength === 2 && "Good"}
                        {passwordStrength === 3 && "Strong"}
                        {passwordStrength === 4 && "Very Strong"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          passwordStrength === 0
                            ? "bg-red-500 w-1/4"
                            : passwordStrength === 1
                              ? "bg-orange-500 w-2/4"
                              : passwordStrength === 2
                                ? "bg-yellow-500 w-3/4"
                                : passwordStrength >= 3
                                  ? "bg-green-500 w-full"
                                  : ""
                        }`}
                      ></div>
                    </div>
                  </div>
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
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={signForm.handleChange}
                      value={signForm.values.confirmPassword}
                      onBlur={signForm.handleBlur}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {signForm.touched.confirmPassword && signForm.errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-2">{signForm.errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <Link href="/terms" className="text-rose-600 hover:text-rose-500">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-rose-600 hover:text-rose-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={signForm.isSubmitting}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                      signForm.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {signForm.isSubmitting ? (
                      <Infinity size="30" speed="2.5" color="white" />
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>

              {/* <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <img src="/placeholder.svg?height=20&width=20" alt="Google" className="h-5 w-5" />
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <img src="/placeholder.svg?height=20&width=20" alt="Facebook" className="h-5 w-5" />
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <img src="/placeholder.svg?height=20&width=20" alt="Apple" className="h-5 w-5" />
                  </button>
                </div>
              </div> */}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-rose-600 hover:text-rose-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;