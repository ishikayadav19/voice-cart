import React from 'react';
import GradientText from './GradientText';

const SectionHeading = ({ 
  title, 
  subtitle, 
  colors = ["#E11D48", "#7C3AED", "#E11D48"],
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
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent transform scale-x-75" />
        )}
      </div>
      {subtitle && (
        <p className="mt-4 text-gray-600 text-lg">
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