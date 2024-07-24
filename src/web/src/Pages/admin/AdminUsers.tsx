import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../App';
import { getAllUsers } from '../../util/getUser';
import { Footer, Header, SideNavWrapper, BottomNav } from '../../Components';
import { UserType } from '../../global.types';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaCheck, FaTimes, FaUser, FaIdCard } from 'react-icons/fa';
import useIsMobile from '../../hooks/isMobile';

const AdminUsers: React.FC = () => {
   const isMobile = useIsMobile();
   const [users, setUsers] = useState<UserType[]>([]);
   const [loading, setLoading] = useState(true);
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(() => {
      if (Auth?.role) {
         setLoading(true);
         getAllUsers(Auth?.role)
            .then((response) => {
               setUsers(response);
               setLoading(false);
            })
            .catch((error) => {
               console.error('Error fetching users:', error);
               setLoading(false);
            });
      }
   }, [Auth?.role]);

   const UserCard: React.FC<{ user: UserType }> = ({ user }) => (
      <div
         className="bg-gray-800 p-4 rounded-lg mb-4 shadow-md cursor-pointer"
         onClick={() =>
            navigate(`/admin/user/${user.username}`, { state: user })
         }
      >
         <div className="flex items-center mb-3">
            <img
               className="h-12 w-12 rounded-full mr-4"
               src={
                  user.ProfilePicture ||
                  `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
               }
               alt={user.username}
            />
            <div>
               <div className="font-medium text-lg">{user.username}</div>
               <div className="text-sm text-gray-400 flex items-center">
                  <FaIdCard className="mr-1" /> {user._id.substring(0, 8)}...
               </div>
            </div>
         </div>
         <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
               <FaUser className="mr-2 text-gray-400" />
               <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {user.role}
               </span>
            </div>
            <div className="flex items-center">
               <FaEnvelope className="mr-2 text-gray-400" />
               <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center col-span-2">
               <span className="mr-2">Verified:</span>
               {user.Verified ? (
                  <FaCheck className="text-green-500" />
               ) : (
                  <FaTimes className="text-red-500" />
               )}
            </div>
         </div>
      </div>
   );

   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <Header />
         <div className="flex flex-col md:flex-row">
            {!isMobile && <SideNavWrapper />}
            <main className="flex-1 p-4 md:p-6 md:ml-32">
               <h1 className="text-2xl md:text-3xl font-bold mb-6">
                  User Management
               </h1>
               {loading ? (
                  <div className="flex justify-center items-center h-64">
                     <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
               ) : (
                  <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                     {isMobile ? (
                        <div className="p-4">
                           {users.map((user) => (
                              <UserCard key={user._id} user={user} />
                           ))}
                        </div>
                     ) : (
                        <div className="overflow-x-auto">
                           <table className="w-full min-w-max">
                              <thead className="bg-gray-700">
                                 <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                       Verified
                                    </th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-600">
                                 {users.map((user) => (
                                    <tr
                                       key={user._id}
                                       className="hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                                       onClick={() =>
                                          navigate(
                                             `/admin/user/${user.username}`,
                                             { state: user },
                                          )
                                       }
                                    >
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <img
                                                className="h-10 w-10 rounded-full mr-3"
                                                src={
                                                   user.ProfilePicture ||
                                                   `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
                                                }
                                                alt={user.username}
                                             />
                                             <div>
                                                <div className="font-medium">
                                                   {user.username}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                   {user._id}
                                                </div>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                             {user.role}
                                          </span>
                                       </td>
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <FaEnvelope className="mr-2 text-gray-400" />
                                             <span className="text-sm">
                                                {user.email}
                                             </span>
                                          </div>
                                       </td>
                                       <td className="px-4 py-4 whitespace-nowrap">
                                          {user.Verified ? (
                                             <FaCheck className="text-green-500" />
                                          ) : (
                                             <FaTimes className="text-red-500" />
                                          )}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     )}
                  </div>
               )}
            </main>
         </div>
         <Footer />
         {isMobile && (
            <div className="pb-20">
               <BottomNav />
            </div>
         )}
      </div>
   );
};

export default AdminUsers;
