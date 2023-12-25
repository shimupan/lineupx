import { useContext, useEffect, useRef } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../App';
import 'react-toastify/dist/ReactToastify.css';

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

         <div className="flex flex-1 h-screen">
            <div className="flex-1 flex justify-center items-center">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 ml-10">
                  {maps.map((map) => (
                     <div
                        key={map.name}
                        className="bg-gray-800 rounded overflow-hidden shadow-lg hover:shadow-2xl transition ease-in-out duration-300 cursor-pointer" // Add cursor-pointer here
                        onClick={() => handleClick(map.name)}
                     >
                        <img
                           src={map.image}
                           alt={map.name}
                           className="w-full h-60 object-cover"
                        />
                        <div className="text-center text-white py-2">
                           {map.name}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <Footer />
      </>
   );
};

export default CS2Lineups;
