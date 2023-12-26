import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Header, SideNavWrapper, Footer, Loading } from '../Components';
import { getUserByUsername } from '../util/getUser';
import { GAMES } from '../Constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AuthContext } from '../App';
import { UserType, PostType } from '../db.types';
import Posts from '../Components/Posts';

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
   const Auth = useContext(AuthContext);
   const verified = Auth?.Verified;

   const sendVerificationEmail = async () => {
      const id = toast.loading('Sending verification email...');

      try {
         const response = await axios.post('/send-verification-email', {
            email: user?.email,
            userId: user?._id,
         });

         if (response.status === 200) {
            toast.update(id, {
               render: 'Verification email sent!',
               type: 'success',
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         } else {
            toast.update(id, {
               render: 'Error sending verification email.',
               type: 'error',
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         }
      } catch (error) {
         if (axios.isAxiosError(error)) {
            toast.update(id, {
               render:
                  error.response?.data.message ||
                  'Error sending verification email.',
               type: 'error',
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         } else {
            toast.update(id, {
               render: 'Unexpected error occurred',
               type: 'error',
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         }
      }
   };

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

   if (loading) return <Loading />;

   return (
      <>
         <Header />
         <SideNavWrapper />
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
                              onClick={sendVerificationEmail}
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
            <div className="w-full h-[200px] flex flex-col justify-center items-center">
               <div>{user?.username}</div>
               <div>{user?.email}</div>
            </div>
            {GAMES.map((game, index) => {
               return (
                  <React.Fragment key={index}>
                     <div className="text-center text-4xl">{game}</div>
                     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pl-20">
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

         <Footer />

         <ToastContainer position="top-center" />
      </>
   );
};

export default ProfilePage;
