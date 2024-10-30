import React from 'react';
import { ValorantMaps } from '../../../global.types';

type ValorantMapGridProps = {
   maps: ValorantMaps['data'];
   onMapClick: (mapName: string) => void;
};

const ValorantMapGrid: React.FC<ValorantMapGridProps> = ({ maps, onMapClick }) => {
   return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
         {maps.map((map) => (
            <div
               key={map.uuid}
               className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg transform transition duration-300 ease-in-out relative cursor-pointer"
               onClick={() => onMapClick(map.displayName)}
            >
               <img
                  src={map.splash}
                  alt={map.displayName}
                  className="w-full h-full object-cover group-hover:opacity-75 transition-transform duration-300 ease-in-out group-hover:scale-110"
               />
               <div className="absolute bottom-0 left-0 right-0 px-6 py-4 opacity-100 group-hover:opacity-0">
                  <div className="font-bold text-xl mb-2 text-white text-center">
                     {map.displayName}
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
};

export default ValorantMapGrid;
