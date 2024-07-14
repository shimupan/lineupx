import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, PostOptionBar, ReportPopup } from '../../Components';
import { timeAgo } from './helper';
import { PostType, UserType } from '../../global.types';
import { getUserByID } from '../../util/getUser';
import { CDN_URL } from '../../Constants';
import { FaCheckCircle } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AuthContext } from '../../App';

type WidePostsProps = {
   post: PostType;
};

const WidePosts: React.FC<WidePostsProps> = ({ post }) => {
   const Auth = useContext(AuthContext);
   const user_Id = Auth?._id;
   const [user, setUser] = useState<UserType>();
   const [optionsBarPosition, setOptionsBarPosition] = useState({
      top: 0,
      left: 0,
   });
   const [showOptions, setShowOptions] = useState(false);
   const [showReportPopup, setShowReportPopup] = useState(false);
   const threeDotsRef = useRef<HTMLDivElement>(null);

   const onShare = () => {
      copyPostLinkToClipboard();
      closePostOptionBar();
   };

   const onReport = () => {
      setShowReportPopup(true);
      closePostOptionBar();
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

   const handleOptionsClick = (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      if (threeDotsRef.current) {
         const rect = threeDotsRef.current.getBoundingClientRect();
         const PostOptionBarWidth = 200;
         const PostOptionBarHeight = 100; // ADJUST IF NEEDED
         const windowWidth = window.innerWidth;
         const windowHeight = window.innerHeight;

         let adjustedLeft = rect.left - PostOptionBarWidth / 2 + rect.width / 2;
         let adjustedTop = rect.bottom;

         if (adjustedLeft + PostOptionBarWidth > windowWidth) {
            adjustedLeft = windowWidth - PostOptionBarWidth;
         }

         if (adjustedLeft < 0) {
            adjustedLeft = 0;
         }

         if (rect.bottom + PostOptionBarHeight > windowHeight) {
            adjustedTop = rect.top - PostOptionBarHeight;
         }

         setOptionsBarPosition({
            top: adjustedTop,
            left: adjustedLeft + 80,
         });
         setShowOptions(true);
         document.body.style.overflow = 'hidden';
      }
   };

   const closePostOptionBar = () => {
      setShowOptions(false);
      document.body.style.overflow = '';
   };

   useEffect(() => {
      if (post.UserID) {
         getUserByID(post.UserID).then((user) => {
            setUser(user);
         });
      }
   }, [post.UserID]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            showOptions &&
            !threeDotsRef.current?.contains(event.target as Node)
         ) {
            closePostOptionBar();
         }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   }, [showOptions]);

   return (
      <>
         <div className="relative w-full md:ml-[70px] lg:ml-0 rounded-xl flex pl-2 pb-2 post-width">
            <div className="absolute top-0 right-0 p-2" ref={threeDotsRef}>
               <BsThreeDotsVertical
                  className="cursor-pointer"
                  onClick={handleOptionsClick}
                  size="24"
               />
            </div>
            <Link
               to={`/game/${post.game}/${post._id}`}
               className="flex-shrink-0"
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

         {showReportPopup && user_Id && (
            <ReportPopup
               postId={post._id}
               userId={user_Id}
               onClose={() => setShowReportPopup(false)}
            />
         )}
         {showOptions && (
            <>
               <div className="fixed inset-0 z-50 pointer-events-none">
                  <div
                     className="pointer-events-auto"
                     style={{
                        position: 'absolute',
                        top: optionsBarPosition.top,
                        left: optionsBarPosition.left,
                     }}
                  >
                     <PostOptionBar
                        onClose={closePostOptionBar}
                        onShare={onShare}
                        onReport={onReport}
                     />
                  </div>
               </div>
            </>
         )}
      </>
   );
};

export default WidePosts;
