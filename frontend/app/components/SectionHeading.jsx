import React from 'react';
import GradientText from './GradientText';

const SectionHeading = ({ 
  title, 
  subtitle, 
  colors = ["#D4AF37", "#1A1A1A", "#D4AF37"],
  animationSpeed = 3,
  className = "",
  showUnderline = true,
  align = "center"
}) => {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}>
      <div className="relative inline-block">
        <GradientText
          colors={colors}
          animationSpeed={animationSpeed}
          className={`text-3xl md:text-4xl font-bold ${className}`}
        >
          {title}
        </GradientText>
        {showUnderline && (
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transform scale-x-75" />
        )}
      </div>
      {subtitle && (
        <p className="mt-4 text-[#5C5C5C] text-lg">
          {subtitle}
        </p>
      )}
      <style jsx>{`
        .transform {
          transition: transform 0.3s ease;
        }
        .transform:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default SectionHeading; 