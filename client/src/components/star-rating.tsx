import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  disabled = false,
  size = 'md'
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  const handleClick = (star: number) => {
    if (readonly || disabled) return;
    onRatingChange?.(star);
  };

  const handleMouseEnter = (star: number) => {
    if (readonly || disabled) return;
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    if (readonly || disabled) return;
    setHoverRating(0);
  };

  return (
    <div className="flex space-x-1" data-testid="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        const isInteractive = !readonly && !disabled;
        
        return (
          <i
            key={star}
            className={`
              fas fa-star 
              ${sizeClasses[size]}
              ${isActive ? 'text-yellow-400' : 'text-gray-300'}
              ${isInteractive ? 'cursor-pointer hover:text-yellow-400' : ''}
              ${disabled ? 'opacity-50' : ''}
              transition-colors
            `}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            data-testid={`star-${star}`}
          />
        );
      })}
    </div>
  );
}
