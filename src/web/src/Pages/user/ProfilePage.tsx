import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   Layout,
   Loading,
   Posts,
   ProfileEdit,
   FollowerPopup,
   FollowingPopup,
   UnapprovedPostsPopup,
   LeaderboardPosition,
   VerificationMessage,
} from '../../Components';
import { getUserByUsername } from '../../util/getUser';
import { follow } from '../../util/followStatus';
import { GAMES } from '../../Constants';
import { AuthContext } from '../../App';
import { UserType, PostType } from '../../global.types';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { RiUserFollowLine, RiUserUnfollowFill } from 'react-icons/ri';
import { FaRegSave, FaRegNewspaper, FaSave } from 'react-icons/fa';
import { MdOutlineVideogameAsset } from 'react-icons/md';
import { ValorantAgentProvider } from '../../contexts/ValorantAgentContext';
import { UserProvider } from '../../contexts/UserContext';
import useUserCache from '../../hooks/useUserCache';

const ProfilePage = () => {
   const { userCache, fetchUsers } = useUserCache();
   const { id } = useParams<{ id: string }>();
   const [user, setUser] = useState<UserType>({
      role: '',
      _id: '',
      username: '',
      email: '',
      password: '',
      Verified: false,
      ProfilePicture: '',
      verificationCode: '',
      likes: [''],
      dislikes: [''],
      saved: [''],
      comments: [
         {
            text: '',
            createdAt: new Date(),
            post: '',
         },
      ],
      followers: [''],
      following: [''],
      resetPasswordToken: '',
      resetPasswordExpires: new Date(),
   });
   const [loading, setLoading] = useState(true);
   const [showFollowerPopup, setShowFollowerPopup] = useState(false);
   const [showFollowingPopup, setShowFollowingPopup] = useState(false);
   const [followingCount, setFollowingCount] = useState(0);
   const [following, setFollowing] = useState<Set<string>>();
   const [followerCount, setFollowerCount] = useState(0);
   const [followers, setFollowers] = useState<Set<string>>();
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const [open, setOpen] = useState(false);
   const [selectedTab, setSelectedTab] = useState('Posts');
   const Auth = useContext(AuthContext);
   const verified = Auth?.Verified;
   const postCount = posts.reduce(
      (total, current) => total + current.length,
      0,
   );
   const [showUnapprovedPostsPopup, setUnapprovedPostsPopup] = useState(false);
   const [selectedGame, setSelectedGame] = useState('Valorant');
   const [unapprovedPosts, setUnapprovedPosts] = useState<PostType[]>([]);
   const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
   const navigate = useNavigate();
   const totalViews = posts
      .flat()
      .reduce((total, post) => total + post.views, 0);

   // Gets called twice during dev mode
   // So there should be 2 error messages
   // If you search for an non exisitant user
   useEffect(() => {
      // Fetch Users
      if (!Auth && !id) {
         return;
      }
      getUserByUsername(id!, Auth!.username, [
         'followers',
         'following',
         'saved',
      ])
         .then((response) => {
            setUser(response);
            setFollowers(new Set(response.followers));
            setFollowerCount(response.followers.length);
            setFollowing(new Set(response.following));
            setFollowingCount(response.following.length);
            // Fetch User Posts
            // For each game that we currently support
            const postsPromises = GAMES.map((game) =>
               axios.get(`/post/${game}/${response._id}`),
            );
            // Fetch Unapproved Posts
            const unapprovedPostsPromises = GAMES.map((game) =>
               axios.get(`/post/unapproved/${game}/${response._id}`),
            );
            // Fetch Saved Posts

            const postsByIdsPromises =
               response.saved && response.saved.length > 0
                  ? GAMES.map((game) =>
                       axios.get(
                          `/posts?postIds=${response.saved}&game=${game}`,
                       ),
                    )
                  : [];
            return Promise.all([
               ...postsPromises,
               ...unapprovedPostsPromises,
               ...postsByIdsPromises,
            ]);
         })
         .then((responses) => {
            const numGames = GAMES.length;
            const allPosts = responses
               .slice(0, numGames)
               .map((response) => response.data);
            const unapprovedPosts = responses
               .slice(numGames, 2 * numGames)
               .map((response) => response.data);
            const savedPosts = responses
               .slice(2 * numGames)
               .map((response) => response.data);

            setPosts(allPosts);
            setUnapprovedPosts(unapprovedPosts.flat());
            setSavedPosts(savedPosts.flat());
         })
         .catch((error) => {
            toast.error('Error Fetching Data');
            return error;
         })
         .finally(() => {
            setLoading(false);
         });
   }, [id, Auth]);

   const handleFollowers = async () => {
      follow(user._id, Auth?._id!).then((response) => {
         if (response === 200) {
            setFollowers((prevState) => {
               const newFollowerSet = new Set(prevState);
               const isFollowing = newFollowerSet.has(Auth?._id!);

               if (isFollowing) {
                  newFollowerSet.delete(Auth?._id!);
               } else {
                  newFollowerSet.add(Auth?._id!);
               }

               setFollowerCount((prevCount) =>
                  isFollowing ? prevCount - 1 : prevCount + 1,
               );

               return newFollowerSet;
            });
         } else {
            toast.error('Error following user');
         }
      });

      //FIX!
      //setShowFollowerPopup(true);
      //setShowFollowingPopup(true);
      
   };

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
            Auth?.setProfilePicture(response.data.profilePicture);
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
         <Layout>
            {open && Auth?.username == user.username ? (
               <div className="h-screen">
                  <ProfileEdit user={user} setOpen={setOpen} />
               </div>
            ) : (
               <div className="min-h-screen pb-40 bg-gray-900 text-white">
                  <div className="pt-20 pb-12 bg-gradient-to-b from-gray-800 to-gray-900">
                     <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center md:pl-64">
                           <img
                              src={
                                 user.ProfilePicture ||
                                 `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
                              }
                              className={`mt-4 rounded-full w-32 h-32 shadow-lg ${
                                 Auth?.username === user.username
                                    ? 'cursor-pointer hover:opacity-50'
                                    : ''
                              }`}
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
                              <div className="flex flex-row items-center justify-center">
                                 <h1 className="text-4xl font-bold">
                                    {user.username}
                                 </h1>
                                 <LeaderboardPosition userId={user._id} />
                                 {Auth?.username &&
                                    Auth?.username !== user.username && (
                                       <button
                                          className="ml-5 flex items-center justify-center px-5 py-1 bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300 ease-in-out"
                                          onClick={handleFollowers}
                                       >
                                          <div className="flex text-center items-center gap-x-1">
                                             {followers?.has(Auth?._id!) ? (
                                                <>
                                                   <RiUserUnfollowFill />
                                                   <p>Unfollow</p>
                                                </>
                                             ) : (
                                                <>
                                                   <RiUserFollowLine />
                                                   <p>Follow</p>
                                                </>
                                             )}
                                          </div>
                                       </button>
                                    )}
                              </div>
                              <p
                                 className="mt-2 cursor-pointer"
                                 onClick={() => {
                                    //Followers pop up for all
                                    setShowFollowerPopup(true);
                                 }}
                              >
                                 {followerCount} followers
                              </p>
                              <p
                                 className="mt-2 cursor-pointer"
                                 onClick={() => {
                                    //Following pop up for all
                                    setShowFollowingPopup(true);
                                 }}
                              >
                                 {followingCount} following
                              </p>
                              <p className="mt-2">{postCount} posts</p>
                              <p className="mt-2">{totalViews} views</p>
                              {Auth?.username === user.username && (
                                 <>
                                    <div className="flex items-center justify-center space-x-4">
                                       {/* <button
                                             className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300 ease-in-out" // Adjusted padding to match
                                             onClick={() => setOpen(!open)}
                                          >
                                             <CiEdit className="text-white mr-2" />
                                             Edit Profile
                                          </button> */}
                                       <button
                                          className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300 ease-in-out" // Made padding consistent with the first button
                                          onClick={() =>
                                             navigate(
                                                `/manage-posts/${Auth?.username}`,
                                             )
                                          }
                                       >
                                          <div className="flex text-center items-center gap-x-1">
                                             Manage Posts
                                          </div>
                                       </button>
                                    </div>
                                 </>
                              )}
                           </div>
                        </div>
                        {!verified && Auth?.username === user.username && (
                           <VerificationMessage user={user} />
                        )}
                     </div>
                  </div>
                  <div className="flex space-x-4 justify-center">
                     {Auth?.username === user.username &&
                        unapprovedPosts.length > 0 && (
                           <button
                              onClick={() => setUnapprovedPostsPopup(true)}
                           >
                              {unapprovedPosts.length} Unapproved Posts. Please
                              wait for an admin to approve them (Click to view)
                           </button>
                        )}
                  </div>
                  <div>
                     <div>
                        {Auth?._id === user._id && (
                           <div className="flex justify-center">
                              <div className="inline-flex rounded-lg p-1 relative">
                                 <button
                                    onClick={() => setSelectedTab('Posts')}
                                    className={`px-4 py-2 rounded-lg focus:outline-none flex items-center text-xs ${
                                       selectedTab === 'Posts'
                                          ? 'text-white '
                                          : 'text-gray-600'
                                    }`}
                                 >
                                    <FaRegNewspaper />
                                    <span className="pl-2">POSTS</span>
                                 </button>
                                 <button
                                    onClick={() => setSelectedTab('Saved')}
                                    className={`px-4 py-2 rounded-lg focus:outline-none flex items-center text-xs ${
                                       selectedTab === 'Saved'
                                          ? 'text-white'
                                          : 'text-gray-600'
                                    }`}
                                 >
                                    <FaRegSave />
                                    <span className="pl-2">SAVED</span>
                                 </button>
                                 <div
                                    className={`absolute top-0 left-0 h-1 bg-white rounded-full transition-all duration-300 ${
                                       selectedTab === 'Posts'
                                          ? 'w-1/2'
                                          : 'w-1/2 translate-x-full'
                                    }`}
                                 ></div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                  {selectedTab === 'Posts' && (
                     <>
                        <div className="flex space-x-4 justify-center">
                           {['Valorant', 'CS2'].map((game) => (
                              <button
                                 key={game}
                                 onClick={() => setSelectedGame(game)}
                                 className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                              >
                                 {game}
                              </button>
                           ))}
                        </div>
                        {GAMES.map((game, index) => {
                           if (game === selectedGame) {
                              if (selectedGame === 'Valorant') {
                                 return (
                                    <UserProvider>
                                       <ValorantAgentProvider>
                                          <React.Fragment key={index}>
                                             <div className="text-center text-4xl font-bold text-indigo-600 py-4">
                                                {game}
                                             </div>
                                             {posts[index].length > 0 ? (
                                                <div className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
                                                   {posts[index].map((post) => (
                                                      <div
                                                         key={
                                                            post.landingPosition
                                                               .public_id
                                                         }
                                                      >
                                                         <Posts
                                                            postData={post}
                                                            userCache={
                                                               userCache
                                                            }
                                                            fetchUsers={
                                                               fetchUsers
                                                            }
                                                         />
                                                      </div>
                                                   ))}
                                                </div>
                                             ) : (
                                                <div className="flex flex-col items-center justify-center h-screen">
                                                   <div className="text-center">
                                                      <MdOutlineVideogameAsset className="text-6xl mx-auto mb-4" />
                                                      <h2 className="text-2xl font-semibold mb-4">
                                                         No Valorant Posts
                                                         Available
                                                      </h2>
                                                      <p className="text-gray-500">
                                                         You currently have zero
                                                         approved lineups for
                                                         Valorant.
                                                      </p>
                                                      <p className="text-gray-500">
                                                         Please check back later
                                                         or select a different
                                                         game.
                                                      </p>
                                                   </div>
                                                </div>
                                             )}
                                          </React.Fragment>
                                       </ValorantAgentProvider>
                                    </UserProvider>
                                 );
                              } else {
                                 return (
                                    <UserProvider>
                                       <React.Fragment key={index}>
                                          <div className="text-center text-4xl font-bold text-indigo-600 py-4">
                                             {game}
                                          </div>
                                          {posts[index].length > 0 ? (
                                             <div className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
                                                {posts[index].map((post) => (
                                                   <div
                                                      key={
                                                         post.landingPosition
                                                            .public_id
                                                      }
                                                   >
                                                      <Posts
                                                         postData={post}
                                                         userCache={userCache}
                                                         fetchUsers={fetchUsers}
                                                      />
                                                   </div>
                                                ))}
                                             </div>
                                          ) : (
                                             <div className="flex flex-col items-center justify-center h-screen">
                                                <div className="text-center">
                                                   <MdOutlineVideogameAsset className="text-6xl mx-auto mb-4" />
                                                   <h2 className="text-2xl font-semibold mb-4">
                                                      No Posts Available
                                                   </h2>
                                                   <p className="text-gray-500">
                                                      You currently have zero
                                                      approved lineups for{' '}
                                                      {game}.
                                                   </p>
                                                   <p className="text-gray-500">
                                                      Please check back later or
                                                      select a different game.
                                                   </p>
                                                </div>
                                             </div>
                                          )}
                                       </React.Fragment>
                                    </UserProvider>
                                 );
                              }
                           }
                           return null;
                        })}
                     </>
                  )}
                  {selectedTab === 'Saved' && (
                     <>
                        {savedPosts.length > 0 ? (
                           <div className="pl-4 pr-4 md:pl-0 md:pr-2 md:ml-20 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 lg:grid-cols-5">
                              {savedPosts.map((post) => {
                                 if (post.game === 'Valorant') {
                                    return (
                                       <UserProvider>
                                          <ValorantAgentProvider>
                                             <div
                                                key={
                                                   post.landingPosition
                                                      .public_id
                                                }
                                             >
                                                <Posts
                                                   postData={post}
                                                   userCache={userCache}
                                                   fetchUsers={fetchUsers}
                                                />
                                             </div>
                                          </ValorantAgentProvider>
                                       </UserProvider>
                                    );
                                 } else {
                                    return (
                                       <UserProvider>
                                          <div
                                             key={
                                                post.landingPosition.public_id
                                             }
                                          >
                                             <Posts
                                                postData={post}
                                                userCache={userCache}
                                                fetchUsers={fetchUsers}
                                             />
                                          </div>
                                       </UserProvider>
                                    );
                                 }
                              })}
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center h-screen">
                              <div className="text-center">
                                 <FaSave className="text-6xl mx-auto mb-4" />
                                 <h2 className="text-2xl font-semibold mb-4">
                                    Save
                                 </h2>
                                 <p className="text-gray-500">
                                    Save lineups that you want to view again.
                                 </p>
                                 <p className="text-gray-500">
                                    No one is notified, and only you can see
                                    what you've saved.
                                 </p>
                              </div>
                           </div>
                        )}
                     </>
                  )}
               </div>
            )}
         </Layout>

         <ToastContainer position="top-center" />

         {showFollowerPopup && (
            <FollowerPopup
               followerIds={Array.from(followers || [])}
               onClose={() => setShowFollowerPopup(false)}
               user={user}
               setFollowingCount={setFollowingCount}
            />
         )}
         {showFollowingPopup && (
            <FollowingPopup
               following={Array.from(following || [])}
               onClose={() => setShowFollowingPopup(false)}
               curruser={user}
               setFollowingCount={setFollowingCount}
            />
         )}

         {showUnapprovedPostsPopup && (
            <UnapprovedPostsPopup
               show={showUnapprovedPostsPopup}
               posts={unapprovedPosts}
               onClose={() => setUnapprovedPostsPopup(false)}
            />
         )}
      </>
   );
};

export default ProfilePage;
