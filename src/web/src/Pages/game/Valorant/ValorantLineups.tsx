import { useContext, useEffect, useRef } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../App';
import 'react-toastify/dist/ReactToastify.css';

import breeze from '../../../assets/valorantmaps/breeze.webp';
import ascent from '../../../assets/valorantmaps/ascent.webp';
import bind from '../../../assets/valorantmaps/bind.webp';
import haven from '../../../assets/valorantmaps/haven.webp';
import icebox from '../../../assets/valorantmaps/icebox.webp';
import split from '../../../assets/valorantmaps/split.webp';
import fracture from '../../../assets/valorantmaps/fracture.webp';
import sunset from '../../../assets/valorantmaps/sunset.webp';
import lotus from '../../../assets/valorantmaps/lotus.webp';
import pearl from '../../../assets/valorantmaps/pearl.webp';

const ValorantLineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const initialRender = useRef(true);
   const navigate = useNavigate();

   const handleClick = (mapName: string) => {
      navigate(`/game/valorant/lineups/${mapName}`);
   };
   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
      } else if (Auth?.accessToken && Auth.username) {
      }
   }, [Auth?.username]);

   const maps = [
      { name: 'Breeze', image: breeze },
      { name: 'Ascent', image: ascent },
      { name: 'Bind', image: bind },
      { name: 'Haven', image: haven },
      { name: 'Icebox', image: icebox },
      { name: 'Split', image: split },
      { name: 'Fracture', image: fracture },
      { name: 'Sunset', image: sunset },
      { name: 'Lotus', image: lotus },
      { name: 'Pearl', image: pearl },
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

export default ValorantLineups;
