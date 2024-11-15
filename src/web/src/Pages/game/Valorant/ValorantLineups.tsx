import React, { useEffect, useState } from 'react';
import { Layout, MapSelectionSkeleton } from '../../../Components';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import useValorant from '../../../hooks/useValorant';
import { isValidValorantAgent } from '../../../util/validation';

const MINIMUM_SKELETON_TIME = 300;

const ValorantLineups: React.FC = () => {
   const { allMaps, isLoading } = useValorant();
   const navigate = useNavigate();
   const { agentName } = useParams<{ agentName: string }>();
   const [showContent, setShowContent] = useState<boolean>(false);

   if (!isValidValorantAgent(agentName)) {
      return <Navigate to="/*" replace />;
   }

   useEffect(() => {
      if (!isLoading) {
         const timer = setTimeout(() => {
            setShowContent(true);
         }, MINIMUM_SKELETON_TIME);

         return () => clearTimeout(timer);
      }
   }, [isLoading]);

   const handleClick = (mapName: string) => {
      navigate(`/game/Valorant/agents/${agentName}/lineups/${mapName}`);
   };

   const filteredMaps = allMaps?.data.filter(
      (map) =>
         ![
            'The Range',
            'Kasbah',
            'District',
            'Piazza',
            'Drift',
            'Basic Training',
         ].includes(map.displayName),
   );

   return (
      <Layout>
         <main className="bg-gradient-to-br from-purple-800 to-blue-600 min-h-screen p-4">
            <div className="container mx-auto py-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 w-full">
                  {!showContent
                     ? Array(10)
                          .fill(null)
                          .map((_, index) => (
                             <MapSelectionSkeleton key={index} />
                          ))
                     : filteredMaps?.map((map) => (
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
      </Layout>
   );
};

export default ValorantLineups;
