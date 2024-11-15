import React, { useContext, useEffect, useState } from 'react';
import { Layout, GrenadeSelection, CS2Radar } from '../../../Components';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../../../App';
import { Coordinate } from '../../../global.types';
import { isValidCS2Map } from '../../../util/validation';

import Decoy from '../../../assets/svg/decoy.svg';
import Smoke from '../../../assets/svg/smoke.svg';
import Molotov from '../../../assets/svg/molotov.svg';
import HE from '../../../assets/svg/he.svg';
import Flash from '../../../assets/svg/flash.svg';

import ancient from '../../../assets/cs2maps/ancientradar.webp';
import anubis from '../../../assets/cs2maps/anubisradar.webp';
import dust2 from '../../../assets/cs2maps/dust2radar.webp';
import inferno from '../../../assets/cs2maps/infernoradar.webp';
import mirage from '../../../assets/cs2maps/mirageradar.webp';
import nuke from '../../../assets/cs2maps/nukeradar.webp';
import overpass from '../../../assets/cs2maps/overpassradar.webp';
import vertigo from '../../../assets/cs2maps/vertigoradar.webp';

import ancientmap from '../../../assets/cs2maps/ancient.webp';
import anubismap from '../../../assets/cs2maps/anubis.webp';
import dust2map from '../../../assets/cs2maps/dust2.webp';
import infernomap from '../../../assets/cs2maps/inferno.webp';
import miragemap from '../../../assets/cs2maps/mirage.webp';
import nukemap from '../../../assets/cs2maps/nuke.webp';
import overpassmap from '../../../assets/cs2maps/overpass.webp';
import vertigomap from '../../../assets/cs2maps/vertigo.webp';

import dust2Coordinates from '../../../assets/cs2jsons/dust2.json';
import anubisCoordinates from '../../../assets/cs2jsons/anubis.json';
import vertigoCoordinates from '../../../assets/cs2jsons/vertigo.json';
import ancientCoordinates from '../../../assets/cs2jsons/ancient.json';
import infernoCoordinates from '../../../assets/cs2jsons/inferno.json';
import nukeCoordinates from '../../../assets/cs2jsons/nuke.json';
import mirageCoordinates from '../../../assets/cs2jsons/mirage.json';
import overpassCoordinates from '../../../assets/cs2jsons/overpass.json';
import { getPostByCoordinate, getPostByGrenade } from '../../../util/getPost';

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

const maps = [
   { name: 'Ancient', image: ancientmap },
   { name: 'Anubis', image: anubismap },
   { name: 'Dust 2', image: dust2map },
   { name: 'Inferno', image: infernomap },
   { name: 'Mirage', image: miragemap },
   { name: 'Nuke', image: nukemap },
   { name: 'Overpass', image: overpassmap },
   { name: 'Vertigo', image: vertigomap },
];

const grenadeIcons = {
   Decoy,
   Smoke,
   Molotov,
   HE,
   Flash,
};
const CS2Lineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   const { mapName } = useParams<{ mapName: string }>();
   const [mapImage, setMapImage] = useState('');

   // Add validation check
   if (!mapName || !isValidCS2Map(mapName)) {
      return <Navigate to="/*" replace />;
   }
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   // TOGGLE BUTTONS
   const [activeButton, setActiveButton] = useState<string | null>(null);
   const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
   const [complementCoordinates, setComplementCoordinates] = useState<
      Coordinate[]
   >([]);
   const [selectedDot, setSelectedDot] = useState<string>('');
   // Load all dots
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
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [Auth?.username, mapName]);

   const handleClick = (mapName: string) => {
      setSelectedDot('');
      navigate(`/game/CS2/lineups/${mapName}`);
   };
   // Perform filter
   useEffect(() => {
      if (!activeButton && !selectedDot) {
         !selectedDot
            ? setComplementCoordinates([])
            : setComplementCoordinates([]);
      }
      if (activeButton && selectedDot) {
         return;
      } else if (activeButton) {
         getPostByGrenade(activeButton, 'CS2', mapName!)
            .then((coords) => {
               setComplementCoordinates(coords);
            })
            .catch((error) => {
               console.error(error);
            });
      } else if (selectedDot) {
         getPostByCoordinate(selectedDot, 'CS2', mapName!)
            .then((coords) => {
               setComplementCoordinates(coords);
            })
            .catch((error) => {
               console.error(error);
            });
      }
   }, [activeButton, selectedDot]);

   return (
      <>
         <Layout>
            <div className="text-center pt-12">
               {!selectedDot && !activeButton ? (
                  <>
                     <p>
                        Please choose a landing position for your grenade or
                        select a grenade to see all possible lineups
                     </p>
                     <button
                        className="btn mt-1"
                        onClick={() =>
                           navigate(`/search/CS2/${mapName}?filter=map`)
                        }
                     >
                        Expanded Posts for {mapName}
                     </button>
                  </>
               ) : selectedDot && !activeButton ? (
                  <>
                     <p>Showing all lineups for {selectedDot}</p>
                     <button
                        className="btn mt-1"
                        onClick={() =>
                           navigate(
                              `/search/CS2/${selectedDot}+${mapName}?filter=location`,
                           )
                        }
                     >
                        Expanded Posts for {selectedDot}
                     </button>
                  </>
               ) : !selectedDot && activeButton ? (
                  <>
                     <p>Showing all lineups for {activeButton}</p>
                     <button
                        className="btn mt-1"
                        onClick={() =>
                           navigate(
                              `/search/CS2/${activeButton}+${mapName}?filter=utility`,
                           )
                        }
                     >
                        Expanded Posts for {activeButton}
                     </button>
                  </>
               ) : (
                  <>
                     <p>
                        Showing all lineups for {selectedDot} {activeButton}
                     </p>
                     <button
                        className="btn mt-1"
                        onClick={() =>
                           navigate(
                              `/search/CS2/${selectedDot}+${activeButton}+${mapName}?filter=all`,
                           )
                        }
                     >
                        Expanded Posts for {selectedDot} {activeButton}
                     </button>
                  </>
               )}
            </div>
            <div className="flex flex-1">
               <div className="flex-1 flex justify-center items-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center">
                     <CS2Radar
                        mapImage={mapImage}
                        mapName={mapName!}
                        coordinates={coordinates}
                        complementCoordinates={complementCoordinates}
                        activeButton={activeButton}
                        selectedDot={selectedDot}
                        setSelectedDot={setSelectedDot}
                        grenadeIcons={grenadeIcons}
                     />
                  </div>
               </div>
            </div>

            <div className="md:pl-32 flex flex-col-reverse md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full md:h-48 overflow-auto bg-gray-900 p-4 md:fixed bottom-0">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {maps.map((map) => (
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
                     </div>
                  ))}
               </div>
               <GrenadeSelection
                  isMobile={isMobile}
                  activeButton={activeButton}
                  setActiveButton={setActiveButton!}
               />
            </div>
         </Layout>
      </>
   );
};

export default CS2Lineups;
