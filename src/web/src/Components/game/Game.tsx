import React, { useEffect, useRef } from 'react';
import { Tilt } from 'react-tilt';
import { Link } from 'react-router-dom';

type GameProps = {
   game: string;
   name: string;
};

const Game: React.FC<GameProps> = ({ game, name }) => {
   const cardRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const card = cardRef.current;

      if (card) {
         const moveShimmer = (e: MouseEvent) => {
            const x = e.pageX - card.offsetLeft;
            const y = e.pageY - card.offsetTop;

            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
         };

         card.addEventListener('mousemove', moveShimmer);

         return () => {
            card.removeEventListener('mousemove', moveShimmer);
         };
      }
   }, []);

   return (
      <>
         <div className="flex flex-row items-center justify-center space-x-4">
            <Tilt className="Tilt" options={{ max: 15, scale: 1.05 }}>
               <div
                  className="w-64 h-128 p-4 md:w-64 md:h-128 Tilt-inner"
                  ref={cardRef}
               >
                  <Link to={game}>
                     <img
                        className="w-full h-full object-cover cursor-pointer transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl image-glow-on-hover"
                        src={name}
                        alt={game}
                     />
                  </Link>
               </div>
            </Tilt>
         </div>
      </>
   );
};

export default Game;
