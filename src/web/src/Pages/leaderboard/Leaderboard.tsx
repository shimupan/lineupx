import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../../Components';
import { FaTrophy, FaMedal } from 'react-icons/fa';

interface User {
   _id: string;
   username: string;
   totalPosts: number;
   monthlyPosts: number;
   weeklyPosts: number;
   dailyPosts: number;
   ProfilePicture?: string;
}

const Leaderboard: React.FC = () => {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);
   const [timeFrame, setTimeFrame] = useState<
      'total' | 'monthly' | 'weekly' | 'daily'
   >('total');

   useEffect(() => {
      setLoading(true);
      axios
         .get('/leaderboard')
         .then((response) => {
            setUsers(response.data);
            setLoading(false);
         })
         .catch((error) => {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
         });
   }, []);

   const sortedUsers = [...users].sort(
      (a, b) => b[`${timeFrame}Posts`] - a[`${timeFrame}Posts`],
   );

   return (
      <Layout>
         <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
            
            <div className="container mx-auto px-4 py-8">
               <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                  Ultimate Leaderboard
               </h1>

               {loading ? (
                  <div className="flex justify-center items-center h-64">
                     <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-pink-500"></div>
                  </div>
               ) : (
                  <div className="space-y-12">
                     <div className="flex justify-center items-end mb-12">
                        <div className="flex items-end space-x-4">
                           <div className="flex flex-col items-center">
                              <img
                                 src={
                                    sortedUsers[1]?.ProfilePicture ||
                                    `https://ui-avatars.com/api/?background=random&color=fff&name=${sortedUsers[1]?.username}`
                                 }
                                 alt={sortedUsers[1]?.username}
                                 className="rounded-full border-4 border-gray-400 w-24 h-24 mb-2"
                              />
                              <div className="text-center mb-2">
                                 <p className="font-bold">
                                    {sortedUsers[1]?.username}
                                 </p>
                                 <p className="text-sm">
                                    {sortedUsers[1]?.[`${timeFrame}Posts`]}{' '}
                                    posts
                                 </p>
                              </div>
                              <div className="w-32 h-40 bg-gradient-to-t from-pink-600 to-purple-600 rounded-t-lg"></div>
                              <FaMedal className="text-4xl text-gray-400 -mt-6" />
                           </div>
                           <div className="flex flex-col items-center">
                              <img
                                 src={
                                    sortedUsers[0]?.ProfilePicture ||
                                    `https://ui-avatars.com/api/?background=random&color=fff&name=${sortedUsers[0]?.username}`
                                 }
                                 alt={sortedUsers[0]?.username}
                                 className="rounded-full border-4 border-yellow-400 w-32 h-32 mb-2"
                              />
                              <div className="text-center mb-2 text-xl">
                                 <p className="font-bold">
                                    {sortedUsers[0]?.username}
                                 </p>
                                 <p className="text-sm">
                                    {sortedUsers[0]?.[`${timeFrame}Posts`]}{' '}
                                    posts
                                 </p>
                              </div>
                              <div className="w-40 h-52 bg-gradient-to-t from-pink-600 to-purple-600 rounded-t-lg"></div>
                              <FaTrophy className="text-5xl text-yellow-400 -mt-8" />
                           </div>
                           <div className="flex flex-col items-center">
                              <img
                                 src={
                                    sortedUsers[2]?.ProfilePicture ||
                                    `https://ui-avatars.com/api/?background=random&color=fff&name=${sortedUsers[2]?.username}`
                                 }
                                 alt={sortedUsers[2]?.username}
                                 className="rounded-full border-4 border-yellow-600 w-24 h-24 mb-2"
                              />
                              <div className="text-center mb-2">
                                 <p className="font-bold">
                                    {sortedUsers[2]?.username}
                                 </p>
                                 <p className="text-sm">
                                    {sortedUsers[2]?.[`${timeFrame}Posts`]}{' '}
                                    posts
                                 </p>
                              </div>
                              <div className="w-32 h-32 bg-gradient-to-t from-pink-600 to-purple-600 rounded-t-lg"></div>
                              <FaMedal className="text-4xl text-yellow-600 -mt-6" />
                           </div>
                        </div>
                     </div>
                     <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                           <table className="w-full min-w-max">
                              <thead className="bg-gray-700 bg-opacity-50">
                                 <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       Rank
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       Posts
                                    </th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-600">
                                 {sortedUsers.slice(3).map((user, index) => (
                                    <tr
                                       key={user._id}
                                       className="hover:bg-gray-700 hover:bg-opacity-50 transition-colors duration-200"
                                    >
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <span className="text-sm font-medium">
                                                {index + 4}
                                             </span>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                   className="h-10 w-10 rounded-full"
                                                   src={
                                                      user.ProfilePicture ||
                                                      `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
                                                   }
                                                   alt={user.username}
                                                />
                                             </div>
                                             <div className="ml-4">
                                                <div className="text-sm font-medium">
                                                   {user.username}
                                                </div>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                                             {user[`${timeFrame}Posts`]}
                                          </span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </Layout>
   );
};

export default Leaderboard;
