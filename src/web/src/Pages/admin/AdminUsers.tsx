import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../App';
import { getAllUsers } from '../../util/getUser';
import { Footer, Header, SideNavWrapper,BottomNav } from '../../Components';
import { UserType } from '../../global.types';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';
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
                     <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
               ) : (
                  <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
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
                                       <div className="flex items-center flex-col sm:flex-row">
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
                                          <div className="ml-4 text-center sm:text-left">
                                             <div className="text-sm font-medium">
                                                {user.username}
                                             </div>
                                             <div className="text-sm text-gray-400">
                                                {user._id}
                                             </div>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
                  </div>
               )}
            </main>
         </div>
         <Footer />
         <div style={{ paddingTop: '80px' }}>{isMobile && <BottomNav />}</div>
      </div>
   );
};

export default AdminUsers;
