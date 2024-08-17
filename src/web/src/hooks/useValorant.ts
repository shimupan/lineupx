import { useState, useEffect } from 'react';
import axios from 'axios';
import { ValorantAgent, ValorantMaps } from '../global.types';

type Agent = {
   currentAgent: string;
   currentBackground: string;
   selectedAgentName: string;
};

export default function useValorant() {
   // AGENTS
   const [allAgents, setAllAgents] = useState<ValorantAgent>();
   const [agentDetails, setAgentDetails] = useState<Agent>({
      currentAgent:
         'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png',
      currentBackground:
         'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/background.png',
      selectedAgentName: 'Gekko',
   });

   // MAPS
   const [allMaps, setAllMaps] = useState<ValorantMaps>();
   const [isLoading, setIsLoading] = useState(true); // Loading state

   useEffect(() => {
      setIsLoading(true); // Set loading to true when fetching begins

      // GET AGENTS
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            setAllAgents(response.data);
         });

      // GET MAPS
      axios
         .get('https://valorant-api.com/v1/maps')
         .then((response) => {
            setAllMaps(response.data);
         })
         .finally(() => {
            setIsLoading(false); // Set loading to false when fetching is complete
         });
   }, []);

   return {
      allAgents,
      agentDetails,
      setAgentDetails,
      allMaps,
      isLoading, // Return the loading state
   };
}
