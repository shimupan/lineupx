import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../../Components';
import { FaTrophy } from 'react-icons/fa';

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
   const [timeFrame, setTimeFrame] = useState<'total' | 'monthly' | 'weekly' | 'daily'>('total');

   useEffect(() => {
      setLoading(true);
      axios.get('/leaderboard')
         .then((response) => {
            setUsers(response.data);
            setLoading(false);
         })
         .catch((error) => {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
         });
   }, []);

   const sortedUsers = [...users].sort((a, b) => b[`${timeFrame}Posts`] - a[`${timeFrame}Posts`]);

   return (
      <Layout>
         <div className="min-h-screen bg-gray-900 text-white">
            <div className="flex flex-col md:flex-row">
               <main className="flex-1 p-4 md:p-6 md:ml-32">
                  <h1 className="text-2xl md:text-3xl font-bold mb-6">User Leaderboard</h1>
                  <div className="mb-4">
                     <select
                        className="p-2 border rounded bg-gray-800 text-white"
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value as any)}
                     >
                        <option value="total">Total</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                     </select>
                  </div>
                  {loading ? (
                     <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
                     </div>
                  ) : (
                     <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                           <table className="w-full min-w-max">
                              <thead className="bg-gray-700">
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
                                 {sortedUsers.map((user, index) => (
                                    <tr
                                       key={user._id}
                                       className="hover:bg-gray-700 transition-colors duration-200"
                                    >
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <FaTrophy className={`mr-2 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-yellow-600' : 'text-gray-500'}`} />
                                             <span className="text-sm font-medium">{index + 1}</span>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <div className="flex-shrink-0 h-10 w-10">
                                                <img
                                                   className="h-10 w-10 rounded-full"
                                                   src={user.ProfilePicture || `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`}
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
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                             {user[`${timeFrame}Posts`]}
                                          </span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}
               </main>
            </div>
         </div>
      </Layout>
   );
};

export default Leaderboard;