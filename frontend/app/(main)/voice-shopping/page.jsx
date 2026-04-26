"use client";

import { useState } from 'react';
import Navbar from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import VoiceAssistant from '@/app/components/voice-assistant';
import GradientText from '@/app/components/GradientText';
import { Mic, ShoppingCart, Search, ArrowRight, Star, Shield, Clock } from 'lucide-react';

const VoiceShoppingPage = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleVoiceCommand = (command) => {
    if (command.includes("search")) {
      const searchTerm = command.replace("search", "").trim();
      // Handle search
    } else if (command.includes("go to") || command.includes("navigate to")) {
      const destination = command.replace("go to", "").replace("navigate to", "").trim();
      // Handle navigation
    }
  };

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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <GradientText
              colors={["#ffffff", "#f0f0f0", "#ffffff", "#f0f0f0"]}
              animationSpeed={4}
              className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-wide"
            >
              Voice Shopping Experience
            </GradientText>
            <p className="text-xl md:text-2xl mb-8 opacity-90 font-light tracking-wide">
              Shop hands-free with our advanced voice assistant. Just speak to search, browse, and buy.
            </p>
            <button
              onClick={() => setIsVoiceActive(true)}
              className="px-8 py-4 bg-white text-[#1A1A1A] rounded-full font-semibold text-lg hover:bg-[#D4AF37] hover:text-white transition-all duration-300 transform hover:scale-105 tracking-wider"
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
            className="text-3xl md:text-4xl font-serif font-light text-center mb-12"
          >
            How It Works
          </GradientText>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-[#E5E0D8] p-6 rounded-lg shadow-lg">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif font-light mb-2 text-[#1A1A1A]">{feature.title}</h3>
                <p className="text-[#5C5C5C]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <GradientText
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={3}
            className="text-3xl md:text-4xl font-serif font-light text-center mb-12"
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
            className="text-3xl md:text-4xl font-serif font-light text-center mb-12"
          >
            Try These Commands
          </GradientText>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commands.map((command, index) => (
                  <div key={index} className="flex items-center gap-2 text-[#1A1A1A]">
                    <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                    <span>{command}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="text-center">
          <GradientText
            colors={["#D4AF37", "#1A1A1A", "#D4AF37"]}
            animationSpeed={3}
            className="text-3xl md:text-4xl font-serif font-light mb-8"
          >
            Ready to Try?
          </GradientText>
          <button
            onClick={() => setIsVoiceActive(true)}
            className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-semibold text-lg hover:bg-[#D4AF37] transition-all duration-300 transform hover:scale-105 tracking-wider"
          >
            Start Voice Shopping
          </button>
        </section>
      </main>

      {/* Voice Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <VoiceAssistant isActive={isVoiceActive} setIsActive={setIsVoiceActive} onCommand={handleVoiceCommand} />
      </div>

      <Footer />
    </div>
  );
};

export default VoiceShoppingPage; 