import React from 'react';

const ProfileSearch: React.FC = () => {
   return (
      <div className="font-sans">
         <div className="relative w-full h-48 mb-8">
            <img
               src="https://assets.xboxservices.com/assets/4e/bc/4ebcb533-e184-42f3-833b-9aa47a81f39e.jpg?n=153142244433_Poster-Image-1084_1920x720.jpg"
               alt="Profile Banner"
               className="object-cover w-full h-full rounded-lg"
            />
         </div>

         <div className="flex items-center mb-8">
            <img
               src="https://pbs.twimg.com/media/FgsO2EkaYAEivnn.jpg"
               alt="Player"
               className="rounded-full w-20 h-20 mr-6"
            />
            <div className="text-white">
               <h2 className="text-2xl font-semibold">fractioned</h2>
            </div>
         </div>

         <div className="flex gap-8 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
               <p className="text-sm">Current Rating</p>
               <h3 className="text-gray-500 text-xl font-semibold mt-2">
                  Radiant
               </h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
               <p className="text-sm">Overview</p>
               <h3 className="text-gray-500 text-xl font-semibold mt-2">
                  Wins
               </h3>
            </div>
         </div>

         <div className="flex gap-8 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
               <p className="text-sm">Accuracy</p>
               <h3 className="text-gray-500 text-xl font-semibold mt-2">
                  Head
               </h3>
               <h3 className="text-gray-500 text-xl font-semibold mt-2">
                  Body
               </h3>
               <h3 className="text-gray-500 text-xl font-semibold mt-2">
                  Legs
               </h3>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
               <p className="text-sm">Top Agents</p>
               <h3 className="text-gray-500 text-xl font-semibold mt-2">
                  Agent
               </h3>
            </div>
         </div>

         <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Match History</h3>
            <div className="flex justify-between py-2 border-b border-gray-200">
               <span>Ascent</span>
               <span className="text-gray-500">Kills: 25 | K/D: 1.5</span>
               <span className="text-green-500">Win</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
               <span>Breeze</span>
               <span className="text-gray-500">Kills: 18 | K/D: 1.0</span>
               <span className="text-red-500">Loss</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
               <span>Bind</span>
               <span className="text-gray-500">Kills: 20 | K/D: 1.2</span>
               <span className="text-green-500">Win</span>
            </div>
         </div>
      </div>
   );
};

export default ProfileSearch;
