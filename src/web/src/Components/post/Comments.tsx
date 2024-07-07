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
   onDelete: (commentId: string) => void;
   className?: string;
};

const Comments: React.FC<CommentProps> = ({
   comment,
   postId,
   onDelete,
   className,
}) => {
   const [user, setUser] = useState<UserType>();
   const Auth = useContext(AuthContext);
   const [optionsBarPosition, setOptionsBarPosition] = useState({
      top: 0,
      left: 0,
   });
   const [showOptions, setShowOptions] = useState(false);
   const threeDotsRef = useRef<HTMLDivElement>(null);
   const [isEditing, setIsEditing] = useState(false);
   const [editedText, setEditedText] = useState(comment.text);
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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
         const CommentOptionBarHeight = 50;
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

   const handleDelete = () => {
      setShowDeleteConfirmation(true);
      closeCommentOptionBar();
   };
   const confirmDelete = async () => {
      try {
         await axios.delete(`/post/${postId}/comment/${comment._id}`, {
            data: { userId: comment._id, role: Auth?.role },
         });
         //await axios.delete(`/user/${Auth?._id}/comment/${comment._id}`);
         console.log('Comment deleted successfully');
         onDelete(comment._id);
         setShowDeleteConfirmation(false);
      } catch (error) {
         console.error('Error deleting comment:', error);
      }
   };

   const onEdit = () => {
      setIsEditing(true);
      setEditedText(comment.text);
      closeCommentOptionBar();
      setTimeout(() => {
         if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(
               editedText.length,
               editedText.length,
            );
         }
      }, 0);
   };

   const handleUpdate = async () => {
      try {
         await axios.put(`/post/${postId}/comment/${comment._id}`, {
            userId: comment._id,
            role: Auth?.role,
            text: editedText,
         });
         /*
         await axios.put(`/user/${Auth?._id}/comment/${comment._id}`, {
            text: editedText,
         });
         */
         comment.text = editedText;
         setIsEditing(false);
      } catch (error) {
         console.error('Error updating comment:', error);
      }
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
               <div
                  className={`transition-all duration-300 ease-in-out ${
                     isEditing ? 'max-h-40' : 'max-h-0'
                  } overflow-hidden`}
               >
                  <textarea
                     ref={textareaRef}
                     value={editedText}
                     onChange={(e) => setEditedText(e.target.value)}
                     className="w-full p-2 bg-gray-800 text-white rounded mt-2 resize-none"
                     rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                     <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white px-4 py-1 rounded mr-2 hover:bg-blue-600 transition-colors"
                     >
                        Update
                     </button>
                     <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition-colors"
                     >
                        Cancel
                     </button>
                  </div>
               </div>
               <div
                  className={`transition-all duration-300 ease-in-out ${
                     isEditing ? 'max-h-0' : 'max-h-40'
                  } overflow-hidden`}
               >
                  <p>{comment.text}</p>
               </div>
            </div>
         </div>

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
                     <CommentOptionBar
                        onClose={closeCommentOptionBar}
                        onDelete={() => handleDelete()}
                        onEdit={() => onEdit()}
                        style={{ width: '200px' }}
                     />
                  </div>
               </div>
            </>
         )}

         {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-gray-800 p-6 rounded-lg">
                  <h2 className="text-xl mb-4">Confirm Delete</h2>
                  <p className="mb-4">
                     Are you sure you want to delete this comment?
                  </p>
                  <div className="flex justify-end">
                     <button
                        onClick={() => setShowDeleteConfirmation(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition-colors"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={confirmDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                     >
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default Comments;
