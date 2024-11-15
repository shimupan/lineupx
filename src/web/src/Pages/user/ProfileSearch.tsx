import React from 'react';

const ProfileSearch: React.FC = () => {
   return (
      <div className="font-sans p-6 bg-gray-100">
         <div className="flex items-center mb-8">
            <img
               src="https://via.placeholder.com/80"
               alt="Player"
               className="rounded-full w-20 h-20 mr-6"
            />
            <div className="text-gray-800">
               <h2 className="text-2xl font-semibold">PlayerName</h2>
            </div>
         </div>

         <div className="flex gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
               <p className="text-gray-500 text-sm">Current Rating</p>
               <h3 className="text-xl font-semibold mt-2">Radiant</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
               <p className="text-gray-500 text-sm">Overview</p>
               <h3 className="text-xl font-semibold mt-2">Wins</h3>
            </div>
         </div>

         <div className="flex gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
               <p className="text-gray-500 text-sm">Accuracy</p>
               <h3 className="text-xl font-semibold mt-2">Head</h3>
               <h3 className="text-xl font-semibold mt-2">Body</h3>
               <h3 className="text-xl font-semibold mt-2">Legs</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
               <p className="text-gray-500 text-sm">Top Agents</p>
               <h3 className="text-xl font-semibold mt-2">Agent</h3>
            </div>
         </div>

         <div className="bg-white p-6 rounded-lg shadow-md">
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
