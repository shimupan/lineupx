import React, { useContext, useEffect, useState } from 'react';
import {
   Header,
   Footer,
   SideNavWrapper,
   Dot,
   GrenadeSelection,
} from '../../../Components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';
import { Coordinate } from '../../../global.types';

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

const CS2Lineups: React.FC = () => {
   const Auth = useContext(AuthContext);
   const { mapName } = useParams<{ mapName: string }>();
   const [mapImage, setMapImage] = useState('');
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
   }, [Auth?.username]);

   // Perform filter
   useEffect(() => {
      if (!activeButton && !selectedDot) {
         !selectedDot
            ? setComplementCoordinates([])
            : setComplementCoordinates([]);
      }
      if (activeButton) {
         getPostByGrenade(activeButton, "CS2", mapName!)
            .then((coords) => {
               setComplementCoordinates(coords);
            })
            .catch((error) => {
               console.error(error);
            });
      }
      if (selectedDot) {
         getPostByCoordinate(selectedDot, "CS2", mapName!)
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
         <Header />
         <SideNavWrapper />
         <div className="text-center pt-12">
            {!selectedDot && !activeButton ? (
               <p>
                  Please choose a landing position for your grenade or select a
                  grenade to see all possible lineups
               </p>
            ) : selectedDot && !activeButton ? (
               <p>Showing all lineups for {selectedDot}</p>
            ) : !selectedDot && activeButton ? (
               <p>Showing all lineups for {activeButton}</p>
            ) : (
               <p>
                  Showing all lineups for {selectedDot} {activeButton}
               </p>
            )}
         </div>
         <div className="flex flex-1 h-screen">
            <div className="flex-1 flex justify-center items-center">
               <div className="flex flex-col sm:flex-row justify-center items-center">
                  <div className="relative mb-12">
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
                     {/*
                        Bit confusing, but basically 
                        1) if there is no active button and no selected dot, then show all dots
                        2) if there is an active button, then show only dots that match the active button
                        3) if there is a selected dot, then show only dots that match the selected dot
                        4) if there is an active button and a selected dot, then show only dots that match both
                     */}
                     {!activeButton &&
                        complementCoordinates &&
                        coordinates.map((coordinate, index) => (
                           <Dot
                              key={index}
                              coordinate={coordinate}
                              selectedDot={selectedDot}
                              setSelectedDot={setSelectedDot}
                              mode="CS2Lineups"
                           />
                        ))}
                     {activeButton
                        ? complementCoordinates
                             .filter(
                                (coordinate) =>
                                   coordinate.name ===
                                   activeButton.toLowerCase(),
                             )
                             .map((coordinate, index) => (
                                <Dot
                                   key={coordinate.name + index}
                                   coordinate={coordinate}
                                   selectedDot={selectedDot}
                                   setSelectedDot={setSelectedDot}
                                   mode="CS2Lineups"
                                   special={coordinate.post}
                                />
                             ))
                        : complementCoordinates.map((coordinate, index) => (
                             <Dot
                                key={coordinate.name + index}
                                coordinate={coordinate}
                                selectedDot={selectedDot}
                                setSelectedDot={setSelectedDot}
                                mode="CS2Lineups"
                                special={coordinate.post}
                             />
                          ))}
                  </div>

                  <GrenadeSelection
                     isMobile={isMobile}
                     activeButton={activeButton}
                     setActiveButton={setActiveButton!}
                  />
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default CS2Lineups;
