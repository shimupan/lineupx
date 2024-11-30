import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, PostOptionBar, ReportPopup } from '../../Components';
import { timeAgo } from './helper';
import { PostType, UserType } from '../../global.types';
import { CDN_URL } from '../../Constants';
import { FaCheckCircle } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AuthContext } from '../../App';
import { abbreviateNumber } from '../../util/updatePost';

type WidePostsProps = {
   post: PostType;
   userCache: Record<string, UserType>;
   fetchUsers: (userIds: string[]) => Promise<void>;
};

const WidePosts: React.FC<WidePostsProps> = ({
   post,
   userCache,
   fetchUsers,
}) => {
   const Auth = useContext(AuthContext);
   const user_Id = Auth?._id;
   const [optionsBarPosition, setOptionsBarPosition] = useState({
      top: 0,
      left: 0,
   });
   const [showOptions, setShowOptions] = useState(false);
   const [showReportPopup, setShowReportPopup] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (post.UserID && !userCache[post.UserID]) {
         fetchUsers([post.UserID]);
      }
   }, [post.UserID, userCache, fetchUsers]);

   const user = userCache[post.UserID];

   const onShare = () => {
      copyPostLinkToClipboard();
      closePostOptionBar();
   };

   const onReport = () => {
      setShowReportPopup(true);
      closePostOptionBar();
   };

   const handlePostClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      window.location.href = `/game/${post.game}/${post._id}`;
   };

   const copyPostLinkToClipboard = async () => {
      const postUrl = `${window.location.origin}/game/${
         post.game
      }/${encodeURIComponent(post._id)}`;
      try {
         await navigator.clipboard.writeText(postUrl);
         alert('Link copied to clipboard!');
      } catch (err) {
         console.error('Failed to copy: ', err);
      }
   };

   const closePostOptionBar = () => {
      setShowOptions(false);
   };

   return (
      <div
         ref={containerRef}
         className="relative w-full md:ml-[70px] lg:ml-0 rounded-xl flex pl-2 pb-2 post-width"
      >
         <div className="absolute top-0 right-0 p-2">
            <BsThreeDotsVertical
               className="cursor-pointer"
               onClick={(event: React.MouseEvent<SVGElement>) => {
                  if (containerRef.current) {
                     const rect = containerRef.current.getBoundingClientRect();
                     const buttonRect =
                        event.currentTarget.getBoundingClientRect();
                     const top = buttonRect.bottom - rect.top + 10;
                     const left = buttonRect.left - rect.left - 125;

                     setOptionsBarPosition({ top, left });
                     setShowOptions(true);
                  }
               }}
               size="24"
            />
         </div>
         <Link
            to={`/game/${post.game}/${post._id}`}
            className="flex-shrink-0"
            onClick={handlePostClick}
         >
            <div
               className="w-[180px] h-[101px] bg-black rounded-xl overflow-hidden"
               style={{
                  position: 'relative',
               }}
            >
               <img
                  src={`${CDN_URL}/${post.landingPosition.public_id}`}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain"
                  alt={post.postTitle}
               />
            </div>
         </Link>
         <div className="flex flex-col pl-2 flex-grow">
            <Link
               className="text-md font-bold m-0 no-underline"
               to={`/game/${post.game}/${post._id}`}
               onClick={handlePostClick}
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
               {user?.role === 'admin' && (
                  <Tooltip text={user.role}>
                     <span className="flex justify-center items-center ml-1 mt-0.2">
                        <FaCheckCircle size={13} />
                     </span>
                  </Tooltip>
               )}
            </div>
            <div>
               <span className="text-gray-300">
                  {abbreviateNumber(post.views)} views
               </span>
               <span className="ml-1 mr-1 text-gray-300">•</span>
               <span className="text-gray-300">
                  {timeAgo(new Date(post.date))}
               </span>
            </div>
         </div>

         {showReportPopup && user_Id && (
            <ReportPopup
               postId={post._id}
               userId={user_Id}
               onClose={() => setShowReportPopup(false)}
            />
         )}

         {showOptions && (
            <PostOptionBar
               onClose={closePostOptionBar}
               onShare={onShare}
               onReport={onReport}
               style={{
                  position: 'absolute',
                  top: optionsBarPosition.top,
                  left: optionsBarPosition.left,
                  width: '150px',
                  zIndex: 40,
               }}
            />
         )}
      </div>
   );
};

export default WidePosts;
