import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, SideNavWrapper, Footer } from '../Components';

import axios from 'axios';

type User = {
   _id: string;
   username: string;
   email: string;
   password: string;
   Verified: boolean;
};

const ProfilePage = () => {
   const { id } = useParams<{ id: string }>();
   const [user, setUser] = useState<User>({
      _id: '',
      username: '',
      email: '',
      password: '',
      Verified: false,
   });
   useEffect(() => {
      (async () => {
         try {
            const response = await axios.get(`/user/${id}`);
            console.log(response.data);
            setUser(response.data);
         } catch (error) {
            return error;
         }
      })();
   }, [id]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="h-screen">
            <div>
               <div className="bg-gradient-to-r from-purple-900 via-blue-700 to-cyan-400 h-[300px] flex justify-center relative">
                  <img
                     src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${
                        user?.username ? user.username : 'Guest'
                     }`}
                     className="ml-[2px] rounded-md cursor-pointer absolute top-[275px] w-[100px]"
                  />
               </div>
            </div>
            <div className="w-screen h-[200px] flex flex-col justify-center items-center">
               <div>{user?.username}</div>
               <div>{user?.email}</div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default ProfilePage;
