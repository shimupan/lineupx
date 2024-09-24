import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../App';
import { SideNavContext } from './SideNav';

const FollowingSideNav: React.FC = () => {
   const [followingUsers, setFollowingUsers] = useState<
      {
         id: string;
         username: string;
         ProfilePicture: string;
         isFollowing: boolean;
      }[]
   >([]);
   const [showAll, setShowAll] = useState(false);
   const Auth = useContext(AuthContext);
   const expanded = useContext(SideNavContext);

   useEffect(() => {
      const fetchFollowingUsers = async () => {
         try {
            const response = await axios.post('/users/multiple', {
               ids: Auth?.following,
            });
            const users = response.data.map((user: any) => ({
               id: user._id,
               username: user.username,
               ProfilePicture: user.ProfilePicture,
               isFollowing: true,
            }));

            if (users.length > 1) {
               const secondUser = users[1];
               for (let i = 0; i < 20; i++) {
                  users.push({ ...secondUser, id: `${secondUser.id}-${i}` });
               }
            }
            setFollowingUsers(users);
         } catch (error) {
            console.error(error);
         }
      };
      fetchFollowingUsers();
   }, [Auth?.following]);

   useEffect(() => {
      if (!expanded) {
         setShowAll(false);
      }
   }, [expanded]);

   const displayedUsers = showAll ? followingUsers : followingUsers.slice(0, 7);

   return (
      <div className="mt-4">
         {expanded && (
            <h3 className="text-white text-sm font-semibold mb-2 px-3">
               Following
            </h3>
         )}
         <ul>
            {displayedUsers.map((follower) => (
               <li key={follower.id} className="px-3 py-2 hover:bg-[#190527]">
                  <Link
                     to={`/user/${follower.username}`}
                     className="flex items-center"
                  >
                     <img
                        src={
                           follower.ProfilePicture ||
                           `https://ui-avatars.com/api/?background=random&color=fff&name=${follower.username}`
                        }
                        alt={follower.username}
                        className="w-6 h-6 rounded-full mr-2"
                     />
                     {expanded && (
                        <span className="text-white text-sm">
                           {follower.username}
                        </span>
                     )}
                  </Link>
               </li>
            ))}
         </ul>
         {followingUsers.length > 7 && expanded && (
            <button
               className="text-white text-sm px-3 py-2 hover:bg-[#190527] w-full text-left"
               onClick={() => setShowAll(!showAll)}
            >
               {showAll ? 'Show less' : 'Show more'}
            </button>
         )}
      </div>
   );
};

export default FollowingSideNav;
