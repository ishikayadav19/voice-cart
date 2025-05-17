import React from 'react';

const GradientText = ({ children, colors = ["#40ffaa", "#4079ff"], animationSpeed = 3, showBorder = false, className = "" }) => {
  const gradientStyle = {
    background: `linear-gradient(90deg, ${colors.join(', ')})`,
    backgroundSize: `${colors.length * 100}% 100%`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `gradient ${animationSpeed}s linear infinite`,
  };

  const borderStyle = showBorder ? {
    border: '2px solid transparent',
    borderImage: `linear-gradient(90deg, ${colors.join(', ')}) 1`,
  } : {};

  return (
    <div
      className={className}
      style={{
        ...gradientStyle,
        ...borderStyle,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: ${colors.length * 100}% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default GradientText; 