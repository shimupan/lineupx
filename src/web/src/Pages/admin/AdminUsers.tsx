import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../App';
import { getAllUsers } from '../../util/getUser';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { UserType } from '../../global.types';
import { useNavigate } from 'react-router-dom';

const AdminUsers: React.FC = () => {
   const [users, setUsers] = useState<UserType[]>([]);
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   useEffect(() => {
      if (Auth?.role) {
         getAllUsers(Auth?.role)
            .then((response) => {
               setUsers(response);
            })
            .catch((error) => {
               console.log(error);
            });
      }
   }, [Auth?.role]);
   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="mt-8 mb-6 ml-2 sm:ml-10 md:ml-20 text-2xl sm:text-4xl md:text-5xl font-bold text-white">
            Click on a User to get more actions.
         </div>
         <div className="mx-2 sm:mx-10 md:mx-20 overflow-x-auto">
            <table className="w-full table-auto border-collapse text-white">
               <thead className="bg-gray-700">
                  <tr>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        #
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        ID
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Role
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Username
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Email
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Verified Status
                     </th>
                  </tr>
               </thead>
               <tbody className="cursor-pointer">
                  {users.map((user, index) => (
                     <tr
                        className="border-b border-gray-600 transition duration-300 ease-in-out hover:bg-gray-600"
                        onClick={() => {
                           navigate(`/admin/user/${user.username}`, {
                              state: user,
                           });
                        }}
                        key={user._id}
                     >
                        <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                           {index}
                        </td>
                        <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                           {user._id}
                        </td>
                        <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                           {user.role}
                        </td>
                        <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                           {user.username}
                        </td>
                        <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                           {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                           {user.Verified ? 'Verified' : 'Not Verified'}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <Footer />
      </>
   );
};

export default AdminUsers;
