import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../../Components';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface User {
   _id: string;
   username: string;
   totalPosts: number;
   ProfilePicture?: string;
}

const Leaderboard: React.FC = () => {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(true);

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

   const sortedUsers = [...users].sort((a, b) => b.totalPosts - a.totalPosts);

   const UserLink: React.FC<{ user: User; children: React.ReactNode }> = ({
      user,
      children,
   }) => (
      <Link
         to={`/user/${user?.username}`}
         className="hover:text-blue-400 transition-colors duration-200"
      >
         {children}
      </Link>
   );

   return (
      <Layout>
         <div className="min-h-screen text-white">
            <div className="container mx-auto px-4 py-8">
               <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
                  Ultimate Leaderboard
               </h1>

               {loading ? (
                  <div className="flex justify-center items-center h-64">
                     <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-2 border-b-2 border-pink-500"></div>
                  </div>
               ) : (
                  <div className="space-y-8 md:space-y-12">
                     <div className="flex justify-center items-end mb-8 md:mb-12">
                        <div className="flex items-end space-x-2 md:space-x-4">
                           {[1, 0, 2].map((index) => (
                              <UserLink key={index} user={sortedUsers[index]}>
                                 <div className="flex flex-col items-center">
                                    <img
                                       src={
                                          sortedUsers[index]?.ProfilePicture ||
                                          `https://ui-avatars.com/api/?background=random&color=fff&name=${sortedUsers[index]?.username}`
                                       }
                                       alt={sortedUsers[index]?.username}
                                       className={`rounded-full border-4 ${
                                          index === 0
                                             ? 'border-yellow-400 w-20 h-20 md:w-32 md:h-32'
                                             : 'border-gray-400 w-16 h-16 md:w-24 md:h-24'
                                       } mb-2`}
                                    />
                                    <div
                                       className={`text-center mb-2 ${index === 0 ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}
                                    >
                                       <p className="font-bold">
                                          {sortedUsers[index]?.username}
                                       </p>
                                       <p className="text-xs md:text-sm">
                                          {sortedUsers[index]?.totalPosts} posts
                                       </p>
                                    </div>
                                    <div
                                       className={`w-${
                                          index === 0
                                             ? '24 md:w-40'
                                             : '20 md:w-32'
                                       } h-${
                                          index === 0
                                             ? '32 md:h-52'
                                             : index === 1
                                               ? '24 md:h-40'
                                               : '20 md:h-32'
                                       } bg-gradient-to-t from-pink-600 to-purple-600 rounded-t-lg`}
                                    ></div>
                                    {index === 0 ? (
                                       <FaTrophy className="text-3xl md:text-5xl text-yellow-400 -mt-6 md:-mt-8" />
                                    ) : (
                                       <FaMedal
                                          className={`text-2xl md:text-4xl ${
                                             index === 1
                                                ? 'text-gray-400'
                                                : 'text-yellow-600'
                                          } -mt-4 md:-mt-6`}
                                       />
                                    )}
                                 </div>
                              </UserLink>
                           ))}
                        </div>
                     </div>
                     <div className="bg-gray-800 bg-opacity-50 shadow-lg rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                           <table className="w-full">
                              <thead className="bg-gray-700 bg-opacity-50">
                                 <tr>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       Rank
                                    </th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       User
                                    </th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
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
                                       <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <span className="text-xs md:text-sm font-medium">
                                                {index + 4}
                                             </span>
                                          </div>
                                       </td>
                                       <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                                                <img
                                                   className="h-8 w-8 md:h-10 md:w-10 rounded-full"
                                                   src={
                                                      user.ProfilePicture ||
                                                      `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
                                                   }
                                                   alt={user.username}
                                                />
                                             </div>
                                             <div className="ml-2 md:ml-4">
                                                <UserLink user={user}>
                                                   <div className="text-xs md:text-sm font-medium">
                                                      {user.username}
                                                   </div>
                                                </UserLink>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-2 md:px-4 py-2 md:py-4 whitespace-nowrap">
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                                             {user.totalPosts}
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
