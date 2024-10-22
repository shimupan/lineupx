import { useState, useRef, useEffect, useContext } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { timeAgo } from './helper';
import { CommentOptionBar } from '../../Components';
import { AuthContext } from '../../App';
import axios from 'axios';

interface Comment {
   _id: string;
   text: string;
   username: string;
   createdAt: Date;
   ProfilePicture?: string;
   user: string;
}

interface MobileCommentsProps {
   comments: Comment[];
   onDelete: (commentId: string) => void;
   className?: string;
   postId: string;
}

const MobileComments: React.FC<MobileCommentsProps> = ({
   comments = [],
   onDelete,
   postId,
   className = '',
}) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const [commentCount] = useState(comments.length);
   const latestComment = comments[0];
   const Auth = useContext(AuthContext);
   const threeDotsRef = useRef<HTMLDivElement>(null);

   // State for options and editing
   const [showOptions, setShowOptions] = useState(false);
   const [optionsBarPosition, setOptionsBarPosition] = useState({
      top: 0,
      left: 0,
   });
   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
   const [activeComment, setActiveComment] = useState<Comment | null>(null);
   const [isEditing, setIsEditing] = useState(false);
   const [editedText, setEditedText] = useState('');
   const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      if (!activeComment) return;

      try {
         await axios.delete(`/post/${postId}/comment/${activeComment._id}`, {
            data: { userId: activeComment._id, role: Auth?.role },
         });
         onDelete(activeComment._id);
         setShowDeleteConfirmation(false);
      } catch (error) {
         console.error('Error deleting comment:', error);
      }
   };

   const onEdit = () => {
      if (!activeComment) return;

      setIsEditing(true);
      setEditedText(activeComment.text);
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
      if (!activeComment) return;

      try {
         await axios.put(`/post/${postId}/comment/${activeComment._id}`, {
            userId: activeComment._id,
            role: Auth?.role,
            text: editedText,
         });
         activeComment.text = editedText;
         setIsEditing(false);
         setActiveComment(null);
      } catch (error) {
         console.error('Error updating comment:', error);
      }
   };

   const handleOptionsClick = (
      event: React.MouseEvent<SVGElement>,
      comment: Comment,
   ) => {
      event.stopPropagation();
      setActiveComment(comment);

      const rect = event.currentTarget.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const left = rect.left + window.scrollX;
      const PostOptionBarWidth = 200;
      const PostOptionBarHeight = 100;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let adjustedLeft = left;
      let adjustedTop = top + rect.height;

      if (left + PostOptionBarWidth > windowWidth) {
         adjustedLeft = windowWidth - PostOptionBarWidth;
      } else {
         adjustedLeft += 25;
      }

      if (top + rect.height + PostOptionBarHeight > windowHeight) {
         adjustedTop = top - PostOptionBarHeight;
      }

      setOptionsBarPosition({
         top: adjustedTop + 40,
         left: adjustedLeft - 95,
      });
      setShowOptions(true);
   };

   return (
      <div className={`w-full ${className}`}>
         <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left p-4 bg-gray-800/50 rounded-lg mb-2"
         >
            <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-gray-200">
                  Comments {commentCount.toLocaleString()}
               </span>
               {isExpanded ? (
                  <BiChevronUp className="w-6 h-6 text-gray-400" />
               ) : (
                  <BiChevronDown className="w-6 h-6 text-gray-400" />
               )}
            </div>

            {!isExpanded && latestComment && (
               <div className="mt-2">
                  <div className="flex items-start space-x-2">
                     <img
                        src={
                           latestComment.ProfilePicture ||
                           '/api/placeholder/32/32'
                        }
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                     />
                     <div className="flex-1">
                        <div className="flex items-center space-x-2">
                           <p className="text-sm font-medium">
                              {latestComment.username}
                           </p>
                           <p className="text-xs text-gray-400">
                              {timeAgo(new Date(latestComment.createdAt))}
                           </p>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">
                           {latestComment.text}
                        </p>
                     </div>
                  </div>
               </div>
            )}
         </button>

         {isExpanded && (
            <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
               <div className="flex flex-col space-y-4">
                  {comments.map((comment, index) => (
                     <div key={index} className="flex items-start space-x-2">
                        <img
                           src={
                              comment.ProfilePicture || '/api/placeholder/32/32'
                           }
                           alt="avatar"
                           className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                           <div className="flex items-start justify-between">
                              <div className="flex flex-col flex-grow">
                                 <div className="flex items-center space-x-2">
                                    <p className="text-sm font-medium">
                                       {comment.username}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                       {timeAgo(new Date(comment.createdAt))}
                                    </p>
                                 </div>
                                 {isEditing &&
                                 activeComment?._id === comment._id ? (
                                    <div className="mt-2 w-full">
                                       <textarea
                                          ref={textareaRef}
                                          value={editedText}
                                          onChange={(e) =>
                                             setEditedText(e.target.value)
                                          }
                                          className="w-full p-2 bg-gray-800 text-white rounded resize-none"
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
                                             onClick={() => {
                                                setIsEditing(false);
                                                setActiveComment(null);
                                             }}
                                             className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition-colors"
                                          >
                                             Cancel
                                          </button>
                                       </div>
                                    </div>
                                 ) : (
                                    <p className="text-sm text-gray-300 mt-1">
                                       {comment.text}
                                    </p>
                                 )}
                              </div>
                              {(Auth?._id === comment.user ||
                                 Auth?.role === 'admin') && (
                                 <div ref={threeDotsRef}>
                                    <BsThreeDotsVertical
                                       size={16}
                                       className="cursor-pointer text-gray-400 hover:text-gray-200"
                                       onClick={(e) =>
                                          handleOptionsClick(e, comment)
                                       }
                                    />
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {showOptions && (
            <CommentOptionBar
               onClose={closeCommentOptionBar}
               onDelete={handleDelete}
               onEdit={onEdit}
               style={{
                  position: 'absolute',
                  top: optionsBarPosition.top,
                  left: optionsBarPosition.left,
                  width: '150px',
               }}
            />
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
      </div>
   );
};

export default MobileComments;
