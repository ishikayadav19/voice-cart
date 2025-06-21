import { Star } from 'lucide-react';

const ReviewSummary = ({ rating = 0, reviewCount = 0, showCount = true, size = 'sm' }) => {
  const starSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={starSize}
            className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        ))}
      </div>
      {showCount && reviewCount > 0 && (
        <span className="text-xs text-gray-500 ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default ReviewSummary; 