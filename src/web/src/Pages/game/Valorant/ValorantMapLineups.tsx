import React, { useContext, useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper, Dot } from '../../../Components';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';
import { getPostByCoordinate, getPostByGrenade } from '../../../util/getPost';
import { Coordinate, ValorantMaps, ValorantAgent } from '../../../global.types';
import { MapInteractionCSS } from 'react-map-interaction';
import { useValorant } from '../../../hooks/index';
import Modal from 'react-modal';
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
import abyssCoordinates from '../../../assets/valorantjsons/abyss.json';

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
   { name: 'Abyss', coordinates: abyssCoordinates.coordinates },
];

const ValorantLineups: React.FC = () => {
   const [isMapLoading, setIsMapLoading] = useState(true);
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
   const { agentName: rawAgentName, mapName } = useParams<{
      agentName: string;
      mapName: string;
   }>();
   const agentName = rawAgentName === 'KAYO' ? 'KAY/O' : rawAgentName;
   const [isMapLoaded, setIsMapLoaded] = useState(false);
   const handleAbilityClick = (
      ability: ValorantAgent['data'][0]['abilities'][0],
   ) => {
      if (ability === selectedAbility) {
         setSelectedAbility(null);
      } else {
         setSelectedAbility(ability);
      }
   };
   const { allAgents, setAgentDetails, allMaps } = useValorant();
   const navigate = useNavigate();
   const handleClick = (mapName: string) => {
      setSelectedDot('');
      setSelectedAbility(null);
      const formattedAgentName = agentName === 'KAY/O' ? 'KAYO' : agentName;
      navigate(
         `/game/Valorant/agents/${formattedAgentName}/lineups/${mapName}`,
      );
   };
   const [modalIsOpen, setModalIsOpen] = useState(false);
   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      fetch('https://valorant-api.com/v1/maps')
         .then((response) => response.json())
         .then((data) => {
            setMaps(data.data);
            setIsMapLoading(false);
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
         <div className="text-center ">
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
         <div className="flex flex-1 pb-48">
            <div className="flex-1 flex flex-col">
               <div className="flex justify-center items-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center">
                     <div style={{ position: 'relative' }}>
                        <MapInteractionCSS>
                        {isMapLoading ? (
                              <div className="flex justify-center items-center h-full">
                                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div> {/* Loading spinner */}
                              </div>
                           ) : ( maps
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
                                          setIsMapLoaded(true);
                                       }}
                                       style={{
                                          width: isMobile ? '100%' : '1000',
                                          maxWidth: '700px',
                                          margin: '0 auto',
                                          display: 'block',
                                       }}
                                    />
                                    {isMapLoaded &&
                                       !selectedAbility &&
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
                              ))
                           )}
                           {isMapLoaded && selectedAbility ? (
                              <>
                                 {complementCoordinates
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
                                          abilityIconUrl={
                                             selectedAbility?.displayIcon
                                          }
                                          onTouchEnd={() =>
                                             setSelectedDot(coordinate.name)
                                          }
                                       />
                                    ))}
                              </>
                           ) : (
                              agent?.abilities
                                 ?.filter(
                                    (ability) => ability.slot !== 'Passive',
                                 )
                                 ?.map((ability) =>
                                    complementCoordinates
                                       .filter(
                                          (coordinate) =>
                                             coordinate.name ===
                                             ability.displayName,
                                       )
                                       .map((coordinate, coordIndex) => (
                                          <>
                                             <Dot
                                                key={
                                                   coordinate.name + coordIndex
                                                }
                                                coordinate={coordinate}
                                                selectedDot={selectedDot}
                                                setSelectedDot={setSelectedDot}
                                                mode="CS2Lineups"
                                                special={coordinate.post}
                                                abilityIconUrl={
                                                   ability.displayIcon
                                                }
                                                onTouchEnd={() =>
                                                   setSelectedDot(
                                                      coordinate.name,
                                                   )
                                                }
                                             />
                                          </>
                                       )),
                                 )
                           )}
                        </MapInteractionCSS>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="md:pl-32 flex flex-col-reverse md:flex-row space-y-6 md:space-y-0 md:space-x-6 w-full md:h-48 overflow-auto bg-gray-900 p-4 md:fixed bottom-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
               {allMaps?.data
                  .filter(
                     (map) =>
                        ![
                           'The Range',
                           'Kasbah',
                           'District',
                           'Piazza',
                           'Drift',
                        ].includes(map.displayName),
                  )
                  .map((map) => (
                     <div
                        key={map.uuid}
                        className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition duration-300 ease-in-out relative cursor-pointer"
                        onClick={() => handleClick(map.displayName)}
                     >
                        <img
                           src={map.splash}
                           alt={map.displayName}
                           className="w-full h-full object-cover group-hover:opacity-75 transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 opacity-100 group-hover:opacity-0">
                           <div className="font-bold text-xl mb-2 text-white text-center">
                              {map.displayName}
                           </div>
                        </div>
                     </div>
                  ))}
            </div>

            {agent && (
               <div className="abilities flex flex-row md:flex-row flex-wrap items-center justify-center gap-4 p-4">
                  <div className="abilities-horizontal flex flex-row justify-center items-start gap-4">
                     {agent.abilities.map(
                        (ability, index) =>
                           ability.slot !== 'Passive' && (
                              <button
                                 key={index}
                                 className={`ability bg-1b2838 shadow-lg rounded-full p-2 flex flex-col items-center justify-start w-10 h-10 ${
                                    selectedAbility === ability
                                       ? 'bg-black'
                                       : ''
                                 }`}
                                 onClick={() => handleAbilityClick(ability)}
                              >
                                 <img
                                    src={ability.displayIcon}
                                    alt={ability.displayName}
                                    className={`ability-icon w-full h-full ${
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
                           ),
                     )}
                  </div>
               </div>
            )}

            <Modal
               isOpen={modalIsOpen}
               onRequestClose={() => setModalIsOpen(false)}
               contentLabel="Agent Selector"
               style={{
                  content: {
                     width: window.innerWidth < 768 ? '70%' : '30%',
                     height: window.innerWidth < 768 ? '30%' : '30%',
                     margin: 'auto', // Centers the modal
                     backgroundColor: '#1f2937', // Adjust as needed
                  },
               }}
            >
               <div
                  style={{
                     display: 'grid',
                     gridTemplateColumns: 'repeat(5, 1fr)',
                     gridGap: '10px',
                  }}
               >
                  {allAgents?.data.map((agent) => (
                     <div
                        key={agent.displayName}
                        style={{
                           cursor: 'pointer',
                           transition: '0.3s',
                        }}
                        onMouseOver={(e) => {
                           e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                           e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onClick={() => {
                           const selectedAgent = allAgents?.data.find(
                              (a) => a.displayName === agent.displayName,
                           );
                           if (selectedAgent) {
                              setAgentDetails((prevState) => ({
                                 ...prevState,
                                 currentAgent: selectedAgent.fullPortrait,
                                 currentBackground: selectedAgent.background,
                                 selectedAgentName: selectedAgent.displayName,
                              }));

                              navigate(
                                 `/game/Valorant/agents/${selectedAgent.displayName.replace(
                                    '/',
                                    '',
                                 )}/lineups/${mapName}`,
                              );
                           }
                           setModalIsOpen(false);
                        }}
                     >
                        <img
                           src={agent.displayIcon}
                           alt={agent.displayName}
                           style={{ width: '20px', marginRight: '10px' }}
                        />
                        {window.innerWidth >= 768 && <p>{agent.displayName}</p>}
                     </div>
                  ))}
               </div>
            </Modal>
            <button
               onClick={() => setModalIsOpen(true)}
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2 md:ml-auto"
            >
               <span>Select Agent:</span>
               {agent && (
                  <div className="flex items-center space-x-2">
                     <img
                        src={agent.displayIcon}
                        alt={agent.displayName}
                        className="w-5 h-5 rounded-full"
                     />
                     <span className="font-semibold">{agent.displayName}</span>
                  </div>
               )}
               {!agent && <span className="italic">None selected</span>}
            </button>
         </div>

         <Footer />
      </>
   );
};

export default ValorantLineups;
