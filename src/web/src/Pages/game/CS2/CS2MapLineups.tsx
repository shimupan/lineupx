import React, { useContext, useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper, Dot } from '../../../Components';
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

import dust2Coordinates from '../../../assets/cs2jsons/dust2.json';
import anubisCoordinates from '../../../assets/cs2jsons/anubis.json';
import vertigoCoordinates from '../../../assets/cs2jsons/vertigo.json';
import ancientCoordinates from '../../../assets/cs2jsons/ancient.json';
import infernoCoordinates from '../../../assets/cs2jsons/inferno.json';
import nukeCoordinates from '../../../assets/cs2jsons/nuke.json';
import mirageCoordinates from '../../../assets/cs2jsons/mirage.json';
import overpassCoordinates from '../../../assets/cs2jsons/overpass.json';

import decoy from '../../../assets/svg/decoy.svg';
import smoke from '../../../assets/svg/smoke.svg';
import molotov from '../../../assets/svg/molotov.svg';
import he from '../../../assets/svg/he.svg';
import flash from '../../../assets/svg/flash.svg';

const mapRadars = [
   { name: 'Ancient', image: ancient, coordinates: ancientCoordinates },
   { name: 'Anubis', image: anubis, coordinates: anubisCoordinates },
   { name: 'Dust 2', image: dust2, coordinates: dust2Coordinates },
   { name: 'Inferno', image: inferno, coordinates: infernoCoordinates },
   { name: 'Mirage', image: mirage, coordinates: mirageCoordinates },
   { name: 'Nuke', image: nuke, coordinates: nukeCoordinates },
   { name: 'Overpass', image: overpass, coordinates: overpassCoordinates },
   { name: 'Vertigo', image: vertigo, coordinates: vertigoCoordinates },
];

interface Coordinate {
   x: number;
   y: number;
   name: string;
}

const CS2Lineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const { mapName } = useParams<{ mapName: string }>();
   const [mapImage, setMapImage] = useState('');
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   // TOGGLE BUTTONS
   const [activeButton, setActiveButton] = useState<string | null>(null);
   const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
   const [selectedDot, setSelectedDot] = useState<string>('');

   useEffect(() => {
      const mapObject = mapRadars.find((map) => map.name === mapName);
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      if (mapObject) {
         setMapImage(mapObject.image);
         if (mapObject && mapObject.coordinates) {
            setCoordinates(mapObject.coordinates.coordinates);
         }
      }
      if (mapName === 'Dust 2') {
         setCoordinates(dust2Coordinates.coordinates);
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
               <div className="flex flex-col sm:flex-row justify-center items-center">
                  <div style={{ position: 'relative' }}>
                     <img
                        src={mapImage}
                        alt={mapName}
                        style={{
                           width: isMobile ? '100%' : '1000%',
                           maxWidth: '700px',
                           margin: '0 auto',
                           display: 'block',
                        }}
                     />
                     {coordinates.map((coordinate, index) => (
                        <Dot
                           key={index}
                           coordinate={coordinate}
                           selectedDot={selectedDot}
                           setSelectedDot={setSelectedDot}
                           mode="CS2Lineups"
                        />
                     ))}
                  </div>

                  <div className="flex flex-row sm:flex-col">
                     <button
                        onClick={() =>
                           setActiveButton(
                              activeButton === 'decoy' ? '' : 'decoy',
                           )
                        }
                     >
                        <img
                           src={decoy}
                           alt="decoy"
                           style={{
                              width: isMobile ? '96px' : '70px',
                              height: isMobile ? '96px' : '70px',
                              opacity: activeButton === 'decoy' ? 1 : 0.5,
                              filter:
                                 activeButton === 'decoy'
                                    ? 'invert(1)'
                                    : 'none',
                           }}
                        />
                     </button>
                     <button
                        onClick={() =>
                           setActiveButton(
                              activeButton === 'smoke' ? '' : 'smoke',
                           )
                        }
                     >
                        <img
                           src={smoke}
                           alt="smoke"
                           style={{
                              width: isMobile ? '96px' : '70px',
                              height: isMobile ? '96px' : '70px',
                              opacity: activeButton === 'smoke' ? 1 : 0.5,
                              filter:
                                 activeButton === 'smoke'
                                    ? 'invert(1)'
                                    : 'none',
                           }}
                        />
                     </button>
                     <button
                        onClick={() =>
                           setActiveButton(
                              activeButton === 'molotov' ? '' : 'molotov',
                           )
                        }
                     >
                        <img
                           src={molotov}
                           alt="molotov"
                           style={{
                              width: isMobile ? '96px' : '70px',
                              height: isMobile ? '96px' : '70px',
                              opacity: activeButton === 'molotov' ? 1 : 0.5,
                              filter:
                                 activeButton === 'molotov'
                                    ? 'invert(1)'
                                    : 'none',
                           }}
                        />
                     </button>
                     <button
                        onClick={() =>
                           setActiveButton(activeButton === 'he' ? '' : 'he')
                        }
                     >
                        <img
                           src={he}
                           alt="he"
                           style={{
                              width: isMobile ? '96px' : '70px',
                              height: isMobile ? '96px' : '70px',
                              opacity: activeButton === 'he' ? 1 : 0.5,
                              filter:
                                 activeButton === 'he' ? 'invert(1)' : 'none',
                           }}
                        />
                     </button>
                     <button
                        onClick={() =>
                           setActiveButton(
                              activeButton === 'flash' ? '' : 'flash',
                           )
                        }
                     >
                        <img
                           src={flash}
                           alt="flash"
                           style={{
                              width: isMobile ? '96px' : '70px',
                              height: isMobile ? '96px' : '70px',
                              opacity: activeButton === 'flash' ? 1 : 0.5,
                              filter:
                                 activeButton === 'flash'
                                    ? 'invert(1)'
                                    : 'none',
                           }}
                        />
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default CS2Lineups;
