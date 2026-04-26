"use client"

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BlurText } from './AnimatedText';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SignatureShowcase() {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="py-32 relative overflow-hidden bg-black/40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="text-amber-500 w-5 h-5" />
              <span className="uppercase tracking-[0.3em] text-xs text-amber-500 font-bold">Product of the Month</span>
            </div>
            <BlurText 
              text="The Signature Aura Headset" 
              className="text-4xl md:text-6xl font-serif font-light mb-6 leading-tight" 
            />
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-lg">
              Crafted from aerospace-grade aluminum and wrapped in hand-stitched vegan leather. Experience acoustic perfection combined with our built-in Voice Cart AI integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="px-8 py-4 bg-white text-black rounded-full font-medium tracking-wide uppercase text-sm hover:scale-105 transition-transform flex items-center justify-center space-x-2">
                <span>Shop Now - ₹24,999</span>
                <ArrowRight size={16} />
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium tracking-wide uppercase text-sm hover:bg-white/10 transition-colors">
                View Details
              </button>
            </div>
          </div>

          {/* 3D Interactive Card */}
          <div className="lg:w-1/2 w-full perspective-[2000px]">
            <motion.div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg mx-auto rounded-3xl cursor-pointer group"
            >
              {/* Outer Glowing Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/30 to-purple-500/30 blur-md transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>
              
              {/* Card Body */}
              <div 
                style={{ transform: "translateZ(50px)" }}
                className="absolute inset-0 bg-[#0a0515]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center"
              >
                {/* Background glow inside card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full"></div>
                
                {/* Floating Image element */}
                <motion.div 
                  style={{ transform: "translateZ(100px)" }}
                  className="relative z-10 w-3/4 h-3/4 flex items-center justify-center"
                >
                  <div className="w-full h-full bg-gradient-to-tr from-gray-800 to-gray-600 rounded-full flex items-center justify-center opacity-20 absolute animate-pulse"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" 
                    alt="Signature Headset" 
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transform -rotate-12 group-hover:rotate-0 transition-transform duration-700"
                  />
                </motion.div>
                
                {/* Floating Badge */}
                <div 
                  style={{ transform: "translateZ(150px)" }}
                  className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl"
                >
                  <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Stock Level</p>
                  <p className="text-xl font-bold text-amber-500">Only 5 Left</p>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
