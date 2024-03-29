import React, { useEffect, useState, useContext, useRef } from 'react';
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
      ProfilePicture: '',
   });
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const [open, setOpen] = useState(false);
   const Auth = useContext(AuthContext);
   const verified = Auth?.Verified;
   const postCount = posts.reduce(
      (total, current) => total + current.length,
      0,
   );
   const [selectedGame, setSelectedGame] = useState('Valorant');
   const totalViews = posts.flat().reduce((total, post) => total + post.views, 0);
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
   const fileInputRef = useRef<HTMLInputElement>(null);

   const triggerFileInput = () => {
      // Trigger the file input when the avatar is clicked
      if (Auth?.username === user.username && fileInputRef.current) {
         fileInputRef.current.click();
      }
   };

   const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>,
   ) => {
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];

         // Check if the file is an image
         if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
         }

         const formData = new FormData();
         formData.append('image', file);

         try {
            const response = await axios.post(
               `/user/${user._id}/pfp`,
               formData,
               {
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               },
            );

            // Update the user state with the new profile picture URL
            setUser((prevState) => ({
               ...prevState,
               ProfilePicture: response.data.profilePicture,
            }));

            toast.success('Profile picture updated successfully');
         } catch (error) {
            console.error('Error uploading profile picture:', error);
            toast.error('Error uploading profile picture');
         }
      }
   };

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
            <div className="min-h-screen pb-40 bg-gray-900 text-white">
               <div className="pt-20 pb-12 bg-gradient-to-b from-gray-800 to-gray-900">
                  <div className="container mx-auto px-4">
                     {!verified && Auth?.username === user.username && (
                        <div className="max-w-2xl mx-auto bg-red-600 text-white shadow-lg rounded-lg p-4">
                           <p className="font-bold">Verification Needed</p>
                           <p>
                              Your account is not verified. Please check your
                              email to verify your account.
                           </p>
                           <button
                              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              onClick={handleVerification}
                           >
                              Send Verification Email
                           </button>
                        </div>
                     )}

                     <div className="flex flex-col items-center md:pl-64">
                        <img
                            src={
                                user.ProfilePicture ||
                                `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
                            }
                            className={`mt-4 rounded-full w-32 h-32 shadow-lg ${Auth?.username === user.username ? 'cursor-pointer hover:opacity-50' : ''}`}
                            alt="Profile"
                            onClick={triggerFileInput}
                        />
                        <input
                           type="file"
                           ref={fileInputRef}
                           onChange={handleFileChange}
                           className="hidden"
                        />
                        <div className="mt-4">
                           <h1 className="text-4xl font-bold">
                              {user.username}
                           </h1>
                           <p className="mt-2">{postCount} posts</p>
                           <p className="mt-2">{totalViews} views</p>
                           {Auth?.username === user.username && (
                              <button
                                 className="mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300 ease-in-out"
                                 onClick={() => setOpen(!open)}
                              >
                                 <CiEdit className="text-white mr-2" />
                                 Edit Profile
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex space-x-4 justify-center">
                  {['Valorant', 'CS2'].map((game) => (
                     <button
                        key={game}
                        onClick={() => setSelectedGame(game)}
                        className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                     >
                        {game}
                     </button>
                  ))}
               </div>
               {GAMES.map((game, index) => {
                  if (game === selectedGame) {
                     return (
                        <React.Fragment key={index}>
                           <div className="text-center text-4xl font-bold text-indigo-600 py-4">{game}</div>
                           <div className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
                              {posts[index].map((post) => {
                                 return (
                                    <div key={post.landingPosition.public_id}>
                                       <Posts postData={post} />
                                    </div>
                                 );
                              })}
                           </div>
                        </React.Fragment>
                     );
                  }
               })}
            </div>
         )}

         <Footer />

         <ToastContainer position="top-center" />
      </>
   );
};

export default ProfilePage;
