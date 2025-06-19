"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CheckCircle2, ArrowRight, Home, Package } from "lucide-react"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/footer"
import SectionHeading from '@/app/components/SectionHeading'

const SuccessPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timeout = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
            </motion.div>

            <SectionHeading
              title="Order Confirmed!"
              subtitle="Thank you for your purchase"
              colors={["#22C55E", "#7C3AED", "#22C55E"]}
              animationSpeed={3}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-8 mt-8"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Package className="h-5 w-5" />
                  <p>Your order has been successfully placed</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Next?</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                      You will receive an order confirmation email shortly
                    </li>
                    <li className="flex items-center text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                      We'll notify you when your order ships
                    </li>
                    <li className="flex items-center text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                      Track your order status in your account
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition-colors flex items-center justify-center"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Return to Home
                  </button>
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full sm:w-auto bg-white border border-rose-600 text-rose-600 px-6 py-3 rounded-md hover:bg-rose-50 transition-colors flex items-center justify-center"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    View Orders
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500 mt-6"
            >
              You will be redirected to the home page in 10 seconds...
            </motion.p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SuccessPage 