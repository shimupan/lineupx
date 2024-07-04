import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, OptionBar, ReportPopup } from '../../Components';
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

   const onShare = () => {
      copyPostLinkToClipboard();
      setShowOptions(false);
   };

   const onReport = () => {
      setShowReportPopup(true);
      setShowOptions(false);
   };

   const copyPostLinkToClipboard = async () => {
      const postUrl = `${window.location.origin}/game/${post.game}/${encodeURIComponent(post._id)}`;
      try {
         await navigator.clipboard.writeText(postUrl);
         alert('Link copied to clipboard!');
      } catch (err) {
         console.error('Failed to copy: ', err);
      }
   };

   useEffect(() => {
      if (post.UserID) {
         getUserByID(post.UserID).then((user) => {
            setUser(user);
         });
      }
   }, [post.UserID]);

   return (
      <>
         <div className="relative w-full md:ml-[70px] lg:ml-0 rounded-xl flex pl-2 pb-2 post-width">
            <div className="absolute top-0 right-0 p-2">
               <BsThreeDotsVertical
                  className="cursor-pointer"
                  onClick={(event) => {
                     const rect = event.currentTarget.getBoundingClientRect();
                     const top = rect.top + window.scrollY;
                     const left = rect.left + window.scrollX;
                     const optionBarWidth = 200;
                     const optionBarHeight = 100;
                     const windowWidth = window.innerWidth;
                     const windowHeight = window.innerHeight;

                     let adjustedLeft = left;
                     let adjustedTop = top + rect.height;

                     if (left + optionBarWidth > windowWidth) {
                        adjustedLeft = windowWidth - optionBarWidth;
                     }

                     if (top + rect.height + optionBarHeight > windowHeight) {
                        adjustedTop = top - optionBarHeight;
                     }

                     setOptionsBarPosition({
                        top: adjustedTop,
                        left: adjustedLeft,
                     });
                     setShowOptions(true);
                  }}
                  size="24"
               />
            </div>
            <Link to={`/game/${post.game}/${post._id}`} className="flex-shrink-0">
               <div className="w-[180px] h-[101px] bg-gray-800 rounded-xl overflow-hidden">
                  <div className="w-full h-full relative">
                     <img
                        src={`${CDN_URL}/${post.landingPosition.public_id}`}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                        alt={post.postTitle}
                     />
                  </div>
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
            <OptionBar
               onClose={() => setShowOptions(false)}
               onShare={onShare}
               onReport={onReport}
               style={{
                  position: 'fixed',
                  top: optionsBarPosition.top,
                  left: optionsBarPosition.left,
               }}
            />
         )}
      </>
   );
};

export default WidePosts;