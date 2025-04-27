"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  Store,
  MapPin,
  Lock,
  Save,
  AlertCircle,
} from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import axios from "axios"
import toast from "react-hot-toast"

const ProfilePage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    address: "",
  })
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken")
      if (!token) {
        router.push("/seller/login")
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setProfile(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateProfile = () => {
    const newErrors = {}
    if (!profile.name) newErrors.name = "Name is required"
    if (!profile.email) newErrors.email = "Email is required"
    if (!profile.phone) newErrors.phone = "Phone is required"
    if (!profile.storeName) newErrors.storeName = "Store name is required"
    if (!profile.address) newErrors.address = "Address is required"
    return newErrors
  }

  const validatePassword = () => {
    const newErrors = {}
    if (password.new && password.new.length < 6) {
      newErrors.new = "Password must be at least 6 characters"
    }
    if (password.new !== password.confirm) {
      newErrors.confirm = "Passwords do not match"
    }
    return newErrors
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const profileErrors = validateProfile()
    if (Object.keys(profileErrors).length > 0) {
      setErrors(profileErrors)
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken")
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success("Profile updated successfully")
      setErrors({})
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const passwordErrors = validatePassword()
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors)
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken")
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/password`,
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success("Password updated successfully")
      setPassword({ current: "", new: "", confirm: "" })
      setErrors({})
    } catch (error) {
      console.error("Error updating password:", error)
      toast.error("Failed to update password")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your store information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Store Information
              </h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.phone ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="storeName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Store Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      value={profile.storeName}
                      onChange={handleProfileChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.storeName ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                    />
                  </div>
                  {errors.storeName && (
                    <p className="mt-1 text-sm text-red-600">{errors.storeName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Store Address
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute top-2 left-3 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={profile.address}
                      onChange={handleProfileChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.address ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                    isSaving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="current"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="current"
                      name="current"
                      value={password.current}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="new"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="new"
                      name="new"
                      value={password.new}
                      onChange={handlePasswordChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.new ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                    />
                  </div>
                  {errors.new && (
                    <p className="mt-1 text-sm text-red-600">{errors.new}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirm"
                      name="confirm"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.confirm ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                    />
                  </div>
                  {errors.confirm && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                    isSaving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage 