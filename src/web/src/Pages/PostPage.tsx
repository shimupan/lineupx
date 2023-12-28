import { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Footer, SideNavWrapper } from '../Components';
import { CDN_URL } from '../Constants';
import { AuthContext } from '../App';
import axios from 'axios';
import gear from '../assets/svg/gear.svg';

interface Comment {
   text: string;
   userId: string;
   // other properties...
}
const PostPage = () => {
   const location = useLocation();
   const postData = location.state.postData;
   const Auth = useContext(AuthContext);
   const user_Id = Auth?._id;
   const verified = Auth?.Verified;
   const imagePositions = [
      postData.landingPosition.public_id,
      postData.standingPosition.public_id,
      postData.aimingPosition.public_id,
   ];

   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [viewMode, setViewMode] = useState('carousel');
   const [isPopupVisible, setPopupVisible] = useState(false);

   const handleGearClick = () => {
      setPopupVisible(!isPopupVisible);
   };
   const handleArrowClick = (direction: 'next' | 'prev') => {
      if (direction === 'next') {
         setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % imagePositions.length,
         );
      } else {
         setCurrentImageIndex(
            (prevIndex) =>
               (prevIndex - 1 + imagePositions.length) % imagePositions.length,
         );
      }
   };

   const handleViewModeChange = () => {
      setViewMode(viewMode === 'carousel' ? 'all' : 'carousel');
   };
   const popupRef = useRef<HTMLDivElement>(null);

   const [comments, setComments] = useState<Comment[]>([]);
   const [userComments, setUserComments] = useState<Comment[]>([]);
   const [newComment, setNewComment] = useState('');

   // Handle the submission of a new comment
   const fetchComments = async () => {

   };

   // Handle the submission of a new comment
   const handleCommentSubmit = async () => {
      if (newComment.trim() && verified) {
         try {
            const response = await axios.post(`/post/${postData._id}/comment`, {
               text: newComment,
               userId: user_Id,
            });
            const userResponse = await axios.post(`/user/${user_Id}/comment`, {
               text: newComment,
               user: user_Id,
               post: postData._id,
               
            });
            setComments([...comments, response.data]); 
            setUserComments([...userComments, userResponse.data]);
            setNewComment('');
         } catch (error) {
            console.error('Error posting comment:', error);
         }
      }
   };

   useEffect(() => {
      fetchComments();

      function handleClickOutside(event: MouseEvent) {
         if (
            popupRef.current &&
            !popupRef.current.contains(event.target as Node)
         ) {
            setPopupVisible(false);
         }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   return (
      <>
         <Header />

         <SideNavWrapper />

         <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 pt-3">
               {postData.postTitle}
            </h1>
            <button
               onClick={handleGearClick}
               className="absolute left-20 bottom-100"
            >
               <img src={gear} alt="Change view mode" className="w-12 h-12" />
            </button>
            {isPopupVisible && (
               <div
                  ref={popupRef}
                  className="popup absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 p-6 rounded-lg shadow-xl"
               >
                  <p className="text-lg text-gray-700 mb-4">
                     Currently on{' '}
                     {viewMode === 'carousel' ? 'carousel' : 'all images'} view.
                  </p>
                  <button
                     onClick={handleViewModeChange}
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                     Switch to{' '}
                     {viewMode === 'carousel' ? 'all images' : 'carousel'} view
                  </button>
               </div>
            )}

            {viewMode === 'carousel' ? (
               <>
                  <img
                     src={`${CDN_URL}/${imagePositions[currentImageIndex]}`}
                     alt={postData.postTitle}
                     className="w-3/5 h-auto mb-4"
                  />
                  <div>
                     <button onClick={() => handleArrowClick('prev')}>←</button>
                     <button onClick={() => handleArrowClick('next')}>→</button>
                  </div>
               </>
            ) : (
               <>
                  <img
                     src={`${CDN_URL}/${postData.landingPosition.public_id}`}
                     alt={postData.postTitle}
                     className="w-3/5 h-auto mb-4"
                  />
                  <img
                     src={`${CDN_URL}/${postData.standingPosition.public_id}`}
                     alt={postData.postTitle}
                     className="w-3/5 h-auto mb-4"
                  />
                  <img
                     src={`${CDN_URL}/${postData.aimingPosition.public_id}`}
                     alt={postData.postTitle}
                     className="w-3/5 h-auto mb-4"
                  />
               </>
            )}
            <p className="text-base">{postData.description}</p>

            <div className="comments-section mt-6">
               <h2 className="text-xl font-bold mb-4">Comments</h2>
               <div className="add-comment flex mb-4">
                  <input
                     type="text"
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     placeholder="Add a comment..."
                     className="text-black flex-1 border border-gray-300 p-2 rounded mr-2"
                  />
                  <button
                     onClick={handleCommentSubmit}
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                  >
                     Submit
                  </button>
               </div>
               <div className="comments-list">
                  {comments.map((comment, index) => (
                     <div key={index} className="border-b border-gray-300 py-2">
                        <p className="text-gray-700">{comment.text}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <Footer />
      </>
   );
};

export default PostPage;
