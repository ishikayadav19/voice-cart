"use client";

import { motion, useSpring } from "framer-motion";
import { Mic, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("listening"); // "listening", "morphing", "cart", "exit"

  // Custom Cursor Tracking (React Bits style floating light)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const springX = useSpring(0, { stiffness: 100, damping: 20 });
  const springY = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX);
      springY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  useEffect(() => {
    // Extended, Smoother Animation Sequence
    const timer1 = setTimeout(() => setPhase("morphing"), 3000);
    const timer2 = setTimeout(() => setPhase("cart"), 3800);
    const timer3 = setTimeout(() => setPhase("exit"), 7000);
    const timer4 = setTimeout(() => onComplete(), 8500); // Gives time for exit slide

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ 
        y: phase === "exit" ? "-100%" : 0,
        opacity: phase === "exit" ? 0 : 1 
      }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] bg-[#030014] flex flex-col items-center justify-center overflow-hidden cursor-none"
    >
      {/* Dynamic Glowing Cursor Background */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"
      />
      {/* Inner Glowing Cursor Core */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 w-6 h-6 bg-rose-400/60 rounded-full blur-[4px] pointer-events-none z-50 border border-white/30"
      />

      <div className="relative flex flex-col items-center justify-center h-full w-full z-10">
        
        {/* Phase 1 & 2: Mic & Soundwaves */}
        {(phase === "listening" || phase === "morphing") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: phase === "morphing" ? 0 : 1, 
              scale: phase === "morphing" ? 0.3 : 1 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center absolute w-full px-4"
          >
            <div className="relative flex items-center justify-center mb-8 md:mb-12">
              {/* Outer Echo Rings */}
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full border-[1.5px] border-rose-500/40"
              />
              <motion.div
                animate={{ scale: [1, 2.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full border border-purple-500/30"
              />
              
              <div className="bg-gradient-to-br from-rose-600 via-purple-600 to-indigo-700 p-6 md:p-8 rounded-full shadow-[0_0_40px_rgba(225,29,72,0.6)] z-10">
                <Mic className="w-10 h-10 md:w-14 md:h-14 text-white" strokeWidth={1.5} />
              </div>
            </div>

            {/* Pulsing Soundwaves (Fixed height container prevents text bouncing) */}
            <div className="flex items-center justify-center gap-2 md:gap-3 h-24 md:h-32 mt-2 md:mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <motion.div
                  key={i}
                  initial={{ height: 10 }}
                  animate={{ 
                    height: [10, 30 + Math.random() * 60, 10],
                  }}
                  transition={{
                    height: {
                      repeat: Infinity,
                      duration: 0.7,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }
                  }}
                  className="w-1.5 md:w-2.5 rounded-full bg-gradient-to-t from-rose-500 via-purple-400 to-indigo-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                />
              ))}
            </div>
            
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-6 md:mt-10 text-rose-300 font-light tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm uppercase text-center"
            >
              Listening to your command...
            </motion.p>
          </motion.div>
        )}

        {/* Phase 3: Grand Cart Reveal */}
        {phase === "cart" && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="flex flex-col items-center justify-center absolute w-full"
          >
            <div className="relative mb-8">
              <motion.div
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                className="rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-rose-600 p-8 shadow-[0_0_80px_rgba(124,58,237,0.7)] relative z-10"
              >
                <ShoppingCart size={80} className="text-white" strokeWidth={1.5} />
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-serif font-light text-white tracking-[0.3em] text-center px-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              VOICE CART
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-8 mb-6 max-w-lg w-full"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-gray-300 text-xl tracking-[0.5em] uppercase font-light text-center"
            >
              The AI Marketplace
            </motion.p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
