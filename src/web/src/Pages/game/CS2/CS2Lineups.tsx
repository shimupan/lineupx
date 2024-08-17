import React, { useContext, useEffect, useRef, useState } from 'react';
import { Layout, MapSelectionSkeleton } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../App';

import ancient from '../../../assets/cs2maps/ancient.webp';
import anubis from '../../../assets/cs2maps/anubis.webp';
import dust2 from '../../../assets/cs2maps/dust2.webp';
import inferno from '../../../assets/cs2maps/inferno.webp';
import mirage from '../../../assets/cs2maps/mirage.webp';
import nuke from '../../../assets/cs2maps/nuke.webp';
import overpass from '../../../assets/cs2maps/overpass.webp';
import vertigo from '../../../assets/cs2maps/vertigo.webp';

const MINIMUM_SKELETON_TIME = 100;

const CS2Lineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const initialRender = useRef(true);
   const navigate = useNavigate();
   const [showContent, setShowContent] = useState<boolean>(false);

   const handleClick = (mapName: string) => {
      navigate(`/game/CS2/lineups/${mapName}`);
   };

   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
      } else if (Auth?.accessToken && Auth.username) {
      }

      const timer = setTimeout(() => {
         setShowContent(true);
      }, MINIMUM_SKELETON_TIME);

      return () => clearTimeout(timer);
   }, [Auth?.username]);

   const maps = [
      { name: 'Ancient', image: ancient },
      { name: 'Anubis', image: anubis },
      { name: 'Dust 2', image: dust2 },
      { name: 'Inferno', image: inferno },
      { name: 'Mirage', image: mirage },
      { name: 'Nuke', image: nuke },
      { name: 'Overpass', image: overpass },
      { name: 'Vertigo', image: vertigo },
   ];

   return (
      <Layout>
         <main className="bg-gradient-to-br from-purple-800 to-blue-600 min-h-screen p-4 flex justify-center items-center">
            <div className="container mx-auto py-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 w-full">
                  {!showContent
                     ? Array(8)
                          .fill(null)
                          .map((_, index) => (
                             <MapSelectionSkeleton key={index} />
                          ))
                     : maps.map((map) => (
                          <div
                             key={map.name}
                             className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition duration-300 ease-in-out relative cursor-pointer"
                             onClick={() => handleClick(map.name)}
                          >
                             <img
                                src={map.image}
                                alt={map.name}
                                className="w-full h-auto sm:h-48 object-cover group-hover:opacity-75 transition-transform duration-300 ease-in-out group-hover:scale-110"
                             />
                             <div className="absolute bottom-0 left-0 right-0 px-6 py-4 opacity-100 group-hover:opacity-0">
                                <div className="font-bold text-xl mb-2 text-white text-center">
                                   {map.name}
                                </div>
                             </div>
                             <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-0 group-hover:-translate-y-10 pb-4">
                                <span className="text-white text-lg font-bold bg-black bg-opacity-50 p-2 rounded">
                                   Open Map
                                </span>
                             </div>
                          </div>
                       ))}
               </div>
            </div>
         </main>
      </Layout>
   );
};

export default CS2Lineups;
