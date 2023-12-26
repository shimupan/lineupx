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

const ValorantLineups: React.FC = () => {
   const [maps, setMaps] = useState<Map[]>([]);
   const [agent, setAgent] = useState<ValorantAgent | null>(null);
   const Auth = useContext(AuthContext);
   const { agentName, mapName } = useParams<{
      agentName: string;
      mapName: string;
   }>();

   useEffect(() => {
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
         // Handle the case where agentName is undefined
         // For example, you might want to setAgent to null
         setAgent(null);
      }

      if (Auth?.accessToken && Auth.username) {
         // Your authentication related logic
      }
   }, [Auth?.username, agentName, mapName]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex flex-1 h-screen">
            <div className="flex-1 flex justify-center items-center">
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 ml-10">
                  {maps
                     .filter((map) => map.displayName === mapName)
                     .map((map) => (
                        <div
                           key={map.uuid}
                           className="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 map-container"
                        >
                           <img
                              src={map.displayIcon}
                              alt={map.displayName}
                              className="w-9/10 h-4/5 object-cover"
                              style={{ transform: 'translateX(20%)' }}
                           />
                           <div className="text-center text-white py-2">
                              {map.displayName}
                           </div>
                        </div>
                     ))}
               </div>

               {agent && (
                  <div className="abilities flex flex-wrap justify-center items-start gap-4 p-4">
                     {agent.abilities.map((ability, index) => (
                        <div
                           key={index}
                           className="ability bg-1b2838 shadow-lg rounded-lg p-2 flex flex-col items-center justify-start w-48"
                        >
                           <img
                              src={ability.displayIcon}
                              alt={ability.displayName}
                              className="ability-icon w-12 h-12 mb-2"
                           />
                           <div className="ability-name font-semibold text-center">
                              {ability.displayName}
                           </div>
                           <div className="ability-description text-sm text-gray-600 overflow-auto max-h-24 p-2">
                              {ability.description}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         <Footer />
      </>
   );
};

export default ValorantLineups;
