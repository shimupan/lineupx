import { useState } from 'react';

const Dot: React.FC<{
   xPercent: number;
   yPercent: number;
   color: string;
}> = ({ xPercent, yPercent, color }) => {
   const [isHovered, setIsHovered] = useState(false);

   const handleClick = () => {
      console.log(`Dot at (${xPercent}, ${yPercent}) was clicked.`);
   };

   const handleMouseOver = () => {
      setIsHovered(true);
      console.log(`Dot at (${xPercent}, ${yPercent}) was hovered over.`);
   };

   const handleMouseLeave = () => {
      setIsHovered(false);
   };

   const dotSize = isHovered ? 15 : 10; // Change the size based on hover state

   return (
      <div
         onClick={handleClick}
         onMouseOver={handleMouseOver}
         onMouseLeave={handleMouseLeave}
         title={`Dot at (${xPercent}, ${yPercent})`}
         style={{
            position: 'absolute',
            top: `${yPercent}%`,
            left: `${xPercent}%`,
            transform: 'translate(-50%, -50%)', // Center the dot over the point
            width: `${dotSize}px`, // Adjust the width and height based on the state
            height: `${dotSize}px`,
            borderRadius: '50%',
            backgroundColor: color,
            cursor: 'pointer', // Change the cursor to a pointer when hovering over the dot
            transition: 'width 0.3s, height 0.3s', // Add a transition to animate the width and height
         }}
      />
   );
};

export default Dot;
