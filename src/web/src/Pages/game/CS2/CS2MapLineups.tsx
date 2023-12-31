import React, { useContext, useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';

import ancient from '../../../assets/cs2maps/ancientradar.webp';
import anubis from '../../../assets/cs2maps/anubisradar.webp';
import dust2 from '../../../assets/cs2maps/dust2radar.webp';
import inferno from '../../../assets/cs2maps/infernoradar.webp';
import mirage from '../../../assets/cs2maps/mirageradar.webp';
import nuke from '../../../assets/cs2maps/nukeradar.webp';
import overpass from '../../../assets/cs2maps/overpassradar.webp';
import vertigo from '../../../assets/cs2maps/vertigoradar.webp';

import decoy from '../../../assets/svg/decoy.svg';
import smoke from '../../../assets/svg/smoke.svg';
import molotov from '../../../assets/svg/molotov.svg';
import he from '../../../assets/svg/he.svg';
import flash from '../../../assets/svg/flash.svg';

const mapRadars = [
   { name: 'Ancient', image: ancient },
   { name: 'Anubis', image: anubis },
   { name: 'Dust 2', image: dust2 },
   { name: 'Inferno', image: inferno },
   { name: 'Mirage', image: mirage },
   { name: 'Nuke', image: nuke },
   { name: 'Overpass', image: overpass },
   { name: 'Vertigo', image: vertigo },
];

const CS2Lineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const { mapName } = useParams<{ mapName: string }>();
   const [mapImage, setMapImage] = useState('');
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   // TOGGLE BUTTONS
   const [activeButton, setActiveButton] = useState<string | null>(null);
   useEffect(() => {
      const mapObject = mapRadars.find((map) => map.name === mapName);
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      if (mapObject) {
         setMapImage(mapObject.image);
      }

      if (Auth?.accessToken && Auth.username) {
         // Your authentication related logic
      }
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [Auth?.username]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex flex-1 h-screen">
            <div className="flex-1 flex justify-center items-center">
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 ml-10">
                  {mapImage && (
                     <img
                        src={mapImage}
                        alt={mapName}
                        style={{
                           width: isMobile ? '100%' : '1000%',
                           maxWidth: '900px',
                           margin: '0 auto',
                           display: 'block',
                        }}
                     />
                  )}
               </div>
               <div className="flex flex-wrap justify-center md:justify-start">
                  <button onClick={() => setActiveButton('decoy')}>
                     <img
                        src={decoy}
                        alt="decoy"
                        style={{
                           opacity: activeButton === 'decoy' ? 1 : 0.5,
                           width: '50px',
                           height: '50px',
                        }}
                     />
                  </button>
                  <button onClick={() => setActiveButton('smoke')}>
                     <img
                        src={smoke}
                        alt="smoke"
                        style={{
                           opacity: activeButton === 'smoke' ? 1 : 0.5,
                           width: '50px',
                           height: '50px',
                        }}
                     />
                  </button>
                  <button onClick={() => setActiveButton('molotov')}>
                     <img
                        src={molotov}
                        alt="molotov"
                        style={{
                           opacity: activeButton === 'molotov' ? 1 : 0.5,
                           width: '50px',
                           height: '50px',
                        }}
                     />
                  </button>
                  <button onClick={() => setActiveButton('he')}>
                     <img
                        src={he}
                        alt="he"
                        style={{
                           opacity: activeButton === 'he' ? 1 : 0.5,
                           width: '50px',
                           height: '50px',
                        }}
                     />
                  </button>
                  <button onClick={() => setActiveButton('flash')}>
                     <img
                        src={flash}
                        alt="flash"
                        style={{
                           opacity: activeButton === 'flash' ? 1 : 0.5,
                           width: '50px',
                           height: '50px',
                        }}
                     />
                  </button>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default CS2Lineups;
