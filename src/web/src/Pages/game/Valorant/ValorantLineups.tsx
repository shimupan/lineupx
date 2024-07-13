            import { Header, Footer, SideNavWrapper } from '../../../Components';
            import { useNavigate, useParams } from 'react-router-dom';
            import { useValorant } from '../../../hooks/index';

            const ValorantLineups: React.FC = () => {
               const { allMaps } = useValorant();
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
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                              {allMaps?.data
                                 .filter(
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
                                       className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition duration-300 ease-in-out relative cursor-pointer"
                                       onClick={() => handleClick(map.displayName)}
                                    >
                                       <img
                                          src={map.splash}
                                          alt={map.displayName}
                                          className="w-full h-auto sm:h-48 object-cover group-hover:opacity-75 transition-transform duration-300 ease-in-out group-hover:scale-110"
                                       />
                                       <div className="absolute bottom-0 left-0 right-0 px-6 py-4 opacity-100 group-hover:opacity-0">
                                          <div className="font-bold text-xl mb-2 text-white text-center">
                                             {map.displayName}
                                          </div>
                                       </div>
                                       {/* Open Map Text - Slide Up and Fade In */}
                                       <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-0 group-hover:-translate-y-10 pb-4">
                                          <span className="text-white text-lg font-bold bg-black bg-opacity-50 p-2 rounded">
                                             Open Map
                                          </span>
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
