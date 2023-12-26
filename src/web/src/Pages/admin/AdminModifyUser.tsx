import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserType } from '../../db.types';
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
         <div className="flex flex-col h-screen ml-20">
            <div className="flex">
               <h1>Username: {user?.username}</h1>
               <CiEdit size={20} className="mt-[2px] ml-[2px] cursor-pointer" />
            </div>
            <div className="flex">
               <h1>Email: {user?.email}</h1>
            </div>
            <div className="flex">
               <h1>Role: {user?.role}</h1>
               <CiEdit size={20} className="mt-[2px] ml-[2px] cursor-pointer" />
            </div>
            {/* TODO: Display rest of information and allow changing */}
         </div>
         <Footer />
      </>
   );
};

export default AdminModifyUser;
