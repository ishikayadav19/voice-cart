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
  BarChart3,
} from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import axios from "axios"
import toast from "react-hot-toast"
import SectionHeading from "../../components/SectionHeading"

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
  const [editMode, setEditMode] = useState(false)
  const [editProfile, setEditProfile] = useState(profile)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("sellerToken") || sessionStorage.getItem("sellerToken");
      if (!token) {
        router.push("/seller/login");
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error) {
        // If unauthorized or forbidden, clear token and redirect
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("sellerToken");
          sessionStorage.removeItem("sellerToken");
          router.push("/seller/login");
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  useEffect(() => {
    setEditProfile(profile)
  }, [profile])

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

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target
    setEditProfile((prev) => ({
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

  const handleEditProfileSubmit = async (e) => {
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
        editProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success("Profile updated successfully")
      setErrors({})
      setEditMode(false)
      fetchUserProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditProfile(profile)
    setEditMode(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('usertoken');
    sessionStorage.removeItem('usertoken');
    localStorage.removeItem('sellerToken');
    sessionStorage.removeItem('sellerToken');
    router.push('/');
  };

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mt-5 flex justify-center mb-4">
          <button
            onClick={() => router.push('/seller/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg shadow hover:from-rose-600 hover:to-purple-700 transition-all font-semibold text-sm"
          >
            <BarChart3 className="h-5 w-5" />
            Go to Dashboard
          </button>
        </div>
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg relative">
          <div className="mb-8">
            <SectionHeading
              title="Seller Profile"
              subtitle={profile.name ? `Welcome back, ${profile.name}!` : "Manage your store information"}
              colors={["#E11D48", "#7C3AED", "#E11D48"]}
              animationSpeed={3}
              className="text-3xl font-bold mb-2"
            />
          </div>
          {!editMode && (
            <div className="absolute top-8 right-8 flex gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 focus:outline-none"
                aria-label="Edit Profile"
              >
                <User className="h-5 w-5" /> Edit
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-rose-600 text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-700">
              <User className="h-5 w-5 mr-2 text-gray-400" />
              <span className="font-medium">Name:</span>
              <span className="ml-2">{profile.name}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="h-5 w-5 mr-2 text-gray-400" />
              <span className="font-medium">Email:</span>
              <span className="ml-2">{profile.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="h-5 w-5 mr-2 text-gray-400" />
              <span className="font-medium">Phone:</span>
              <span className="ml-2">{profile.phone}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Store className="h-5 w-5 mr-2 text-gray-400" />
              <span className="font-medium">Store Name:</span>
              <span className="ml-2">{profile.storeName}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-gray-400" />
              <span className="font-medium">Address:</span>
              <span className="ml-2">{profile.address}</span>
            </div>
          </div>
          {editMode && (
            <form onSubmit={handleEditProfileSubmit} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative animate-fadeIn">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                X
              </button>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editProfile.name}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editProfile.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editProfile.phone}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={editProfile.storeName}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editProfile.address}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded shadow disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded shadow"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage 