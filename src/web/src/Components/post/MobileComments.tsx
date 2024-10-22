import { useState, useRef, useEffect, useContext } from 'react';
import { BiChevronDown, BiX } from 'react-icons/bi';
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

const COMMENTS_PER_PAGE = 15;

const MobileComments: React.FC<MobileCommentsProps> = ({
   comments = [],
   onDelete,
   postId,
   className = '',
}) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const [commentCount] = useState(comments.length);
   const [visibleComments, setVisibleComments] = useState<Comment[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
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

   // Handle body scroll lock
   useEffect(() => {
      if (isExpanded) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = '';
      }
      return () => {
         document.body.style.overflow = '';
      };
   }, [isExpanded]);

   // Load initial comments
   useEffect(() => {
      loadComments(1);
   }, [comments]);

   const loadComments = (page: number) => {
      setIsLoading(true);
      const startIndex = 0;
      const endIndex = page * COMMENTS_PER_PAGE;
      const newComments = comments.slice(startIndex, endIndex);
      setVisibleComments(newComments);
      setCurrentPage(page);
      setIsLoading(false);
   };

   const loadMoreComments = () => {
      const nextPage = currentPage + 1;
      loadComments(nextPage);
   };

   const hasMoreComments = comments.length > visibleComments.length;

   const closeCommentOptionBar = () => {
      setShowOptions(false);
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
         setVisibleComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== activeComment._id),
         );
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

         setVisibleComments((prevComments) =>
            prevComments.map((comment) =>
               comment._id === activeComment._id
                  ? { ...comment, text: editedText }
                  : comment,
            ),
         );

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
      const PostOptionBarWidth = 150;
      const windowWidth = window.innerWidth;

      let adjustedLeft = left;

      if (left + PostOptionBarWidth > windowWidth) {
         adjustedLeft = windowWidth - PostOptionBarWidth - 10;
      }

      setOptionsBarPosition({
         top: top + 20,
         left: adjustedLeft,
      });
      setShowOptions(true);
   };

   const closeOverlay = () => {
      setIsExpanded(false);
      setIsEditing(false);
      setActiveComment(null);
      setShowOptions(false);
      setShowDeleteConfirmation(false);
   };

   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
         closeOverlay();
      }
   };

   return (
      <div className={`w-full ${className}`}>
         {/* Comment Preview Button */}
         <button
            onClick={() => setIsExpanded(true)}
            className="w-full text-left p-4 bg-gray-800/50 rounded-lg mb-2"
         >
            <div className="flex justify-between items-center">
               <span className="text-sm font-medium text-gray-200">
                  Comments {commentCount.toLocaleString()}
               </span>
               <BiChevronDown className="w-6 h-6 text-gray-400" />
            </div>

            {latestComment && (
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

         {/* Comments Overlay */}
         {isExpanded && (
            <div
               className="fixed inset-0 bg-black bg-opacity-50 z-50"
               style={{ backdropFilter: 'blur(4px)' }}
               onClick={handleBackdropClick}
            >
               <div
                  className="fixed inset-x-0 bottom-0 bg-gray-900 rounded-t-xl max-h-[70vh] flex flex-col animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Drag Handle */}
                  <div className="h-1.5 w-12 bg-gray-600 mx-auto mt-2 rounded-full" />

                  {/* Header */}
                  <div className="sticky top-0 z-10 flex justify-between items-center px-4 pt-2 pb-4 border-b border-gray-700 bg-gray-900">
                     <h2 className="text-lg font-semibold">
                        Comments {commentCount.toLocaleString()}
                     </h2>
                     <button
                        onClick={closeOverlay}
                        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                     >
                        <BiX size={24} />
                     </button>
                  </div>

                  {/* Scrollable Comments */}
                  <div className="overflow-y-auto flex-grow">
                     <div className="p-3 space-y-3">
                        {comments.map((comment, index) => (
                           <div
                              key={index}
                              className="flex items-start space-x-2"
                           >
                              <img
                                 src={
                                    comment.ProfilePicture ||
                                    '/api/placeholder/32/32'
                                 }
                                 alt="avatar"
                                 className="w-8 h-8 rounded-full flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-start justify-between">
                                    <div className="flex flex-col flex-grow min-w-0">
                                       <div className="flex items-center space-x-2">
                                          <p className="text-sm font-medium truncate">
                                             {comment.username}
                                          </p>
                                          <p className="text-xs text-gray-400 flex-shrink-0">
                                             {timeAgo(
                                                new Date(comment.createdAt),
                                             )}
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
                                                   className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition-colors text-sm"
                                                >
                                                   Update
                                                </button>
                                                <button
                                                   onClick={() => {
                                                      setIsEditing(false);
                                                      setActiveComment(null);
                                                   }}
                                                   className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors text-sm"
                                                >
                                                   Cancel
                                                </button>
                                             </div>
                                          </div>
                                       ) : (
                                          <p className="text-sm text-gray-300 mt-1 break-words">
                                             {comment.text}
                                          </p>
                                       )}
                                    </div>
                                    {(Auth?._id === comment.user ||
                                       Auth?.role === 'admin') && (
                                       <div
                                          ref={threeDotsRef}
                                          className="ml-2 flex-shrink-0"
                                       >
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

                        {hasMoreComments && (
                           <div className="flex justify-center mt-4">
                              <button
                                 onClick={loadMoreComments}
                                 className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50"
                                 disabled={isLoading}
                              >
                                 {isLoading
                                    ? 'Loading...'
                                    : 'Show more comments'}
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Comment Options */}
         {showOptions && (
            <CommentOptionBar
               onClose={closeCommentOptionBar}
               onDelete={handleDelete}
               onEdit={onEdit}
               style={{
                  position: 'fixed',
                  top: optionsBarPosition.top,
                  left: optionsBarPosition.left,
                  width: '150px',
                  zIndex: 60,
               }}
            />
         )}

         {/* Delete Confirmation */}
         {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
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
