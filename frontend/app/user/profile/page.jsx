"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import { Mail, User, LogOut, Phone } from "lucide-react"

const UserProfilePage = () => {
//   const router = useRouter()
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('usertoken') || sessionStorage.getItem('usertoken')
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         setUser(response.data.user)
//       } catch (error) {
//         toast.error("Failed to load profile")
//         router.push("/login")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUser()
//   }, [router])

//   const handleLogout = () => {
//     localStorage.removeItem('usertoken')
//     sessionStorage.removeItem('usertoken')
//     toast.success("Logged out successfully")
//     router.push("/login")
//   }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex items-center justify-center"> Profile Page
        {/* <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          {loading ? (
            <div className="text-center text-gray-600">Loading profile...</div>
          ) : user ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
                <p className="text-gray-500">Welcome back, {user.name}!</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{user.name}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <span className="ml-2">{user.phone}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <div className="text-center text-red-600">User data not found.</div>
          )}
        </div> */}
      </main>
      <Footer />
    </div>
  )
}

export default UserProfilePage
