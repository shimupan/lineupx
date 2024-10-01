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

   // Calculate width based on the length of the number
   const numberLength = displayNumber.length;
   const dynamicWidth = `${numberLength + 0.25}ch`; 

   return (
      <div className="flex items-center whitespace-nowrap">
         <div className="flip-container">
            <div
               className={`flipper ${isFlipping ? 'flip' : ''}`}
               style={{ width: dynamicWidth }}
            >
               <div className="front">
                  <span className="text-white font-medium">
                     {displayNumber}
                  </span>
               </div>
               <div className="back">
                  <span className="text-white font-medium">{newNumber}</span>
               </div>
            </div>
         </div>
         <span className="text-white text-sm ml-1">views</span>
      </div>
   );
};

export default FlippingViewCount;
