"use client"

import { motion } from 'framer-motion';
import { ShinyText } from './ShinyText';
import { Smartphone, Watch, Laptop, Wifi } from 'lucide-react';

export default function EcosystemIntegration() {
  const devices = [
    { icon: Smartphone, name: "iOS & Android", delay: 0 },
    { icon: Watch, name: "Smartwatches", delay: 0.2 },
    { icon: Laptop, name: "Web Platform", delay: 0.4 },
    { icon: Wifi, name: "Smart Home", delay: 0.6 }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-white border-y border-[#E5E0D8]">
      {/* Background Starfield/Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e0d8_1px,transparent_1px),linear-gradient(to_bottom,#e5e0d8_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <ShinyText 
            text="Seamless Ecosystem" 
            className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-wide drop-shadow-sm text-[#1A1A1A]" 
          />
          <p className="text-[#5C5C5C] font-light tracking-wider text-lg max-w-2xl mx-auto">
            Your voice cart is synchronized flawlessly across all your luxury devices in real-time.
          </p>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-8"></div>
        </div>

        <div className="relative max-w-4xl mx-auto h-[500px] flex items-center justify-center">
          {/* Central Hub with React Bits style Glow */}
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 60px rgba(212,175,55,0.2)", "0 0 100px rgba(230,185,166,0.3)", "0 0 60px rgba(212,175,55,0.2)"],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-36 h-36 rounded-full bg-white border border-[#D4AF37]/30 flex items-center justify-center relative z-20 backdrop-blur-2xl shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-[#E6B9A6]/10 rounded-full blur-md"></div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E6B9A6] font-serif text-4xl italic font-bold z-10 drop-shadow-sm">VC</div>
          </motion.div>

          {/* Orbiting Devices */}
          {devices.map((device, i) => {
            const angle = (i * Math.PI * 2) / devices.length;
            const radius = 180; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                whileInView={{ opacity: 1, scale: 1, x, y }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: device.delay, type: "spring", bounce: 0.4 }}
                className="absolute flex flex-col items-center z-10"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: device.delay, ease: "easeInOut" }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, boxShadow: "0 0 30px rgba(212,175,55,0.2)" }}
                    className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#D4AF37]/30 flex items-center justify-center mb-4 cursor-pointer transition-all shadow-sm relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <device.icon className="text-[#D4AF37] w-8 h-8 group-hover:text-[#E6B9A6] transition-colors drop-shadow-sm" />
                  </motion.div>
                  <span className="text-sm text-[#7A7571] uppercase tracking-widest whitespace-nowrap text-center block w-full">{device.name}</span>
                </motion.div>
              </motion.div>
            )
          })}

          {/* Luxury Pulse Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-[380px] h-[380px] rounded-full border border-[#D4AF37]/20 absolute"
            ></motion.div>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-[520px] h-[520px] rounded-full border border-[#E6B9A6]/20 absolute border-dashed"
            ></motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
