import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostPageSkeleton: React.FC = () => (
   <div className="lg:flex px-4 lg:px-8 gap-8">
      <div className="md:ml-[70px] relative lg:w-3/4 bg-black pb-4 rounded-xl overflow-hidden">
         <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <Skeleton
               height="100%"
               width="100%"
               className="absolute top-0 left-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse"
               baseColor="#e0e0e0"
               highlightColor="#f0f0f0"
            />
         </div>
         <div className="flex justify-between w-full mt-4 px-4">
            <Skeleton
               width={100}
               className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
               baseColor="#e0e0e0"
               highlightColor="#f0f0f0"
            />
            <Skeleton
               width={100}
               className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
               baseColor="#e0e0e0"
               highlightColor="#f0f0f0"
            />
         </div>
         <div className="mt-6 text-center px-4">
            <Skeleton
               width="60%"
               height={24}
               className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
               baseColor="#e0e0e0"
               highlightColor="#f0f0f0"
            />
         </div>
         <div className="flex justify-between mt-6 mx-4">
            <div className="flex items-center">
               <Skeleton
                  circle
                  width={40}
                  height={40}
                  className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse"
                  baseColor="#e0e0e0"
                  highlightColor="#f0f0f0"
               />
               <div className="ml-2">
                  <Skeleton
                     width={100}
                     className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
                     baseColor="#e0e0e0"
                     highlightColor="#f0f0f0"
                  />
                  <Skeleton
                     width={60}
                     className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
                     baseColor="#e0e0e0"
                     highlightColor="#f0f0f0"
                  />
               </div>
            </div>
            <div className="flex">
               <Skeleton
                  width={80}
                  height={32}
                  className="mr-2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
                  baseColor="#e0e0e0"
                  highlightColor="#f0f0f0"
               />
               <Skeleton
                  width={80}
                  height={32}
                  className="mr-2 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
                  baseColor="#e0e0e0"
                  highlightColor="#f0f0f0"
               />
               <Skeleton
                  width={80}
                  height={32}
                  className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
                  baseColor="#e0e0e0"
                  highlightColor="#f0f0f0"
               />
            </div>
         </div>
         <div className="mt-6 mx-4">
            <Skeleton
               height={100}
               className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
               baseColor="#e0e0e0"
               highlightColor="#f0f0f0"
            />
         </div>
         <div className="mt-6 mx-4">
            <Skeleton
               count={3}
               height={60}
               className="mb-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
               baseColor="#e0e0e0"
               highlightColor="#f0f0f0"
            />
         </div>
      </div>
      <div className="lg:flex-grow bg-black rounded-xl overflow-hidden p-4 mt-8 lg:mt-0">
         <Skeleton
            count={5}
            height={100}
            className="mb-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-md"
            baseColor="#e0e0e0"
            highlightColor="#f0f0f0"
         />
      </div>
   </div>
);

export default PostPageSkeleton;
