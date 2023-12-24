import { useEffect, useState } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import axios from 'axios';
import { ValorantAgent } from '../../../db.types';

const ValorantAgents: React.FC = () => {
   const [agents, setAgents] = useState<ValorantAgent>();
   useEffect(() => {
      document.title = 'Valorant Agents';
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

         <div className="grid grid-cols-10 lg:grid-cols-8 gap-4 m-32">
            {agents?.data.map((agent, index) => {
               return (
                  <div key={index} className="border border-gray-300 lg:pl-12">
                     <img src={agent.displayIcon} height={100} width={100}/>
                  </div>
               );
            })}
         </div>

         <Footer />
      </>
   );
};

export default ValorantAgents;
