import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Header, SideNavWrapper, Footer } from '../Components';
import { AuthContext } from '../App';

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

   const Auth = useContext(AuthContext);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (Auth) {
         if (!Auth.accessToken) {

         } else {
            (async () => {
               try {
                  const response = await axios.get(`/user/${id}`);
                  console.log(response.data);
                  setUser(response.data);
                  setLoading(false);
               } catch (error) {
                  return error;
               }
            })();
         }
      } else {
   
      }
   }, [id, Auth]); 

   if (loading) {
      return (
         <>
            <Header />
            <SideNavWrapper />
            <div className="h-screen flex items-center justify-center text-center">
               <div className="bg-gray-100 rounded-lg shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
                  <div className="mb-4">
                     <div className="h-1 w-full bg-blue-200" style={{ background: 'linear-gradient(to right, #7928CA, #FF0080)' }}></div>
                     <div className="flex flex-col items-center justify-center mt-2">
                        <h5 className="text-gray-900 font-bold text-xl">Loading...</h5>
                        <p className="text-gray-600">Please wait, we are checking if the user exists.</p>
                     </div>
                  </div>
                  <div className="flex justify-center pb-3">
                     <div className="h-2 w-16 bg-blue-200 rounded-full" style={{ background: 'linear-gradient(to right, #7928CA, #FF0080)' }}></div>
                  </div>
               </div>
            </div>
            <Footer />
         </>
      );
   }

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
