import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { useValorant } from '../../../hooks/index';

const ValorantAgents: React.FC = () => {
   const {
      allAgents,
      agentDetails,
      setAgentDetails
   } = useValorant();
   const navigate = useNavigate();

   const handleClick = (agentName: string) => {
      navigate(`/game/Valorant/agents/${agentName}/lineups`);
   };

   return (
      <>
         <Header />
         <SideNavWrapper />

         <div className="flex flex-col md:flex-row">
            <div
               style={{
                  backgroundImage: `url(${agentDetails.currentBackground})`,
               }}
               className="bg-cover"
            >
               <img src={agentDetails.currentAgent} loading="lazy" />
            </div>

            <div className="flex flex-col md:flex-row">
               <div className="text-white p-5 flex flex-col">
                  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 ml-4 md:ml-8">
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
                           <div className="text-center py-2 text-base font-bold text-white overflow-hidden whitespace-nowrap overflow-ellipsis">
                              {agent.displayName}
                           </div>
                        </div>
                     ))}
                  </div>
                  {allAgents?.data
                     .filter(
                        (agent) =>
                           agent.displayName === agentDetails.selectedAgentName,
                     )
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
                                    loading="lazy"
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
         <Footer />
      </>
   );
};

export default ValorantAgents;
