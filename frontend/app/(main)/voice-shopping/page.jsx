"use client";

import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import GradientText from '@/app/components/GradientText';
import { Mic, ShoppingCart, Search, ArrowRight, Star, Shield, Clock } from 'lucide-react';

const VoiceShoppingPage = () => {

  const features = [
    {
      icon: <Mic className="w-8 h-8 text-[#D4AF37]" />,
      title: "Voice Commands",
      description: "Simply speak to search products, navigate categories, or add items to your cart."
    },
    {
      icon: <Search className="w-8 h-8 text-[#D4AF37]" />,
      title: "Smart Search",
      description: "Our AI understands natural language and context to find exactly what you're looking for."
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-[#D4AF37]" />,
      title: "Hands-free Shopping",
      description: "Shop without typing - perfect for when your hands are busy or you're on the go."
    },
    {
      icon: <Star className="w-8 h-8 text-[#D4AF37]" />,
      title: "Personalized Experience",
      description: "The more you use voice shopping, the better it understands your preferences."
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-[#D4AF37]" />,
      title: "Save Time",
      description: "Find products faster with voice commands instead of typing."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#D4AF37]" />,
      title: "Secure & Private",
      description: "Your voice data is encrypted and never stored permanently."
    }
  ];

  const commands = [
    "Search for [product name]",
    "Go to [category name]",
    "Add [product] to cart",
    "Show my cart",
    "Go to wishlist",
    "Sort by price",
    "Filter by brand"
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-[#1A1A1A] to-[#D4AF37] mt-16">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <div className="text-white max-w-3xl px-4 mx-auto">
            <GradientText
              colors={["#ffffff", "#f0f0f0", "#ffffff", "#f0f0f0"]}
              animationSpeed={4}
              className="text-2xl font-serif mb-6"
            >
              Voice Shopping Experience
            </GradientText>
            <p className="text-base mb-8 opacity-90 font-light">
              Shop hands-free with our advanced voice assistant. Just speak to search, browse, and buy.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('voice:activate'))}
              className="px-8 py-4 bg-white text-[#1A1A1A] rounded-full font-semibold text-base hover:bg-[#D4AF37] hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Try Voice Shopping
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="mb-20">
          <GradientText
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={3}
            className="text-2xl font-serif font-light text-center mb-12"
          >
            How It Works
          </GradientText>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-[#E5E0D8] p-6 rounded-lg shadow-lg">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif font-light mb-2 text-[#1A1A1A]">{feature.title}</h3>
                <p className="text-base text-[#5C5C5C]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <GradientText
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={3}
            className="text-2xl font-serif font-light text-center mb-12"
          >
            Benefits
          </GradientText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white border border-[#E5E0D8] p-6 rounded-lg shadow-lg">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-serif font-light mb-2 text-[#1A1A1A]">{benefit.title}</h3>
                <p className="text-[#5C5C5C]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Voice Commands Section */}
        <section className="mb-20">
          <GradientText
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={3}
            className="text-2xl font-serif font-light text-center mb-12"
          >
            Try These Commands
          </GradientText>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commands.map((command, index) => (
                  <div key={index} className="flex items-center gap-2 text-base text-[#1A1A1A]">
                    <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                    <span>{command}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('voice:activate'))}
                  className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-full font-semibold text-base hover:bg-[#1A1A1A] transition-all duration-300"
                >
                  <Mic className="w-5 h-5" />
                  Activate Voice Assistant
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="text-center">
          <GradientText
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={3}
            className="text-2xl font-serif font-light mb-8"
          >
            Ready to Try?
          </GradientText>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('voice:activate'))}
            className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-semibold text-base hover:bg-[#D4AF37] transition-all duration-300 transform hover:scale-105"
          >
            Start Voice Shopping
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VoiceShoppingPage; 