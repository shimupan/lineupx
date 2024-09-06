import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ValorantAgent } from '../global.types';

interface ValorantAgentContextType {
   valorantAgents: ValorantAgent['data'];
}

const ValorantAgentContext = createContext<
   ValorantAgentContextType | undefined
>(undefined);

export const ValorantAgentProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [valorantAgents, setValorantAgents] = useState<ValorantAgent['data']>(
      [],
   );

   useEffect(() => {
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            setValorantAgents(response.data.data);
         });
   }, []);

   return (
      <ValorantAgentContext.Provider value={{ valorantAgents }}>
         {children}
      </ValorantAgentContext.Provider>
   );
};

export const useValorantAgents = () => {
   const context = useContext(ValorantAgentContext);
   if (context === undefined) {
      throw new Error(
         'useValorantAgents must be used within a ValorantAgentProvider',
      );
   }
   return context;
};
