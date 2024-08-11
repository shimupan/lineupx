import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MapSelectionSkeleton: React.FC = () => {
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
         {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
               <Skeleton height={200} />
               <div className="p-4">
                  <Skeleton height={20} width="80%" />
               </div>
            </div>
         ))}
      </div>
   );
};

export default MapSelectionSkeleton;
