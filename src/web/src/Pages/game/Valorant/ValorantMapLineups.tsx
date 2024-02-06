import React, { useContext, useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper, Dot } from '../../../Components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';
import { getPostByCoordinate, getPostByGrenade } from '../../../util/getPost';
import { Coordinate, ValorantMaps, ValorantAgent } from '../../../global.types';
import axios from 'axios';

import splitCoordinates from '../../../assets/valorantjsons/split.json';
import bindCoordinates from '../../../assets/valorantjsons/bind.json';
import lotusCoordinates from '../../../assets/valorantjsons/lotus.json';
import sunsetCoordinates from '../../../assets/valorantjsons/sunset.json';
import fractureCoordinates from '../../../assets/valorantjsons/fracture.json';
import breezeCoordinates from '../../../assets/valorantjsons/breeze.json';
import ascentCoordinates from '../../../assets/valorantjsons/ascent.json';
import pearlCoordinates from '../../../assets/valorantjsons/pearl.json';
import havenCoordinates from '../../../assets/valorantjsons/haven.json';
import iceboxCoordinates from '../../../assets/valorantjsons/icebox.json';

const mapRadars = [
   { name: 'Split', coordinates: splitCoordinates.coordinates },
   { name: 'Haven', coordinates: havenCoordinates.coordinates },
   { name: 'Bind', coordinates: bindCoordinates.coordinates },
   { name: 'Ascent', coordinates: ascentCoordinates.coordinates },
   { name: 'Icebox', coordinates: iceboxCoordinates.coordinates },
   { name: 'Breeze', coordinates: breezeCoordinates.coordinates },
   { name: 'Fracture', coordinates: fractureCoordinates.coordinates },
   { name: 'Sunset', coordinates: sunsetCoordinates.coordinates },
   { name: 'Lotus', coordinates: lotusCoordinates.coordinates },
   { name: 'Pearl', coordinates: pearlCoordinates.coordinates },
];

