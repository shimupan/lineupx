import React from 'react';

const ProfileSearch: React.FC = () => {
   return (
      <div className="font-sans">
         {/* Profile banner */}
         <div className="relative w-full h-48 mb-8">
            <img
               src="https://assets.xboxservices.com/assets/4e/bc/4ebcb533-e184-42f3-833b-9aa47a81f39e.jpg?n=153142244433_Poster-Image-1084_1920x720.jpg"
               alt="Profile Banner"
               className="object-cover w-full h-full rounded-lg"
            />
         </div>

         {/* Nav bar */}
         <div className="bg-gray-800 text-white py-4 mb-8">
            <div className="flex justify-center space-x-8">
               <span className="hover:text-gray-400 cursor-pointer">
                  Overview
               </span>
               <span className="hover:text-gray-400 cursor-pointer">
                  Matches
               </span>
               <span className="hover:text-gray-400 cursor-pointer">
                  Performance
               </span>
               <span className="hover:text-gray-400 cursor-pointer">
                  Agents
               </span>
               <span className="hover:text-gray-400 cursor-pointer">Maps</span>
               <span className="hover:text-gray-400 cursor-pointer">
                  Weapons
               </span>
               <span className="hover:text-gray-400 cursor-pointer">
                  Customs
               </span>
               <span className="hover:text-gray-400 cursor-pointer">
                  Crosshairs
               </span>
               <span className="hover:text-gray-400 cursor-pointer">
                  Lineups
               </span>
            </div>
         </div>

         <div className="px-20">
            {/* PFP and username */}
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

            {/* Profile body */}
            <div className="flex gap-8 mb-8">
               <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
                  <p className="text-xl">Current Rating</p>
                  <h3 className="text-gray-500 text-sm font-semibold mt-2">
                     Radiant
                  </h3>
               </div>
               <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-[4]">
                  <p className="text-xl">Overview</p>
                  <h3 className="text-gray-500 text-sm font-semibold mt-2">
                     Wins
                  </h3>
               </div>
            </div>

            <div className="flex gap-8 mb-8">
               <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
                  <p className="text-xl">Accuracy</p>
                  <h3 className="text-gray-500 text-sm font-semibold mt-2">
                     Head
                  </h3>
                  <h3 className="text-gray-500 text-sm font-semibold mt-2">
                     Body
                  </h3>
                  <h3 className="text-gray-500 text-sm font-semibold mt-2">
                     Legs
                  </h3>
               </div>
               <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-[4]">
                  <p className="text-xl">Top Agents</p>
                  <h3 className="text-gray-500 text-sm font-semibold mt-2">
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
      </div>
   );
};

export default ProfileSearch;
