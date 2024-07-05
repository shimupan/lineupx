import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../../Components';
import { timeAgo } from './helper';
import { PostType, UserType } from '../../global.types';
import { getUserByID } from '../../util/getUser';
import { CDN_URL } from '../../Constants';
import { FaCheckCircle } from 'react-icons/fa';

type WidePostsProps = {
   post: PostType;
};

const WidePosts: React.FC<WidePostsProps> = ({ post }) => {
   const [user, setUser] = useState<UserType>();

   useEffect(() => {
      if (post.UserID) {
         getUserByID(post.UserID).then((user) => {
            setUser(user);
         });
      }
   }, [post.UserID]);

   return (
      <div className="w-full md:ml-[70px] lg:ml-0 rounded-xl flex pl-2 pb-2 post-width">
         <Link to={`/game/${post.game}/${post._id}`}>
            <img
               src={`${CDN_URL}/${post.landingPosition.public_id}`}
               className="h-24 w-34 rounded-xl"
            />
         </Link>
         <div className="flex flex-col pl-2">
            <Link
               className="text-lg font-bold m-0 no-underline"
               to={`/game/${post.game}/${post._id}`}
            >
               {post.postTitle.length > 23
                  ? `${post.postTitle.substring(0, 23)}...`
                  : post.postTitle}
            </Link>
            <div className="flex flex-row">
               <Tooltip text={post.Username}>
                  <Link
                     className="no-underline m-0 transition-colors duration-150 text-gray-300 hover:text-white"
                     to={`/user/${post.Username}`}
                  >
                     {post.Username}
                  </Link>
               </Tooltip>
               {user?.role == 'admin' && (
                  <Tooltip text={user?.role}>
                     <span className="flex justify-center items-center ml-1 mt-0.2">
                        <FaCheckCircle size={13} />
                     </span>
                  </Tooltip>
               )}
            </div>
            <div>
               <span className="text-gray-300">{post.views} views</span>
               <span className="ml-1 mr-1 text-gray-300">•</span>
               <span className="text-gray-300">
                  {timeAgo(new Date(post.date))}
               </span>
            </div>
         </div>
      </div>
   );
};

export default WidePosts;
