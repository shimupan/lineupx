// Main page of the app
import { useContext, useEffect, useRef } from 'react';
import { Header, Footer, SideNavWrapper } from '../../../Components';
import { AuthContext } from '../../../App';
import 'react-toastify/dist/ReactToastify.css';

import astra from '../../../assets/valorantagents/astra.webp';
import brimstone from '../../../assets/valorantagents/brimstone.webp';
import cypher from '../../../assets/valorantagents/cypher.webp';
import jett from '../../../assets/valorantagents/jett.webp';
import killjoy from '../../../assets/valorantagents/killjoy.webp';
import omen from '../../../assets/valorantagents/omen.webp';
import phoenix from '../../../assets/valorantagents/phoenix.webp';
import raze from '../../../assets/valorantagents/raze.webp';
import reyna from '../../../assets/valorantagents/reyna.webp';
import sage from '../../../assets/valorantagents/sage.webp';
import skye from '../../../assets/valorantagents/skye.webp';
import sova from '../../../assets/valorantagents/sova.webp';
import viper from '../../../assets/valorantagents/viper.webp';
import yoru from '../../../assets/valorantagents/yoru.webp';
import breach from '../../../assets/valorantagents/breach.webp';
import kayo from '../../../assets/valorantagents/kayo.webp';
import chamber from '../../../assets/valorantagents/chamber.webp';
import deadlock from '../../../assets/valorantagents/deadlock.webp';
import gecko from '../../../assets/valorantagents/gecko.webp';
import iso from '../../../assets/valorantagents/iso.webp';
import fade from '../../../assets/valorantagents/fade.webp';
import neon from '../../../assets/valorantagents/neon.webp';
import harbor from '../../../assets/valorantagents/harbor.webp';

const ValorantAgents: React.FC = () => {
   const Auth = useContext(AuthContext);
   const initialRender = useRef(true);

   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
      } else if (Auth?.accessToken && Auth.username) {
         // Logic after initial render and when user is authenticated
      }
   }, [Auth?.username]);

   const agents = [
      { name: 'Astra', image: astra },
      { name: 'Brimstone', image: brimstone },
      { name: 'Cypher', image: cypher },
      { name: 'Jett', image: jett },
      { name: 'Killjoy', image: killjoy },
      { name: 'Omen', image: omen },
      { name: 'Phoenix', image: phoenix },
      { name: 'Raze', image: raze },
      { name: 'Reyna', image: reyna },
      { name: 'Sage', image: sage },
      { name: 'Skye', image: skye },
      { name: 'Sova', image: sova },
      { name: 'Viper', image: viper },
      { name: 'Yoru', image: yoru },
      { name: 'Breach', image: breach },
      { name: 'Kayo', image: kayo },
      { name: 'Chamber', image: chamber },
      { name: 'Deadlock', image: deadlock },
      { name: 'Gecko', image: gecko },
      { name: 'Iso', image: iso },
      { name: 'Fade', image: fade },
      { name: 'Neon', image: neon },
      { name: 'Harbor', image: harbor},
   ];

   return (
      <>
         <Header />
         <SideNavWrapper />

         <div className="h-screen flex">
            <div className="main-content flex-col md:flex-row flex-1">
               <div className="grid-container">
                  {agents.map((agent) => (
                     <div className="agent-card" key={agent.name}>
                        <img
                           src={agent.image}
                           alt={agent.name}
                           className="agent-image"
                        />
                        <div className="agent-name">{agent.name}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <Footer />
      </>
   );
};

export default ValorantAgents;
