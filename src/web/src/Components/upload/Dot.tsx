import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostType } from '../../global.types';

type DotProps = {
  coordinate: { x: number; y: number; name: string };
  selectedDot: string;
  setSelectedDot: React.Dispatch<React.SetStateAction<string>>;
  mode: string;
  special?: PostType;
  abilityIconUrl?: string;
  onTouchEnd?: (event: React.TouchEvent) => void; // Added touch event handler
};

const Dot: React.FC<DotProps> = ({
   coordinate,
   selectedDot,
   setSelectedDot,
   mode,
   special,
   abilityIconUrl,
}) => {
   const [isHovered, setIsHovered] = useState(false);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const navigate = useNavigate();

   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   let top, left;
   const screenWidth = window.innerWidth;
   const screenHeight = window.innerHeight;

   if (mode === 'CS2Lineups Form') {
      top = isMobile ? coordinate.y * (screenHeight / 4500) : coordinate.y / 3;
      left = isMobile
         ? coordinate.x * (screenWidth / 2100)
         : coordinate.x / 2.95;
   } else {
      top = isMobile ? coordinate.y * (screenHeight / 4200) : coordinate.y / 3;
      left = isMobile
         ? coordinate.x * (screenWidth / 2100)
         : coordinate.x / 2.95;
   }

   function handleRedirect() {
      navigate(`/game/${special?.game}/${special?.postTitle}`, {
         state: { postData: special },
      });
   }

   function changeDot() {
      if (special) {
         handleRedirect();
      } else {
         setSelectedDot(selectedDot === coordinate.name ? '' : coordinate.name);
         setIsHovered(true);
      }
   }

   return (
      (selectedDot === coordinate.name || selectedDot === '' || special) && (
         <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(selectedDot === coordinate.name)}
            onClick={changeDot}
            onTouchEnd={changeDot} // Added touch event handler
            title={coordinate.name}
            className="absolute cursor-pointer transition duration-500 ease-in-out"
            style={{ top: `${top}px`, left: `${left}px` }}
         >
            {abilityIconUrl ? (
               <img
                  src={abilityIconUrl}
                  alt="Ability Icon"
                  className="w-6 h-6"
               /> // Adjust the size as needed
            ) : (
               <div className="bg-blue-500 rounded-full w-2.5 h-2.5 hover:ring-4 hover:ring-blue-300"></div>
            )}
            {isHovered && (
               <div
                  className="absolute bg-white text-black p-2 mt-2 rounded shadow-lg z-50"
                  style={{
                     bottom: '100%',
                     left: '50%',
                     transform: 'translateX(-50%)',
                  }}
               >
                  {coordinate.name}
               </div>
            )}
         </div>
      )
   );
};

export default Dot;
