import { useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { ValorantAgent } from '../../../db.types';
import axios from 'axios';

const ValorantAgents: React.FC = () => {
   const [agents, setAgents] = useState<ValorantAgent>();
   const [selectedAgentName, setSelectedAgentName] = useState<string | null>(
      null,
   );
   const navigate = useNavigate();
   const [currentAgent, setCurrentAgent] = useState<string>(
      'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png',
   );
   const [currentBackground, setCurrentBackground] = useState<string>(
      'https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/background.png',
   );
   const handleClick = (agentName: string) => {
      navigate(`/game/Valorant/agents/${agentName}/lineups`);
   };
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
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-4 ml-4 md:ml-8">
                     {agents?.data.map((agent) => (
                        <div className="agent-card" key={agent.displayName}>
                           <img
                              src={agent.displayIcon}
                              alt={agent.displayName}
                              className="agent-image cursor-pointer"
                              onClick={() => {
                                 setCurrentAgent(agent.fullPortrait);
                                 setCurrentBackground(agent.background);
                                 setSelectedAgentName(agent.displayName);
                              }}
                           />
                           <div className="agent-name">{agent.displayName}</div>
                        </div>
                     ))}
                  </div>
                  {agents?.data
                     .filter((agent) => agent.displayName === selectedAgentName)
                     .map((agent) => (
                        <div
                           className="abilities flex flex-wrap justify-center items-start gap-4 p-4"
                           key={agent.displayName}
                        >
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
                     ))}
               </div>
            </div>
         </div>

         <div className="w-screen flex justify-center mt-4 mb-4">
         <button
            className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white focus:outline-none"
            onClick={() => {
                if (selectedAgentName) {
                    handleClick(selectedAgentName);
                }
            }}
            >
            Lock In!
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
            </button>

         </div>

         <Footer />
      </>
   );
};

export default ValorantAgents;
