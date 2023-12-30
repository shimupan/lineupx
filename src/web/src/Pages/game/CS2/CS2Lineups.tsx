import { useContext, useEffect, useRef } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
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

const CS2Lineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const initialRender = useRef(true);
   const navigate = useNavigate();

   const handleClick = (mapName: string) => {
      navigate(`/game/CS2/lineups/${mapName}`);
   };
   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
      } else if (Auth?.accessToken && Auth.username) {
      }
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
      <>
         <Header />
         <SideNavWrapper />

         <main className="bg-gradient-to-br from-purple-800 to-blue-600 min-h-screen p-4">
            <div className="container mx-auto py-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {maps.map((map) => (
                     <div
                        key={map.name}
                        className="bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:scale-105 transform transition duration-500 cursor-pointer"
                        onClick={() => handleClick(map.name)}
                     >
                        <img
                           src={map.image}
                           alt={map.name}
                           className="w-full h-48 object-cover hover:opacity-75"
                        />
                        <div className="px-6 py-4">
                           <div className="font-bold text-xl mb-2 text-white text-center">
                              {map.name}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </main>

         <Footer />
      </>
   );
};

export default CS2Lineups;
