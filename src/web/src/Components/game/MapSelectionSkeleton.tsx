import React from 'react';
import Skeleton from 'react-loading-skeleton';

const MapSelectionSkeleton: React.FC = () => {
   return (
      <div className="relative w-full">
         <Skeleton
            height={200}
            className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
         />
         <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
            <Skeleton
               width={100}
               height={20}
               className="bg-gray-300 animate-pulse"
            />
         </div>
      </div>
   );
};

export default MapSelectionSkeleton;
