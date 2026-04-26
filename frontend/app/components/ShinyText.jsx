"use client";

import { motion } from "framer-motion";

export const ShinyText = ({ text, className = "", speed = 3 }) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ backgroundPosition: "200% center" }}
      animate={{ backgroundPosition: "-200% center" }}
      transition={{
        repeat: Infinity,
        duration: speed,
        ease: "linear",
      }}
      style={{
        backgroundImage: "linear-gradient(120deg, rgba(26,26,26,1) 0%, rgba(26,26,26,1) 40%, rgba(212,175,55,1) 50%, rgba(26,26,26,1) 60%, rgba(26,26,26,1) 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent"
      }}
    >
      {text}
    </motion.div>
  );
};
