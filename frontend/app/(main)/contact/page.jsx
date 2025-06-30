"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Check } from "lucide-react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import SectionHeading from "../../components/SectionHeading"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Simulate API call
    try {
      // This would be replaced with actual backend API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, just validate email format
      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setError(error.message || "Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionHeading
                title="Contact Us"
                subtitle="Have questions or feedback? We'd love to hear from you. Our team is always here to help."
                colors={["#E11D48", "#7C3AED", "#E11D48"]}
                animationSpeed={3}
                className="text-4xl font-bold mb-4"
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
              <div className="grid md:grid-cols-5">
                {/* Contact Information */}
                <div className="md:col-span-2 bg-gradient-to-br from-rose-600 to-purple-600 text-white p-8">
                  <SectionHeading
                    title="Get in Touch"
                    colors={["#ffffff", "#f0f0f0", "#ffffff", "#f0f0f0"]}
                    animationSpeed={4}
                    className="text-2xl font-bold mb-6"
                    showUnderline={false}
                  />

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Our Location</h3>
                        <p className="text-white text-opacity-80">
                          123 Commerce Street, Tech City, TC 12345, United States
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-6 w-6 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Call Us</h3>
                        <p className="text-white text-opacity-80">+1 (555) 123-4567</p>
                        <p className="text-white text-opacity-80">Mon-Fri, 9am-6pm EST</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-6 w-6 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email Us</h3>
                        <p className="text-white text-opacity-80">support@voicecart.com</p>
                        <p className="text-white text-opacity-80">We'll respond within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h3 className="font-semibold mb-3">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a
                        href="#"
                        className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="Facebook" className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="Twitter" className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="Instagram" className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                      >
                        <img src="/placeholder.svg?height=20&width=20" alt="LinkedIn" className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-3 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>

                  {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      <span>Your message has been sent successfully! We'll get back to you soon.</span>
                    </div>
                  )}

                  {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Your message here..."
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                          isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <Send className="h-5 w-5 mr-2" />
                        )}
                        {isLoading ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I track my order?</h3>
                  <p className="text-gray-600">
                    You can track your order by logging into your account and visiting the "Orders" section.
                    Alternatively, you can use the tracking number provided in your shipping confirmation email.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">What is your return policy?</h3>
                  <p className="text-gray-600">
                    We offer a 30-day return policy for most items. Products must be in their original condition with
                    all packaging and tags. Some restrictions apply for certain product categories.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How does voice shopping work?</h3>
                  <p className="text-gray-600">
                    Our voice shopping feature allows you to search for products, navigate the site, and add items to
                    your cart using voice commands. Simply click the microphone icon and speak your request.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Do you ship internationally?</h3>
                  <p className="text-gray-600">
                    Yes, we ship to most countries worldwide. Shipping rates and delivery times vary by location. You
                    can see the shipping options available to your country during checkout.
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Find Us</h2>
              </div>
              <div className="h-96 bg-gray-200">
                {/* This would be replaced with an actual map component */}
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-rose-600 mr-2" />
                  <span className="text-lg font-medium text-gray-600">Map would be displayed here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage
