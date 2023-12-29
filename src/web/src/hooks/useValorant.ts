import { useState, useEffect } from 'react';
import axios from 'axios';
import { ValorantAgent, ValorantMaps } from '../db.types';

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

   useEffect(() => {
      // GET AGENTS
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            setAllAgents(response.data);
            console.log(response.data);
         });
      // GET MAPS
      axios.get('https://valorant-api.com/v1/maps').then((response) => {
         setAllMaps(response.data);
      });
   }, []);

   return {
      allAgents,
      agentDetails,
      setAgentDetails,
      allMaps,
   };
}
