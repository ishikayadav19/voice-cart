'use client';

import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import Link from "next/link"
// import Navbar from "../components/navbar"
// import Footer from "../components/footer"
import React from 'react'

const SignupOptionsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Join VoiceCart
                </h1>
                <p className="text-gray-600">
                  Choose how you want to sign up
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Signup Card */}
                <Link
                  href="/user/signup"
                  className="block rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-6 bg-gradient-to-br from-rose-400 to-rose-500 text-white">
                    <h2 className="text-2xl font-semibold mb-2">Sign up as User</h2>
                    <p className="text-gray-100">
                      Shop, explore, and enjoy the best deals on VoiceCart.
                    </p>
                  </div>
                  <div className="p-4 bg-white text-gray-800 text-center">
                    Join as a User
                  </div>
                </Link>

                {/* Seller Signup Card */}
                <Link
                  href="/seller/signup"
                  className="block rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-6 bg-gradient-to-br from-purple-400 to-purple-500 text-white">
                    <h2 className="text-2xl font-semibold mb-2">
                      Sign up as Seller
                    </h2>
                    <p className="text-gray-100">
                      Start selling your products and reach millions of
                      customers.
                    </p>
                  </div>
                  <div className="p-4 bg-white text-gray-800 text-center">
                    Join as a Seller
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupOptionsPage;