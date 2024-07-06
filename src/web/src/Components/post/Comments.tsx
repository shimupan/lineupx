import { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../../Pages/PostPage';
import { getUserByUsername } from '../../util/getUser';
import { UserType } from '../../global.types';
import { timeAgo } from './helper';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CommentOptionBar } from '../../Components';
import { AuthContext } from '../../App';
import axios from 'axios';

type CommentProps = {
   comment: Comment;
   postId: string;
   className?: string;
};

const Comments: React.FC<CommentProps> = ({ comment, postId, className }) => {
   const [user, setUser] = useState<UserType>();
   const Auth = useContext(AuthContext);
   const [optionsBarPosition, setOptionsBarPosition] = useState({
      top: 0,
      left: 0,
   });
   const [showOptions, setShowOptions] = useState(false);
   const threeDotsRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (comment.username) {
         getUserByUsername(comment.username).then((user) => {
            setUser(user);
         });
      }
   }, [comment.username]);

   const handleOptionsClick = (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      if (threeDotsRef.current) {
         const rect = threeDotsRef.current.getBoundingClientRect();
         const CommentOptionBarWidth = 200;
         const CommentOptionBarHeight = 50; // Adjusted for single option
         const windowWidth = window.innerWidth;
         const windowHeight = window.innerHeight;

         let adjustedLeft =
            rect.left - CommentOptionBarWidth / 2 + rect.width / 2;
         let adjustedTop = rect.bottom;

         if (adjustedLeft + CommentOptionBarWidth > windowWidth) {
            adjustedLeft = windowWidth - CommentOptionBarWidth;
         }

         if (adjustedLeft < 0) {
            adjustedLeft = 0;
         }

         if (rect.bottom + CommentOptionBarHeight > windowHeight) {
            adjustedTop = rect.top - CommentOptionBarHeight;
         }

         setOptionsBarPosition({
            top: adjustedTop,
            left: adjustedLeft,
         });
         setShowOptions(true);
      }
   };

   const closeCommentOptionBar = () => {
      setShowOptions(false);
      document.body.style.overflow = '';
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            showOptions &&
            !threeDotsRef.current?.contains(event.target as Node)
         ) {
            closeCommentOptionBar();
         }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   }, [showOptions]);

   const onDelete = async () => {
      axios
         .delete(`/post/${postId}/comment/${comment._id}`, {
            data: { userId: comment._id, role: Auth?.role },
         })
         .then((response) => {
            console.log('Comment deleted successfully:', response.data);
         })
         .catch((error) => {
            console.error('Error deleting comment:', error);
         });
      axios
         .delete(`/user/${Auth?._id}/comment/${comment._id}`, {})
         .then((response) => {
            console.log('Comment deleted successfully:', response.data);
         })
         .catch((error) => {
            console.error('Error deleting comment:', error);
         });
   };

   return (
      <>
         <div className={`flex ${className} relative`}>
            <div>
               <Link to={`/user/${user?.username}`}>
                  <img
                     src={`${user?.ProfilePicture}`}
                     alt="profile"
                     className="rounded-full w-10 h-10"
                  />
               </Link>
            </div>
            <div className="ml-2 flex flex-col flex-grow">
               <div className="flex flex-row justify-between">
                  <div>
                     <Link to={`/user/${user?.username}`}>
                        <p className="text-sm">{comment.username}</p>
                     </Link>
                     <p className="text-gray-400 text-sm hover:text-white cursor-pointer">
                        {timeAgo(new Date(comment.createdAt))}
                     </p>
                  </div>
                  {Auth?._id === comment.user && (
                     <div ref={threeDotsRef}>
                        <BsThreeDotsVertical
                           className="cursor-pointer"
                           onClick={handleOptionsClick}
                           size="24"
                        />
                     </div>
                  )}
               </div>
               <p>{comment.text}</p>
            </div>
         </div>

         {showOptions && (
            <>
               <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                  onClick={closeCommentOptionBar}
               ></div>
               <div className="fixed inset-0 z-50 pointer-events-none">
                  <div
                     className="pointer-events-auto"
                     style={{
                        position: 'absolute',
                        top: optionsBarPosition.top,
                        left: optionsBarPosition.left,
                     }}
                  >
                     <CommentOptionBar
                        onClose={closeCommentOptionBar}
                        onDelete={() => onDelete()}
                        style={{ width: '200px' }}
                     />
                  </div>
               </div>
            </>
         )}
      </>
   );
};

export default Comments;
