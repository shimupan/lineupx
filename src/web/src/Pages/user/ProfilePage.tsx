import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
   Header,
   SideNavWrapper,
   Footer,
   Loading,
   Posts,
   ProfileEdit,
} from '../../Components';
import { getUserByUsername } from '../../util/getUser';
import { GAMES } from '../../Constants';
import { AuthContext } from '../../App';
import { UserType, PostType } from '../../global.types';
import { sendVerificationEmail } from '../../util/sendVerificationEmail';
import { CiEdit } from 'react-icons/ci';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ProfilePage = () => {
   const { id } = useParams<{ id: string }>();
   const [user, setUser] = useState<UserType>({
      role: '',
      _id: '',
      username: '',
      email: '',
      password: '',
      Verified: false,
   });
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const [open, setOpen] = useState(false);
   const Auth = useContext(AuthContext);
   const verified = Auth?.Verified;

   // Gets called twice during dev mode
   // So there should be 2 error messages
   // If you search for an non exisitant user
   useEffect(() => {
      // Fetch Users
      getUserByUsername(id!)
         .then((response) => {
            setUser(response);
            // Fetch User Posts
            // For each game that we currently support
            const postsPromises = GAMES.map((game) =>
               axios.get(`/post/${game}/${response._id}`),
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

   function handleVerification() {
      const id = toast.loading('Sending verification email...');
      sendVerificationEmail(user).then((response) => {
         toast.update(id, response);
      });
   }

   if (loading) return <Loading />;

   return (
      <>
         <Header />
         <SideNavWrapper />
         {open && Auth?.username == user.username ? (
            <div className="h-screen">
               <ProfileEdit user={user} setOpen={setOpen} />
            </div>
         ) : (
            <div className="min-h-screen pb-40">
               <div>
                  <div className="bg-gradient-to-r from-purple-900 via-blue-700 to-cyan-400 h-[300px] flex justify-center relative">
                     <div className="w-full h-[200px] flex flex-col justify-center items-center">
                        {!verified && (
                           <div
                              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-md"
                              role="alert"
                           >
                              <p className="font-bold">Verification Needed</p>
                              <p>
                                 Your account is not verified. Please check your
                                 email to verify your account.
                              </p>
                              <button
                                 className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                 onClick={handleVerification}
                              >
                                 Send Verification Email
                              </button>
                           </div>
                        )}
                     </div>
                     <img
                        src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${
                           user?.username ? user.username : ''
                        }`}
                        className="ml-[2px] rounded-md cursor-pointer absolute top-[275px] w-[100px]"
                     />
                  </div>
               </div>
               <div className="w-full h-[225px] flex flex-col justify-center items-center">
                  {Auth?.username == user.username && (
                     <div>
                        Edit Profile{' '}
                        <CiEdit
                           className="inline cursor-pointer"
                           size={20}
                           onClick={() => {
                              setOpen(!open);
                           }}
                        />
                     </div>
                  )}
                  <div>{user?.username}</div>
                  <div>{user?.email}</div>
               </div>
               {GAMES.map((game, index) => {
                  return (
                     <React.Fragment key={index}>
                        <div className="text-center text-4xl">{game}</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 md:pl-20 justify-items-center md:justify-items-start sm:justify-center">
                           {posts[index].map((post) => {
                              return (
                                 <div
                                    key={post.landingPosition.public_id}
                                    className="max-w-md mx-auto"
                                 >
                                    <Posts postData={post} />
                                 </div>
                              );
                           })}
                        </div>
                     </React.Fragment>
                  );
               })}
            </div>
         )}

         <Footer />

         <ToastContainer position="top-center" />
      </>
   );
};

export default ProfilePage;
