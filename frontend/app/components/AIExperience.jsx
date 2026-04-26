"use client"

import { motion } from 'framer-motion';
import { ShinyText } from './ShinyText';
import { Mic, Search, Zap, CheckCircle2 } from 'lucide-react';

export default function AIExperience() {
  const steps = [
    { icon: Mic, title: "Speak Your Desire", text: '"Find me a velvet tuxedo under $1000"' },
    { icon: Zap, title: "AI Processing", text: "Instant catalog matching & analysis" },
    { icon: CheckCircle2, title: "Perfect Match", text: "Curated selection presented" }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      {/* Background Magic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E6B9A6]/10 via-white to-white"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <ShinyText text="Intelligent Voice Shopping" className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-wide drop-shadow-sm text-[#1A1A1A]" />
          <p className="text-[#5C5C5C] font-light tracking-wide text-lg max-w-2xl mx-auto leading-relaxed">
            Voice Cart eliminates endless scrolling. Our proprietary AI understands context, style, and constraints to act as your personal shopping concierge.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">
          
          {/* Interactive AI Orb */}
          <div className="relative w-80 h-80 flex items-center justify-center perspective-[1000px]">
            {/* Core Orb */}
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ["0 0 40px rgba(212,175,55,0.4)", "0 0 60px rgba(230,185,166,0.6)", "0 0 40px rgba(212,175,55,0.4)"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-[#E6B9A6] to-[#D4AF37] flex items-center justify-center relative z-20 cursor-pointer shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] backdrop-blur-3xl"
            >
              <Mic className="text-white w-10 h-10 drop-shadow-md" />
            </motion.div>

            {/* Smoother Pulsing Audio Rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/30"
              />
            ))}

            {/* Orbiting Chat Bubbles */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-10 bg-[#FAF9F6]/90 backdrop-blur-xl border border-[#E5E0D8] p-4 rounded-2xl rounded-br-none shadow-sm z-30 max-w-[200px]"
            >
              <p className="text-sm text-[#5C5C5C] font-light italic">"Show me the latest premium smartphones."</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -right-10 bg-gradient-to-br from-[#D4AF37]/10 to-[#E6B9A6]/10 backdrop-blur-xl border border-[#D4AF37]/20 p-4 rounded-2xl rounded-tl-none shadow-sm z-30 max-w-[200px]"
            >
              <div className="flex space-x-1 mb-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-1 bg-[#D4AF37] rounded-full" />
                ))}
              </div>
              <p className="text-sm text-[#1A1A1A] font-medium tracking-wide">Curating 5 flagship matches...</p>
            </motion.div>
          </div>

          {/* Steps Timeline */}
          <div className="w-full lg:w-1/3 space-y-12 relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[#D4AF37]/50 via-[#E6B9A6]/50 to-transparent"></div>
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-6 relative z-10"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E6B9A6] flex items-center justify-center shrink-0 shadow-sm"
                >
                  <step.icon className="text-white w-5 h-5" />
                </motion.div>
                <div className="pt-2">
                  <h4 className="text-[#1A1A1A] font-medium text-xl mb-2 tracking-wide">{step.title}</h4>
                  <p className="text-[#5C5C5C] font-light leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
