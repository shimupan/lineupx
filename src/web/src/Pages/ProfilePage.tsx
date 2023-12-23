import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, SideNavWrapper, Footer, Loading } from '../Components';
import { GAMES } from '../Constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { UserType, PostType } from '../db.types';
import Posts from '../Components/Posts';

const ProfilePage = () => {
   const { id } = useParams<{ id: string }>();
   const [user, setUser] = useState<UserType>({
      _id: '',
      username: '',
      email: '',
      password: '',
      Verified: false,
   });
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState<PostType[][]>([[]]);

   // Gets called twice during dev mode
   // So there should be 2 error messages
   // If you search for an non exisitant user
   useEffect(() => {
      // Fetch Users
      axios
         .get(`/user/${id}`)
         .then((response) => {
            setUser(response.data);
            // Fetch User Posts
            // For each game that we currently support
            const postsPromises = GAMES.map((game) =>
               axios.get(`/post/${game}/${response.data._id}`),
            );

            return Promise.all(postsPromises);
         })
         .then((responses) => {
            const allPosts = responses.map((response) => response.data);
            setPosts(allPosts);
         })
         .catch((error) => {
            toast.error('Error Fetching Data');
            return error;
         })
         .finally(() => {
            setLoading(false);
         });
   }, []);

   if (loading) return <Loading />;

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="h-screen">
            <div>
               <div className="bg-gradient-to-r from-purple-900 via-blue-700 to-cyan-400 h-[300px] flex justify-center relative">
                  <img
                     src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${
                        user?.username ? user.username : ''
                     }`}
                     className="ml-[2px] rounded-md cursor-pointer absolute top-[275px] w-[100px]"
                  />
               </div>
            </div>
            <div className="w-screen h-[200px] flex flex-col justify-center items-center">
               <div>{user?.username}</div>
               <div>{user?.email}</div>
            </div>
            {GAMES.map((game, index) => {
               return (
                  <React.Fragment key={index}>
                     <div className="text-center text-4xl">{game}</div>
                     <div>
                        {posts[index].map((post) => {
                           return (
                              <Posts
                                 postData={post}
                                 key={post.landingPosition.public_id}
                              />
                           );
                        })}
                     </div>
                  </React.Fragment>
               );
            })}
         </div>


         <Footer />

         <ToastContainer position="top-center" />
      </>
   );
};

export default ProfilePage;
