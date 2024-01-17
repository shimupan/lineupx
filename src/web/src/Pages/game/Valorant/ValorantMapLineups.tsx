import React, { useContext, useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper, Dot } from '../../../Components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';
import axios from 'axios';

import splitCoordinates from '../../../assets/valorantjsons/split.json';
import bindCoordinates from '../../../assets/valorantjsons/bind.json';

interface Map {
   uuid: string;
   displayName: string;
   displayIcon: string;
   name: string;
   coordinates: Coordinate[];
   // Add other properties if needed
}

interface ValorantAgent {
   displayName: string;
   background: string;
   abilities: {
      displayName: string;
      description: string;
      displayIcon: string;
   }[];
   // Add other agent properties if needed
}

interface Ability {
   displayName: string;
   description: string;
   displayIcon: string;
   // Add other properties as needed
}

const mapRadars = [
   { name: 'Split', coordinates: splitCoordinates.coordinates },
   { name: 'Haven', coordinates: [] },
   { name: 'Bind', coordinates: bindCoordinates.coordinates },
   { name: 'Ascent', coordinates: [] },
   { name: 'Icebox', coordinates: [] },
   { name: 'Breeze', coordinates: [] },
   { name: 'Fracture', coordinates: [] },
   { name: 'Sunset', coordinates: [] },
   { name: 'Lotus', coordinates: [] },
   { name: 'Pearl', coordinates: [] },
];

interface Coordinate {
   x: number;
   y: number;
   name: string;
}

const ValorantLineups: React.FC = () => {
   const [maps, setMaps] = useState<Map[]>([]);
   const [agent, setAgent] = useState<ValorantAgent | null>(null);
   const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
   const [selectedDot, setSelectedDot] = useState<string>('');
   const Auth = useContext(AuthContext);
   const { agentName, mapName } = useParams<{
      agentName: string;
      mapName: string;
   }>();

   const handleAbilityClick = (ability: Ability) => {
      setSelectedAbility(ability);
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

            // Resize each map's displayIcon
            data.data.forEach(async (map: Map) => {
               try {
                  const response = await axios.post('/resize-image', {
                     imageUrl: map.displayIcon,
                  });
                  map.displayIcon = response.data.resizedImageUrl;
               } catch (error) {
                  const message = (error as Error).message;
                  console.error('Error resizing image:', message);
               }
            });
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

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex flex-1 h-screen">
            <div className="flex-1 flex flex-col">
               <div className="flex justify-center items-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center">
                     <div style={{ position: 'relative' }}>
                        {maps
                           .filter((map) => map.displayName === mapName)
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
                              </div>
                           ))}
                        {coordinates.map((coordinate, index) => (
                           <Dot
                              key={index}
                              coordinate={coordinate}
                              selectedDot={selectedDot}
                              setSelectedDot={setSelectedDot}
                              mode="ValorantLineups"
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
                                 selectedAbility === ability ? 'selected' : ''
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
