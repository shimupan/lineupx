import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';

interface FollowingPopupProps {
   following: string[];
   onClose: () => void;
   curruser: any;
   setFollowingCount: React.Dispatch<React.SetStateAction<number>>;
}

const FollowingPopup: React.FC<FollowingPopupProps> = ({
   following,
   onClose,
   curruser,
   setFollowingCount,
}) => {
   const Auth = useContext(AuthContext);
   const [followingUsers, setFollowingUsers] = useState<
      {
         id: string;
         username: string;
         ProfilePicture: string;
         isFollowing: boolean;
      }[]
   >([]);
   const [searchTerm, setSearchTerm] = useState<string>('');

   useEffect(() => {
      const fetchFollowingUsers = async () => {
         try {
            const response = await axios.post('/users/multiple', {
               ids: following,
            });

            //Array used to assign unfollow buttons to the homepage user's followers based on the actual person accessing the page.
            let loggedInUserFollowingSet = Auth!.following;
            if (Auth!.username == '') {
               loggedInUserFollowingSet = [];
            }
            // console.log("My username: " + Auth!.username);
            // console.log("My following: " + loggedInUserFollowingSet);

            const users = response.data.map((user: any) => ({
               id: user._id,
               username: user.username,
               ProfilePicture: user.ProfilePicture,
               isFollowing: loggedInUserFollowingSet.some(
                  (following) => following === user._id,
               ),
            }));
            // console.log("Their Following: ");
            // users.forEach((user: any) => {
            //    console.log(user.id + " ");
            // });

            setFollowingUsers(users);
         } catch (error) {
            console.error(error);
         }
      };
      fetchFollowingUsers();
   }, [following]);

   const filteredUsers = followingUsers.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
   );
   const unfollow = async (id: string) => {
      try {
         await axios.post(`/user/${id}/follow`, {
            userIdToFollow: Auth!._id,
         });
         //Only remove follower entry from tab if on your own profile, otherwise remove the button boolean but not the person!
         if (Auth!._id === curruser._id) {
            setFollowingUsers(
               followingUsers.filter((follower) => follower.id !== id),
            );

            //setFollowingCount(prevCount => prevCount - 1);
         } else {
            toggleFollow(id);
         }
         window.location.reload();
      } catch (error) {
         console.error(error);
      }
   };

   //Flip the following bool from one state to another given the id for the follower.
   const toggleFollow = (userId: string) => {
      setFollowingUsers((prevUsers) =>
         prevUsers.map(
            (user) =>
               user.id === userId
                  ? { ...user, isFollowing: !user.isFollowing } // Toggle isFollowing
                  : user, // Keep other users unchanged
         ),
      );
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
         <div className="relative w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg text-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
               <h2 className="text-lg font-semibold">Following</h2>
               <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={onClose}
               >
                  <svg
                     className="w-5 h-5 text-gray-600"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>
            </div>
            <div className="p-4">
               <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
               />
            </div>
            <div className="max-h-96 overflow-y-auto">
               <ul>
                  {filteredUsers.map((user, index) => (
                     <li
                        key={index}
                        className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
                     >
                        <div className="flex items-center">
                           <Link
                              to={`/user/${user.username}`}
                              onClick={onClose}
                           >
                              <img
                                 src={
                                    user.ProfilePicture ||
                                    `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
                                 }
                                 alt={user.username}
                                 className="w-10 h-10 rounded-full mr-4"
                              />
                           </Link>
                           <Link
                              to={`/user/${user.username}`}
                              className="text-sm font-medium"
                              onClick={onClose}
                           >
                              {user.username}
                           </Link>
                        </div>
                        {user.isFollowing && (
                           <button
                              onClick={() => unfollow(user.id)}
                              className="px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-100 rounded-md"
                           >
                              Unfollow
                           </button>
                        )}
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
   );
};

export default FollowingPopup;
