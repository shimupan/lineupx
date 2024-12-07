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
               <div className="bg-gray-900 p-1 rounded-lg shadow-md flex-1">
                  <div className="pt-4 pl-4 pr-4">
                     <p className="text-xl">Current Rating</p>
                     <div className="flex items-center gap-4 mt-2">
                        <img
                           src="https://cdn3.emoji.gg/emojis/9768_Radiant_Valorant.png"
                           alt="Radiant Icon"
                           className="w-8 h-8"
                        />
                        <h3 className="text-gray-500 text-sm font-semibold">
                           Radiant
                        </h3>
                     </div>
                  </div>
                  <div className="bg-gray-800 p-4 mt-4 rounded-lg">
                     <h3 className="text-sm text-gray-400 font-semibold">
                        Peak Rating
                     </h3>
                     <div className="flex items-center gap-4 mt-2">
                        <img
                           src="https://cdn3.emoji.gg/emojis/9768_Radiant_Valorant.png"
                           alt="Radiant Icon"
                           className="w-8 h-8"
                        />
                        <h3 className="text-lg text-white font-semibold">
                           Radiant
                        </h3>
                     </div>
                  </div>
               </div>
               <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-[4]">
                  <p className="text-xl">E9: A3 Competitive Overview</p>
                  <div className="flex items-start gap-40 mt-5">
                     <div className="border-l-4 border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           Wins
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           111
                        </h3>
                     </div>

                     <div className="border-l-4 border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           KAST
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           75.4%
                        </h3>
                     </div>

                     <div className="border-l-4 border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           DDΔ/Round
                        </h3>
                        <h3 className="text-white text-xl font-semibold">29</h3>
                     </div>

                     <div className="border-l-4 border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           Kills
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           2,836
                        </h3>
                     </div>

                     <div className="border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           Deaths
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           2,271
                        </h3>
                     </div>
                  </div>

                  <div className="flex items-start gap-40 mt-5">
                     <div className="border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           Assists
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           982
                        </h3>
                     </div>

                     <div className="border-l-4 border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           ACS
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           229.2
                        </h3>
                     </div>

                     <div className="border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           KAD Ratio
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           1.68
                        </h3>
                     </div>

                     <div className="border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           Kills/Round
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           0.8
                        </h3>
                     </div>

                     <div className="border-gray-500 pl-2">
                        <h3 className="text-gray-500 text-base font-semibold">
                           First Bloods
                        </h3>
                        <h3 className="text-white text-xl font-semibold">
                           290
                        </h3>
                     </div>
                  </div>
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
