import { useState, useEffect } from 'react';

type DotProps = {
   coordinate: { x: number; y: number; name: string };
   selectedDot: string;
   setSelectedDot: React.Dispatch<React.SetStateAction<string>>;
   mode: string;
};

const Dot: React.FC<DotProps> = ({ coordinate, selectedDot, setSelectedDot, mode }) => {
   const [isHovered, setIsHovered] = useState(false);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

   useEffect(() => {
      window.addEventListener("resize", () => {
         setIsMobile(window.innerWidth <= 768);
      });
   }, []);
   let top,left;
   const screenWidth = window.innerWidth;
   const screenHeight = window.innerHeight;
   
   if(mode === "ValorantLineups"){
      top = isMobile ? coordinate.y * (screenHeight / 4500) : coordinate.y / 3;
      left = isMobile ? coordinate.x * (screenWidth / 2100) : coordinate.x / 2.95;
   }else{


      top = isMobile ? coordinate.y * (screenHeight / 4500) : coordinate.y / 3;
      left = isMobile ? coordinate.x * (screenWidth / 2100) : coordinate.x / 2.95;
   }


   function changeDot() {
      if(selectedDot === coordinate.name) {
         setSelectedDot("")
      } else {
         setSelectedDot(coordinate.name);
         setIsHovered(true);
      };
   }

   return (
      (selectedDot === coordinate.name || selectedDot === "") && (
         <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
               if (selectedDot !== coordinate.name) {
                 setIsHovered(false);
               }
             }}
            onClick={changeDot}
            title={coordinate.name}
            className="absolute bg-blue-500 rounded-full w-2.5 h-2.5 hover:ring-4 hover:ring-blue-300 cursor-pointer transition duration-500 ease-in-out"
            style={{ top: `${top}px`, left: `${left}px` }}
         >
            {isHovered && (
               <div
                  className="absolute bg-white text-black p-2 mt-2 rounded shadow-lg transition duration-500 ease-in-out z-50"
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