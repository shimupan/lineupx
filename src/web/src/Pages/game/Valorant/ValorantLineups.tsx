import { Header, Footer, SideNavWrapper } from '../../../Components';
import { useNavigate, useParams } from 'react-router-dom';
import { useValorant } from '../../../hooks/index';
import 'react-toastify/dist/ReactToastify.css';

const ValorantLineups: React.FC = () => {
   const { allMaps } = useValorant('MAP');
   const navigate = useNavigate();
   const { agentName } = useParams<{ agentName: string }>();

   const handleClick = (mapName: string) => {
      navigate(`/game/Valorant/agents/${agentName}/lineups/${mapName}`);
   };
   return (
      <>
         <Header />
         <SideNavWrapper />
         <main className="bg-gradient-to-br from-purple-800 to-blue-600 min-h-screen p-4">
            <div className="container mx-auto py-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {allMaps
                     ?.data.filter(
                        (map) =>
                           ![
                              'The Range',
                              'Kasbah',
                              'District',
                              'Piazza',
                              'Drift',
                           ].includes(map.displayName),
                     )
                     .map((map) => (
                        <div
                           key={map.uuid}
                           className="bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:scale-105 transform transition duration-500 cursor-pointer"
                           onClick={() => handleClick(map.displayName)}
                        >
                           <img
                              src={map.splash}
                              alt={map.displayName}
                              className="w-full h-auto sm:h-48 object-cover hover:opacity-75"
                           />
                           <div className="px-6 py-4">
                              <div className="font-bold text-xl mb-2 text-white text-center">
                                 {map.displayName}
                              </div>
                           </div>
                        </div>
                     ))}
               </div>
            </div>
         </main>
         <Footer />
      </>
   );
};

export default ValorantLineups;
