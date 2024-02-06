import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserType } from '../../global.types';
import { Header, SideNavWrapper, Footer } from '../../Components';
import { CiEdit } from 'react-icons/ci';

const AdminModifyUser: React.FC = () => {
   const [user, setUser] = useState<UserType>();
   const location = useLocation();

   useEffect(() => {
      setUser(location.state);
   }, [location.state]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="flex flex-col h-screen ml-5 lg:ml-20 p-4">
            <div className="flex items-center mb-4">
               <h1 className="text-lg font-semibold">
                  Username: {user?.username}
               </h1>
               <CiEdit
                  size={20}
                  className="ml-2 cursor-pointer text-blue-500 hover:text-blue-600"
               />
            </div>
            <div className="mb-4">
               <h1 className="text-lg font-semibold">Email: {user?.email}</h1>
            </div>
            <div className="flex items-center mb-4">
               <h1 className="text-lg font-semibold">Role: {user?.role}</h1>
               <CiEdit
                  size={20}
                  className="ml-2 cursor-pointer text-blue-500 hover:text-blue-600"
               />
            </div>
            <div className="flex items-center">
               <h1 className="text-lg font-semibold">
                  Verified: {user?.Verified}
               </h1>
               <CiEdit
                  size={20}
                  className="ml-2 cursor-pointer text-blue-500 hover:text-blue-600"
               />
            </div>
         </div>
         <Footer />
      </>
   );
};

export default AdminModifyUser;
