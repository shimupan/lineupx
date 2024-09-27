import React, { useState, useEffect } from 'react';

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

   return (
      <div className="flip-container">
         <div className={`flipper ${isFlipping ? 'flip' : ''}`}>
            <span className="front">{currentNumber}</span>
            <span className="back">{number}</span>
         </div>
         <span className="view-text px-2"> views</span>
      </div>
   );
};

export default FlippingViewCount;
