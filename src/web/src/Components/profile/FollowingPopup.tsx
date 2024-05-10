import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface FollowingPopupProps {
   following: string[];
   onClose: () => void;
   curruser: any;
}

const FollowingPopup: React.FC<FollowingPopupProps> = ({
   following,
   onClose,
   curruser,
}) => {
   const [followingUsers, setFollowingUsers] = useState<
      { username: string; ProfilePicture: string }[]
   >([]);
   const [searchTerm, setSearchTerm] = useState<string>('');

   useEffect(() => {
      const fetchFollowingUsers = async () => {
         try {
            const response = await axios.post('/users/multiple', {
               ids: following,
            });
            const users = response.data.map((user: any) => ({
               username: user.username,
               ProfilePicture: user.ProfilePicture,
            }));
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

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
         <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg text-gray-800">
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
                        className="flex items-center p-4 border-b hover:bg-gray-100"
                     >
                        <div className="flex items-center">
                           <img
                              src={
                                 user.ProfilePicture ||
                                 `https://ui-avatars.com/api/?background=random&color=fff&name=${user.username}`
                              }
                              alt={user.username}
                              className="w-10 h-10 rounded-full mr-4"
                           />
                           <Link
                              to={`/user/${user.username}`}
                              className="text-sm font-medium"
                              onClick={onClose}
                           >
                              {user.username}
                           </Link>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </div>
   );
};

export default FollowingPopup;
