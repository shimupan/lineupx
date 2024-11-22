import React, { useState } from 'react';
import { Layout } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { useValorant } from '../../../hooks/index';

interface Ability {
   slot: string;
   displayName: string;
   description: string;
   displayIcon: string;
}

interface Agent {
   displayName: string;
   displayIcon: string;
   fullPortrait: string;
   background: string;
   abilities: Ability[];
}

const ValorantAgents: React.FC = () => {
   const { allAgents, agentDetails, setAgentDetails } = useValorant();
   const navigate = useNavigate();
   const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

   const handleClick = (agentName: string) => {
      const formattedAgentName = agentName.replace('KAY/O', 'KAYO');
      navigate(`/game/Valorant/agents/${formattedAgentName}/lineups`);
   };

   // @ts-ignore
   // @ts-ignore
   return (
      <>
         <Layout>
            <div className="container mx-auto px-4 flex flex-col min-h-screen">
               <div className="flex flex-col md:flex-row flex-grow">
                 {/* Grid of Agents - Modified grid-cols for mobile */}
                 <div className="w-full md:w-1/3 p-5">
                   <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                     {allAgents?.data.map((agent) => (
                       <div
                         className="agent-card bg-gray-800 rounded-lg overflow-hidden w-full hover:scale-105 transition-transform duration-300"
                         key={agent.displayName}
                       >
                         <img
                           src={agent.displayIcon}
                           alt={agent.displayName}
                           className="w-full block transition-opacity duration-300 hover:opacity-90 cursor-pointer"
                           onClick={() => {
                             setAgentDetails((prevState) => ({
                               ...prevState,
                               currentAgent: agent.fullPortrait,
                               currentBackground: agent.background,
                               selectedAgentName: agent.displayName,
                             }));
                           }}
                           loading="lazy"
                         />
                         <div className="text-center py-2 text-xs md:text-base font-bold text-white overflow-hidden whitespace-nowrap overflow-ellipsis">
                           {agent.displayName}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                  {/* Large Agent Display */}
                  <div className="w-full md:w-2/3 bg-cover relative">
                     <div
                        style={{
                           backgroundImage: `url(${agentDetails.currentBackground})`,
                           backgroundSize: 'cover',
                           backgroundPosition: 'center',
                        }}
                        className="w-full h-full absolute top-0 left-0"
                     ></div>
                     <img
                        src={agentDetails.currentAgent}
                        loading="lazy"
                        className="w-full h-full object-contain relative z-10"
                     />
                  </div>
               </div>
            </div>

           {/* Abilities, Description, and Lock In Button */}
           <div className="mt-auto pr-0 md:pr-8"> {/* Modified padding for mobile */}
             <div className="flex flex-col p-4 rounded-lg">
               {/* Ability Buttons and Description */}
               <div className="flex flex-col md:flex-row md:justify-end md:items-start mb-4">
                 {/* Ability Buttons */}
                 <div className="w-full flex justify-between md:justify-end md:space-x-4 mb-4 md:mb-0">
                   {allAgents?.data
                     .filter(
                       (agent: Agent) =>
                         agent.displayName ===
                         agentDetails.selectedAgentName,
                     )
                     .map((agent: Agent) =>
                       agent.abilities
                         .filter(
                           (ability: Ability) =>
                             ability.slot !== 'Passive',
                         )
                         .map((ability: Ability, index: number) => (
                           <button
                             key={index}
                             className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                             onClick={() =>
                               setSelectedAbility(ability)
                             }
                           >
                             <img
                               src={ability.displayIcon}
                               alt={ability.displayName}
                               className="w-12 md:w-20 h-12 md:h-20" /* Adjusted size for mobile */
                               loading="lazy"
                             />
                           </button>
                         )),
                     )}
                 </div>
                 {/* Ability Description */}
                 <div className="w-full md:w-1/2 md:ml-8"> {/* Modified width and margin for mobile */}
                   {selectedAbility ? (
                     <>
                       <h3 className="text-white font-bold mb-2 text-xl md:text-2xl">
                         {selectedAbility.displayName}
                       </h3>
                       <p className="text-gray-300 text-sm">
                         {selectedAbility.description}
                       </p>
                     </>
                   ) : (
                     <p className="text-gray-400 text-sm">
                       Select an ability to see its description
                     </p>
                   )}
                 </div>
               </div>
             </div>
             {/* Lock In Button */}
             <div className="flex justify-center">
               <button
                 className="relative w-60 h-16 outline-none transition-all duration-100 bg-transparent border-none text-sm font-bold text-[#ddebf0] rounded-none hover:bg-[#27c39f] focus:outline-none"
                 onClick={() => {
                   if (agentDetails.selectedAgentName) {
                     handleClick(agentDetails.selectedAgentName);
                   }
                 }}
               >
                 <span className="mr-4">L O C K</span>
                 <span>I N</span>
                 <div
                   id="clip"
                   className="absolute top-0 overflow-hidden w-full h-full border-[5px] border-double border-[#2761c3] shadow-inner shadow-[#195480]"
                 ></div>
               </button>
             </div>
           </div>
         </Layout>
      </>
   );
};

export default ValorantAgents;
