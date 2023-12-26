import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../App';
import { getAllUsers } from '../../util/getUser';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { UserType } from '../../db.types';
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
         <div className="ml-20 font-extrabold text-4xl">
            Click on an User to get more actions.
         </div>
         <div className="flex flex-col overflow-x-auto ml-20">
            <div className="sm:-mx-6 lg:-mx-8">
               <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-x-auto">
                     <table className="min-w-full text-left text-sm font-light ">
                        <thead className="border-b font-medium dark:border-neutral-500">
                           <tr>
                              <th
                                 scope="col"
                                 className="px-6 py-4 border-r dark:border-neutral-500"
                              >
                                 #
                              </th>
                              <th
                                 scope="col"
                                 className="px-6 py-4 border-r dark:border-neutral-500"
                              >
                                 ID
                              </th>
                              <th
                                 scope="col"
                                 className="px-6 py-4 border-r dark:border-neutral-500"
                              >
                                 Role
                              </th>
                              <th
                                 scope="col"
                                 className="px-6 py-4 border-r dark:border-neutral-500"
                              >
                                 Username
                              </th>
                              <th
                                 scope="col"
                                 className="px-6 py-4 border-r dark:border-neutral-500"
                              >
                                 Email
                              </th>
                              <th scope="col" className="px-6 py-4">
                                 Verified Status
                              </th>
                           </tr>
                        </thead>
                        <tbody className="cursor-pointer">
                           {users.map((user, index) => (
                              <tr
                                 className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                                 onClick={() => {
                                    navigate(`/admin/user/${user.username}`, {
                                       state: user,
                                    });
                                 }}
                                 key={user._id}
                              >
                                 <td className="whitespace-nowrap px-6 py-4 font-medium border-r dark:border-neutral-500">
                                    {index}
                                 </td>
                                 <td className="whitespace-nowrap px-6 py-4 border-r dark:border-neutral-500">
                                    {user._id}
                                 </td>
                                 <td className="whitespace-nowrap px-6 py-4 border-r dark:border-neutral-500">
                                    {user.role}
                                 </td>
                                 <td className="whitespace-nowrap px-6 py-4 border-r dark:border-neutral-500">
                                    {user.username}
                                 </td>
                                 <td className="whitespace-nowrap px-6 py-4 border-r dark:border-neutral-500">
                                    {user.email}
                                 </td>
                                 <td className="whitespace-nowrap px-6 py-4 border-r dark:border-neutral-500">
                                    {user.Verified
                                       ? 'Verified'
                                       : 'Not Verified'}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default AdminUsers;
