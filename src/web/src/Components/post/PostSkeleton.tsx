import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostSkeleton: React.FC = () => (
   <div className="bg-transparent rounded-lg overflow-hidden shadow-md">
      <div className="relative">
         <Skeleton
            height={200}
            className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
         />
      </div>
      <div className="p-4">
         <div className="flex items-center mb-2">
            <Skeleton
               circle
               width={24}
               height={24}
               className="mr-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
            />
            <Skeleton
               width={100}
               height={16}
               className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
            />
         </div>
         <Skeleton
            width="80%"
            height={16}
            className="mb-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
         />
         <Skeleton
            width="60%"
            height={16}
            className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
         />
      </div>
   </div>
);

export default PostSkeleton;
