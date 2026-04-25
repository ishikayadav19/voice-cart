"use client";

import { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import { motion } from "framer-motion";

export default function SplashWrapper({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasSeenSplash", "true");
    document.body.style.overflow = "auto";
  };

  if (!mounted) return null; // Prevent flash during server-side render

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleComplete} />}
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
