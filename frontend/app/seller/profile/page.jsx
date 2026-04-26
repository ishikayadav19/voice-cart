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

import { useAuth } from "@/context/AuthContext"

const ProfilePage = () => {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    address: "",
  })

  useEffect(() => {
    if (authLoading) return;
    if (!user || profile?.role !== 'seller') {
      router.push("/seller/login");
      return;
    }

    if (profile) {
      setEditProfile({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        storeName: profile.store_name || "",
        address: profile.address || "",
      });
      setIsLoading(false);
    }
  }, [user, profile, authLoading, router]);

  const validateProfile = () => {
    const newErrors = {}
    if (!editProfile.name) newErrors.name = "Name is required"
    if (!editProfile.phone) newErrors.phone = "Phone is required"
    if (!editProfile.storeName) newErrors.storeName = "Store name is required"
    if (!editProfile.address) newErrors.address = "Address is required"
    return newErrors
  }

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault()
    const profileErrors = validateProfile()
    if (Object.keys(profileErrors).length > 0) {
      toast.error("Please fill all required fields")
      return
    }
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/seller/profile`, {
        name: editProfile.name,
        phone: editProfile.phone,
        storeName: editProfile.storeName,
        address: editProfile.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Profile updated successfully")
      setEditMode(false)

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...storedUser, ...response.data.seller };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditProfile({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      storeName: profile.store_name || "",
      address: profile.address || "",
    })
    setEditMode(false)
  }

  const handleLogout = async () => {
    await signOut();
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      <main className="flex-1 px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mt-5 flex justify-center mb-4">
          <button
            onClick={() => router.push('/seller/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white rounded-lg shadow transition-colors font-semibold text-sm tracking-wider"
          >
            <BarChart3 className="h-5 w-5" />
            Go to Dashboard
          </button>
        </div>
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-[#E5E0D8] relative">
          <div className="mb-8">
            <SectionHeading
              title="Seller Profile"
              subtitle={profile.name ? `Welcome back, ${profile.name}!` : "Manage your store information"}
              colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
              animationSpeed={3}
              className="text-3xl font-serif text-[#1A1A1A] mb-2"
            />
          </div>
          {!editMode && (
            <div className="absolute top-8 right-8 flex gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 text-[#D4AF37] hover:text-[#C5A030] focus:outline-none"
                aria-label="Edit Profile"
              >
                <User className="h-5 w-5" /> Edit
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-[#1A1A1A] text-[#1A1A1A] rounded-md hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          )}
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-[#1A1A1A]">
              <User className="h-5 w-5 mr-2 text-[#7A7571]" />
              <span className="font-medium">Name:</span>
              <span className="ml-2 text-[#5C5C5C]">{profile.name}</span>
            </div>
            <div className="flex items-center text-[#1A1A1A]">
              <Mail className="h-5 w-5 mr-2 text-[#7A7571]" />
              <span className="font-medium">Email:</span>
              <span className="ml-2 text-[#5C5C5C]">{profile.email}</span>
            </div>
            <div className="flex items-center text-[#1A1A1A]">
              <Phone className="h-5 w-5 mr-2 text-[#7A7571]" />
              <span className="font-medium">Phone:</span>
              <span className="ml-2 text-[#5C5C5C]">{profile.phone}</span>
            </div>
            <div className="flex items-center text-[#1A1A1A]">
              <Store className="h-5 w-5 mr-2 text-[#7A7571]" />
              <span className="font-medium">Store Name:</span>
              <span className="ml-2 text-[#5C5C5C]">{profile.store_name}</span>
            </div>
            <div className="flex items-center text-[#1A1A1A]">
              <MapPin className="h-5 w-5 mr-2 text-[#7A7571]" />
              <span className="font-medium">Address:</span>
              <span className="ml-2 text-[#5C5C5C]">{profile.address}</span>
            </div>
          </div>
          {editMode && (
            <form onSubmit={handleEditProfileSubmit} className="bg-white border border-[#E5E0D8] rounded-lg shadow-xl p-6 w-full max-w-sm relative animate-fadeIn">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="absolute top-2 right-2 text-[#7A7571] hover:text-[#1A1A1A]"
                aria-label="Close"
              >
                X
              </button>
              <h3 className="text-lg font-serif text-[#1A1A1A] mb-4">Edit Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A]">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editProfile.name}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-[#E5E0D8] shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A]">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editProfile.email}
                    disabled
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-[#E5E0D8] shadow-sm bg-[#FAF9F6] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A]">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editProfile.phone}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-[#E5E0D8] shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A]">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={editProfile.storeName}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-[#E5E0D8] shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A]">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editProfile.address}
                    onChange={handleEditProfileChange}
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-[#E5E0D8] shadow-sm focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white rounded shadow disabled:opacity-60 transition-colors tracking-wider"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-[#FAF9F6] border border-[#E5E0D8] hover:bg-[#E5E0D8] text-[#1A1A1A] rounded shadow transition-colors"
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