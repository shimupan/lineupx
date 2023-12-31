import React, { useContext, useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../App';
import axios from 'axios';

interface Map {
   uuid: string;
   displayName: string;
   displayIcon: string;
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

const ValorantLineups: React.FC = () => {
   const [maps, setMaps] = useState<Map[]>([]);
   const [agent, setAgent] = useState<ValorantAgent | null>(null);
   const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
         .then((data) => setMaps(data.data));

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
         <div className="flex flex-1 h-screen mt-32 sm:mt-0">
            <div className="flex-1 flex flex-col">
               <div className="flex justify-center items-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
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
                                 style={{
                                    width: isMobile ? '100%' : '1000%',
                                    maxWidth: '700px',
                                    margin: '0 auto',
                                    display: 'block',
                                 }}
                              />
                           </div>
                        ))}
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
