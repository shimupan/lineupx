import React, { useState, useEffect } from 'react';
import { abbreviateNumber } from '../../util/updatePost';

interface FlippingViewCountProps {
  number: number;
}

const FlippingViewCount: React.FC<FlippingViewCountProps> = ({ number }) => {
  const [currentNumber, setCurrentNumber] = useState(number);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (number !== currentNumber) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrentNumber(number);
        setIsFlipping(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [number, currentNumber]);

  const displayNumber = abbreviateNumber(currentNumber);
  const newNumber = abbreviateNumber(number);

  const getPadding = (num: string) => {
    const length = num.length;
    return `pl-${Math.min(length + 2, 8)}`;  // Increase padding with number length, max of pl-8
  };

  return (
    <div className="flip-container inline-flex items-center">
      <div className={`flipper ${isFlipping ? 'flip' : ''}`}>
        <span className={`front text-white px-2 py-1 ${getPadding(displayNumber)} rounded`}>
          {displayNumber}
        </span>
        <span className={`back text-white px-2 py-1 ${getPadding(newNumber)} rounded`}>
          {newNumber}
        </span>
      </div>
      <span className="view-text px-2 text-sm"> views</span>
    </div>
  );
};

export default FlippingViewCount;