const ValorantLineups: React.FC = () => {
   const [maps, setMaps] = useState<ValorantMaps['data']>();
   const [agent, setAgent] = useState<ValorantAgent['data'][0] | null>(null);
   const [selectedAbility, setSelectedAbility] = useState<
      ValorantAgent['data'][0]['abilities'][0] | null
   >();
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
   const [complementCoordinates, setComplementCoordinates] = useState<
      Coordinate[]
   >([]);
   const [selectedDot, setSelectedDot] = useState<string>('');
   const Auth = useContext(AuthContext);
   const { agentName, mapName } = useParams<{
      agentName: string;
      mapName: string;
   }>();

   const handleAbilityClick = (
      ability: ValorantAgent['data'][0]['abilities'][0],
   ) => {
      if (ability === selectedAbility) {
         setSelectedAbility(null);
      } else {
         setSelectedAbility(ability);
      }
   };

   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      fetch('https://valorant-api.com/v1/maps')
         .then((response) => response.json())
         .then((data) => {
            setMaps(data.data);
         });
      if (agentName) {
         axios.get(`https://valorant-api.com/v1/agents`).then((response) => {
            const matchingAgent = response.data.data.find(
               (agent: any) =>
                  agent.displayName.toLowerCase() === agentName.toLowerCase(),
            );
            setAgent(matchingAgent);
         });
      } else {
         setAgent(null);
      }
      const mapObject = mapRadars.find((map) => map.name === mapName);

      if (mapObject && Array.isArray(mapObject.coordinates)) {
         setCoordinates(mapObject.coordinates);
      } else {
         console.error(`Invalid coordinates for map: ${mapName}`);
         setCoordinates([]);
      }

      if (Auth?.accessToken && Auth.username) {
         // Your authentication related logic
      }
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [Auth?.username, agentName, mapName]);

   useEffect(() => {
      if (!selectedAbility && !selectedDot) {
         !selectedDot
            ? setComplementCoordinates([])
            : setComplementCoordinates([]);
      }
      if (selectedAbility && selectedDot) {
         return;
      } else if (selectedAbility) {
         getPostByGrenade(
            selectedAbility.displayName,
            'Valorant',
            mapName!.toLowerCase(),
         )
            .then((coords) => {
               setComplementCoordinates(coords);
            })
            .catch((error) => {
               console.error(error);
            });
      } else if (selectedDot) {
         getPostByCoordinate(
            selectedDot,
            'Valorant',
            mapName!.toLowerCase(),
            agentName,
         )
            .then((coords) => {
               setComplementCoordinates(coords);
            })
            .catch((error) => {
               console.error(error);
            });
      }
   }, [selectedAbility, selectedDot]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="text-center pt-12">
            {!selectedDot && !selectedAbility ? (
               <>
                  <p>
                     Please choose a landing position for your grenade or select
                     a grenade to see all possible lineups
                  </p>
               </>
            ) : selectedDot && !selectedAbility ? (
               <p>Showing all lineups for {selectedDot}</p>
            ) : !selectedDot && selectedAbility ? (
               <p>Showing all lineups for {selectedAbility.displayName}</p>
            ) : (
               <p>
                  Showing all lineups for {selectedDot}{' '}
                  {selectedAbility?.displayName}
               </p>
            )}
         </div>
         <div className="flex flex-1 h-screen">
            <div className="flex-1 flex flex-col">
               <div className="flex justify-center items-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center">
                     <div style={{ position: 'relative' }}>
                        {maps
                           ?.filter((map) => map.displayName === mapName)
                           .map((map) => (
                              <div
                                 key={map.uuid}
                                 className="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 map-container flex flex-col items-center justify-center m-auto"
                              >
                                 <img
                                    src={map.displayIcon}
                                    alt={map.displayName}
                                    onLoad={(event) => {
                                       const target =
                                          event.target as HTMLImageElement;
                                       const {
                                          naturalWidth: width,
                                          naturalHeight: height,
                                       } = target;
                                       console.log(
                                          `Image dimensions: ${width}x${height}`,
                                       );
                                    }}
                                    style={{
                                       width: isMobile ? '100%' : '1000',
                                       maxWidth: '700px',
                                       margin: '0 auto',
                                       display: 'block',
                                    }}
                                 />
                                 {!selectedAbility &&
                                    complementCoordinates &&
                                    coordinates.map((coordinate, index) => (
                                       <Dot
                                          key={index}
                                          coordinate={coordinate}
                                          selectedDot={selectedDot}
                                          setSelectedDot={setSelectedDot}
                                          mode="ValorantLineups"
                                       />
                                    ))}
                              </div>
                           ))}
                        {selectedAbility
                           ? complementCoordinates
                                .filter(
                                   (coordinate) =>
                                      coordinate.name ===
                                      selectedAbility.displayName,
                                )
                                .map((coordinate, index) => (
                                   <Dot
                                      key={coordinate.name + index}
                                      coordinate={coordinate}
                                      selectedDot={selectedDot}
                                      setSelectedDot={setSelectedDot}
                                      mode="ValorantLineups"
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
                  </div>
               </div>
               {agent && (
                  <div className="abilities flex flex-col sm:flex-row items-center justify-center gap-4 p-4">
                     <div className="abilities-horizontal flex flex-row justify-center items-start gap-4">
                        {agent.abilities.map((ability, index) => (
                           <button
                              key={index}
                              className={`ability bg-1b2838 shadow-lg rounded-lg p-2 flex flex-col items-center justify-start w-full sm:w-48 ${
                                 selectedAbility === ability ? 'bg-black' : ''
                              }`}
                              onClick={() => handleAbilityClick(ability)}
                           >
                              <img
                                 src={ability.displayIcon}
                                 alt={ability.displayName}
                                 className={`ability-icon w-12 h-12 mb-2 ${
                                    selectedAbility === ability
                                       ? 'shadow-lg'
                                       : ''
                                 }`}
                                 style={{
                                    filter:
                                       selectedAbility === ability
                                          ? 'grayscale(100%)'
                                          : 'none',
                                 }}
                              />
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>
         <Footer />
      </>
   );
};

export default ValorantLineups;
