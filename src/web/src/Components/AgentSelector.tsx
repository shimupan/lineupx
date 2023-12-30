import React, { useState } from 'react';
import { ValorantAgent } from '../global.types';

interface AgentSelectorProps {
   agents?: ValorantAgent['data'];
   onSelectAgent: (agent: ValorantAgent['data'][number]) => void;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
   agents,
   onSelectAgent,
}) => {
   const [showDropdown, setShowDropdown] = useState(false);
   const [selectedAgent, setSelectedAgent] = useState<
      ValorantAgent['data'][number] | null
   >(null);

   const handleAgentSelect = (agent: ValorantAgent['data'][number]) => {
      setSelectedAgent(agent);
      onSelectAgent(agent);
      setShowDropdown(false);
   };

   return (
      <>
         <div className="relative">
            <button
               type="button"
               onClick={() => setShowDropdown(!showDropdown)}
               className="bg-[#edf2f7] text-black flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left bg-grey-200 text-dark-grey-900 rounded-md"
            >
               {selectedAgent ? (
                  <>
                     <img
                        src={selectedAgent.displayIcon}
                        alt={selectedAgent.displayName}
                        className="w-6 h-6 mr-2 rounded-full"
                     />
                     {selectedAgent.displayName}
                  </>
               ) : (
                  '--'
               )}
               <span className="ml-2">▼</span>
            </button>
            {showDropdown && agents && (
               <div className="absolute z-10 w-full mt-1 grid grid-cols-3 gap-2 bg-white border border-gray-300 rounded-md shadow-lg p-2">
                  {agents.map((agent) => (
                     <div
                        key={agent.uuid}
                        className="cursor-pointer hover:bg-gray-100 flex text-black items-center w-full text-sm font-medium outline-none text-dark-grey-900 rounded-2xl"
                        onClick={() => handleAgentSelect(agent)}
                     >
                        <img
                           src={agent.displayIcon}
                           alt={agent.displayName}
                           className="w-6 h-6 mr-2 rounded-full"
                        />
                        {agent.displayName}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </>
   );
};

export default AgentSelector;
