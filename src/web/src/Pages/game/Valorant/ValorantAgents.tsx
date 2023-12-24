import { useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { ValorantAgent } from '../../../db.types';
import axios from 'axios';

const ValorantAgents: React.FC = () => {
   const [agents, setAgents] = useState<ValorantAgent>();
   const [currentAgent, setCurrentAgent] = useState<string>(
      'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png',
   );
   const [currentBackground, setCurrentBackground] = useState<string>(
      'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/background.png',
   );
   useEffect(() => {
      axios
         .get('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
         .then((response) => {
            setAgents(response.data);
         });
   }, []);

   useEffect(() => {
      console.log(agents);
   }, [agents]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex">
            <div
               style={{ backgroundImage: `url(${currentBackground})` }}
               className="bg-cover"
            >
               <img src={currentAgent} />
            </div>

            <div className="flex">
               <div className="main-content flex-col md:flex-row flex-1">
                  <div className="grid grid-cols-4 mr-8 lg:m-0 lg:grid-cols-8 gap-4">
                     {agents?.data.map((agent) => (
                        <div className="agent-card" key={agent.displayName}>
                           <img
                              src={agent.displayIcon}
                              alt={agent.displayName}
                              className="agent-image"
                              onClick={() => {
                                 setCurrentAgent(agent.fullPortrait);
                                 setCurrentBackground(agent.background);
                              }}
                           />
                           <div className="agent-name">{agent.displayName}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="w-screen flex justify-center mt-4 mb-4">
            <button className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
               Lock In!
               <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>
         </div>

         <Footer />
      </>
   );
};

export default ValorantAgents;
