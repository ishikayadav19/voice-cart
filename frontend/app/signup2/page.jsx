'use client';
import { useFormik } from 'formik'
import Link from 'next/link'
import { Helix, Infinity } from 'ldrs/react'
import 'ldrs/react/Infinity.css'

// Default values shown

import * as Yup from 'yup';
import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';


const SignupSchema = Yup.object().shape({  //structure define krte h
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


const signup = () => {
  // initializing formik
  // hook
  const router = useRouter()
  const signForm = useFormik(
    {
      initialValues: {
        firstName: '',
        lastName:'',
        email: '',
        password: '',
        confirmPassword: ''

      },
      // event
      onSubmit: async (values, { resetForm, setSubmitting }) => {
        console.log(values);
        try {
          const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/user/add`,
              values
          );
          
          console.log(res.data);
          console.log(res.status);
          console.log(res.statusText);
          toast.success('User Registered Successfully!');

          router.push('/login');
          resetForm();
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
        setSubmitting(false);
      }
      // validationSchema: SignupSchema
    }
  
});

  return (
    <>
    <div>
      <div className="mt-7 max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
      <Navbar />
      <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Sign up
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Already have an account?
              <Link
                className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                href="/login"
              >
                Sign in here
              </Link>
            </p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <svg
                className="w-4 h-auto"
                width={46}
                height={47}
                viewBox="0 0 46 47"
                fill="none"
              >
                <path
                  d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                  fill="#4285F4"
                />
                <path
                  d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                  fill="#34A853"
                />
                <path
                  d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                  fill="#FBBC05"
                />
                <path
                  d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                  fill="#EB4335"
                />
              </svg>
              Sign up with Google
            </button>
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>
            {/* Form */}
            <form onSubmit={signForm.handleSubmit}>
              <div className="grid gap-y-4">
                {/* Form Group */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      onChange={signForm.handleChange}
                      value={signForm.values.name}
                      className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"

                      aria-describedby="email-error"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  {
                    (signForm.touched.name && signForm.errors.name) && (
                      <p className="text-xs text-red-600 mt-2" id="email-error">
                        {signForm.errors.name}
                      </p>

                    )
                  }


                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      onChange={signForm.handleChange}
                      value={signForm.values.email}
                      className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required=""
                      aria-describedby="email-error"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  {
                    (signForm.touched.email && signForm.errors.email) && (
                      <p className=" text-xs text-red-600 mt-2" id="email-error">
                        {signForm.errors.email}
                      </p>

                    )
                  }
                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="password"

                      onChange={signForm.handleChange}
                      value={signForm.values.password}
                      className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required=""
                      aria-describedby="password-error"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  {
                    (signForm.touched.password && signForm.errors.password) && (
                      <p className=" text-xs text-red-600 mt-2" id="email-error">
                        {signForm.errors.password}
                      </p>

                    )
                  }
                </div>
                {/* End Form Group */}
                {/* Form Group */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm mb-2 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      onChange={signForm.handleChange}
                      value={signForm.values.confirmPassword}
                      className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required=""
                      aria-describedby="confirm-password-error"
                    />
                    <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                      <svg
                        className="size-5 text-red-500"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                  </div>
                  {
                    (signForm.touched.confirmPassword && signForm.errors.confirmPassword) && (
                      <p className=" text-xs text-red-600 mt-2" id="email-error">
                        {signForm.errors.confirmPassword}
                      </p>

                    )
                  }
                </div>
                {/* End Form Group */}
                {/* Checkbox */}
                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ms-3">
                    <label htmlFor="remember-me" className="text-sm dark:text-white">
                      I accept the{" "}
                      <a
                        className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                {/* End Checkbox */}
                <button disabled={signForm.isSubmitting}
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {
                    signForm.isSubmitting ? (
                      <Infinity
                        size="30"
                        speed="2.5"
                        color="white"
                      />
                    ): 'Submit'
                  }
                 
                </button>
              </div>
            </form>
            {/* End Form */}
          </div>
        </div>
      </div>

    </div>
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
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1">
                   <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                     First Name
                   </label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <User className="h-5 w-5 text-gray-400" />
                     </div>
                     <input
                       id="firstName"
                       name="firstName"
                       type="text"
                       value={signForm.values.firstName}
                       onChange={signForm.handleChange}
                      
                       className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                       placeholder="John"
                     />
                   </div>
                 </div>
                 {
                   (signForm.touched.firstName && signForm.errors.firstName) && (
                     <p className="text-xs text-red-600 mt-2" id="email-error">
                       {signForm.errors.firstName}
                     </p>

                   )
                 }

                 <div className="space-y-1">
                   <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                     Last Name
                   </label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <User className="h-5 w-5 text-gray-400" />
                     </div>
                     <input
                       id="lastName"
                       name="lastName"
                       type="text"
                       value={signForm.values.lastName}
                       onChange={signForm.handleChange}
                       className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                       placeholder="Doe"
                     />
                   </div>
                 </div>
               </div>
               {
                   (signForm.touched.lastName && signForm.errors.lastName) && (
                     <p className="text-xs text-red-600 mt-2" id="email-error">
                       {signForm.errors.lastName}
                     </p>

                   )
                 }

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
                 
                     className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                     placeholder="you@example.com"
                   />
                 </div>
               </div>
               {
                   (signForm.touched.email && signForm.errors.email) && (
                     <p className=" text-xs text-red-600 mt-2" id="email-error">
                       {signForm.errors.email}
                     </p>

                   )
                 }
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
                     onChange={signForm.handleChange}
                     value={signForm.values.password}
                     
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
                 {
                   (signForm.touched.password && signForm.errors.password) && (
                     <p className=" text-xs text-red-600 mt-2" id="email-error">
                       {signForm.errors.password}
                     </p>

                   )
                 }

                 
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
                 {
                   (signForm.touched.confirmPassword && signForm.errors.confirmPassword) && (
                     <p className=" text-xs text-red-600 mt-2" id="email-error">
                       {signForm.errors.confirmPassword}
                     </p>

                   )
                 }
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
               <button disabled={signForm.isSubmitting}
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {
                    signForm.isSubmitting ? (
                      <Infinity
                        size="30"
                        speed="2.5"
                        color="white"
                      />
                    ): 'Submit'
                  }
                 
                </button>
               </div>
             </form>

             <div className="mt-6">
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
             </div>

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
   </>
  )
}

export default signup