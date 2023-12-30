import { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Footer, SideNavWrapper } from '../Components';
import { CDN_URL } from '../Constants';
import { PostType } from '../global.types';
import { AuthContext } from '../App';
import axios from 'axios';
import gear from '../assets/svg/gear.svg';

interface Comment {
   text: string;
   userId: string;
   username: string;
   createdAt: Date;
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

   const fetchComments = async () => {
      try {
         const postId = location.pathname.split('/')[2];
         const commentsUrl = `/post/${postId}`;

         const response = await axios.get(commentsUrl);

         const specificPost = response.data.find(
            (post: PostType) => post._id === postData._id,
         );
         if (specificPost) {
            comments.sort(
               (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
            );
            setComments(specificPost.comments);
         } else {
            console.log('Post not found in the response data');
         }
      } catch (error) {
         console.error('Failed to fetch post data:', error);
      }
   };

   // Handle the submission of a new comment
   const handleCommentSubmit = async () => {
      if (newComment.trim() && verified) {
         try {
            const response = await axios.post(`/post/${postData._id}/comment`, {
               text: newComment,
               userId: user_Id,
               username: Auth?.username,
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
                     className="w-3/5 h-auto"
                  />
                  <div className="flex justify-between w-32">
                     <button
                        onClick={() => handleArrowClick('prev')}
                        className="text-2xl"
                     >
                        ←
                     </button>
                     <button
                        onClick={() => handleArrowClick('next')}
                        className="text-2xl"
                     >
                        →
                     </button>
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
            <div className="flex justify-center">
               <p className="text-base md:text-lg leading-normal md:leading-relaxed text-black-700 mb-4 mx-4 md:mx-20 w-3/4 shadow-2xl pt-4">
                  {postData.lineupDescription}
               </p>
            </div>

            <div className="comments-section mt-6 bg-white shadow-sm p-4 rounded-lg">
               <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Comments
               </h2>
               {Auth?.Verified && (
                  <div className="comment-input flex">
                     <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="text-black flex-1 border border-gray-300 bg-white p-3 rounded-l-lg resize-none"
                        style={{
                           minHeight: '100px',
                           maxHeight: '200px',
                           width: '300px',
                        }}
                     ></textarea>
                     <button
                        onClick={handleCommentSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-r-lg transition duration-300 ease-in-out"
                        style={{ cursor: 'pointer' }}
                        disabled={!newComment}
                     >
                        Submit
                     </button>
                  </div>
               )}

               <div
                  className="comments-list"
                  style={{
                     maxHeight: '500px',
                     maxWidth: '800px',
                     overflowY: 'auto',
                     overflowX: 'hidden',
                  }}
               >
                  {comments.map((comment, index) => (
                     <div
                        key={index}
                        className="border-b border-gray-200 py-3 hover:bg-gray-50"
                     >
                        <div className="flex items-center space-x-3">
                           <div>
                              <p className="text-gray-800 font-medium">
                                 {comment.username} -{' '}
                                 {new Date(comment.createdAt).toLocaleString()}
                              </p>
                              <p className="text-gray-600">{comment.text}</p>
                           </div>
                        </div>
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
