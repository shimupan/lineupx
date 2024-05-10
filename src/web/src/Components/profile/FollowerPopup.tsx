import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface FollowerPopupProps {
   followerIds: string[];
   onClose: () => void;
   user: any;
}

const FollowerPopup: React.FC<FollowerPopupProps> = ({
   followerIds,
   onClose,
   user,
}) => {
   const [followers, setFollowers] = useState<
      {
         id: string;
         username: string;
         isFollowing: boolean;
         ProfilePicture: string;
      }[]
   >([]);
   const [searchTerm, setSearchTerm] = useState<string>('');

   useEffect(() => {
      const fetchFollowers = async () => {
         try {
            const response = await axios.post('/users/multiple', {
               ids: followerIds,
            });
            const followersWithFollowingStatus = response.data.map(
               (follower: any) => {
                  const isFollowing = user.following.includes(follower._id);
                  return {
                     id: follower._id,
                     username: follower.username,
                     ProfilePicture: follower.ProfilePicture,
                     isFollowing,
                  };
               },
            );
            setFollowers(followersWithFollowingStatus);
         } catch (error) {
            console.error(error);
         }
      };

      fetchFollowers();
   }, [followerIds]);

   const filteredFollowers = followers.filter((follower) =>
      follower.username.toLowerCase().includes(searchTerm.toLowerCase()),
   );
   const follow = async (id: string) => {
      try {
         await axios.post(`/user/${id}/follow`, { userIdToFollow: user._id });
         setFollowers(
            followers.map((follower) =>
               follower.id === id
                  ? { ...follower, isFollowing: true }
                  : follower,
            ),
         );
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
         <div className="relative w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg text-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
               <h2 className="text-lg font-semibold">Followers</h2>
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
                  {filteredFollowers.map((follower, index) => (
                     <li
                        key={index}
                        className="flex items-center justify-between p-4 border-b hover:bg-gray-100"
                     >
                        <div className="flex items-center">
                           <Link
                              to={`/user/${follower.username}`}
                              onClick={onClose}
                           >
                              <img
                                 src={
                                    follower.ProfilePicture ||
                                    `https://ui-avatars.com/api/?background=random&color=fff&name=${follower.username}`
                                 }
                                 alt={follower.username}
                                 className="w-10 h-10 rounded-full mr-4"
                              />
                           </Link>
                           <Link
                              to={`/user/${follower.username}`}
                              className="text-sm font-medium text-gray-800"
                              onClick={onClose}
                           >
                              {follower.username}
                           </Link>
                        </div>
                        {!follower.isFollowing && (
                           <button
                              onClick={() => follow(follower.id)}
                              className="px-2 py-1 text-sm text-blue-500 font-semibold hover:bg-blue-100 rounded"
                           >
                              Follow
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

export default FollowerPopup;
