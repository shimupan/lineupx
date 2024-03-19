import { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
   Header,
   Footer,
   SideNavWrapper,
   WidePosts,
   Comments,
} from '../Components';
import { CDN_URL } from '../Constants';
import { PostType, UserType } from '../global.types';
import { AuthContext } from '../App';
import {
   incrementLikeCount,
   incrementDislikeCount,
} from '../Components/post/helper';
import { getUserByID } from '../util/getUser';
import { getPostByMap } from '../util/getPost';
import axios from 'axios';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
//import gear from '../assets/svg/gear.svg';

export type Comment = {
   text: string;
   userId: string;
   username: string;
   createdAt: Date;
};

const PostPage = () => {
   const location = useLocation();
   const postData = location.state.postData;
   const imagePositions = [
      postData.landingPosition.public_id,
      postData.standingPosition.public_id,
      postData.aimingPosition.public_id,
   ];
   const Auth = useContext(AuthContext);
   const user_Id = Auth?._id;
   const verified = Auth?.Verified;

   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   /*
   const [viewMode, setViewMode] = useState('carousel');
   const [isPopupVisible, setPopupVisible] = useState(false);
   const popupRef = useRef<HTMLDivElement>(null);
   */
   const [comments, setComments] = useState<Comment[]>([]);
   const [userComments, setUserComments] = useState<Comment[]>([]);
   const [newComment, setNewComment] = useState('');

   const [user, setUser] = useState<UserType>();
   const [relatedPosts, setRelatedPosts] = useState<PostType[]>([]);
   /*
   const handleGearClick = () => {
      setPopupVisible(!isPopupVisible);
   };
   */
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
   /*
   const handleViewModeChange = () => {
      setViewMode(viewMode === 'carousel' ? 'all' : 'carousel');
   };
   */
   const fetchComments = async () => {
      try {
         const postId = location.pathname.split('/')[2];
         const commentsUrl = `/post/${postId}`;

         const response = await axios.get(commentsUrl);

         const specificPost = response.data.find(
            (post: PostType) => post._id === postData._id,
         );
         if (specificPost) {
            specificPost.comments.sort(
               (a: any, b: any) =>
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
            console.log(newComment);
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

            const newCommentWithDate = {
               ...response.data,
               createdAt: new Date(),
               username: Auth?.username,
               text: newComment,
            };

            setComments([newCommentWithDate, ...comments]);
            setUserComments([userResponse.data, ...userComments]);
            setNewComment('');
         } catch (error) {
            console.error('Error posting comment:', error);
         }
      }
   };

   useEffect(() => {
      fetchComments();
   }, []);

   useEffect(() => {
      if (postData.UserID) {
         getUserByID(postData.UserID).then((user) => {
            setUser(user);
         });
         getPostByMap(postData.game, postData.mapName).then((posts) => {
            let filter: PostType[] = [];
            for (let i = 0; i < posts.length; i++) {
               filter.push(posts[i].post!);
            }
            setRelatedPosts(filter);
         });
      }
   }, [postData.UserID]);

   return (
      <>
         <Header />

         <SideNavWrapper />
         {/* <Posts posts={posts} /> 
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
                           width: '800px',
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
                     maxWidth: '1000px',
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
         */}
         <div className="lg:flex">
            <div className="md:ml-[70px] relative lg:w-3/4 bg-black pb-4">
               <div className="h-1/2 lg:h-3/4 object-cover">
                  <img
                     src={`${CDN_URL}/${imagePositions[currentImageIndex]}`}
                     alt={postData.postTitle}
                     className="w-full h-full rounded-r-xl"
                  />
               </div>
               <div className="flex justify-between w-full">
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
               <div className="ml-2 text-lg font-bold text-center">
                  <p>{postData.postTitle}</p>
               </div>
               <div className="flex justify-between ml-2 mr-2">
                  <div className="flex">
                     <div className="flex">
                        <div>
                           <Link to={`/user/${postData.Username}`}>
                              <img
                                 className="rounded-full cursor-pointer"
                                 src={`${user?.ProfilePicture}`}
                              />
                           </Link>
                        </div>
                        <div className="flex flex-col ml-1">
                           <Link to={`/user/${postData.Username}`}>
                              <p className="cursor-pointer">
                                 {postData.Username}
                              </p>
                           </Link>
                           {/*
                              <p>Subscribers</p>
                              */}
                        </div>
                     </div>
                     {/*
                        <div>Follow</div>
                        */}
                  </div>
                  <div className="flex">
                     <div className="flex">
                        <span>
                           <AiOutlineLike
                              className={
                                 'text-white h-5 w-5 cursor-pointer fill-white'
                              }
                              onClick={() => {
                                 console.log(user_Id!);
                                 incrementLikeCount(postData._id, user_Id!);
                              }}
                           />
                        </span>
                        <p className="mr-1">{postData.likes.length}</p>
                     </div>
                     <div className="flex">
                        <span>
                           <AiOutlineDislike
                              className="text-white h-5 w-5 cursor-pointer"
                              onClick={() => {
                                 incrementDislikeCount(postData._id);
                              }}
                           />
                        </span>
                        <p className="ml-1">{postData.dislikes.length}</p>
                     </div>
                  </div>
               </div>
               <div className="mt-4 mb-4 bg-gray-500 rounded-xl p-4 ml-2 mr-2">
                  <div className="flex flex-row space-x-2 font-bold">
                     <p>{postData.views} views</p>
                     <p>
                        {new Date(postData.date).toLocaleDateString('en-US', {
                           month: 'short',
                           day: 'numeric',
                           year: 'numeric',
                        })}
                     </p>
                  </div>
                  {postData.lineupDescription}
               </div>
            </div>
            <div className="relative lg:flex-grow bg-black">
               {relatedPosts.map((post, index) => {
                  if (post._id !== postData._id) {
                     return <WidePosts post={post} key={index} />;
                  }
               })}
            </div>
         </div>
         <div className="bg-black h-screen md:ml-[70px] pl-2">
            <div className="flex items-start space-x-3 mb-4">
               <img
                  className="w-10 h-10 rounded-full"
                  src={`${user?.ProfilePicture}`}
                  alt="PFP"
               />
               <div className="flex-1">
                  <div className="flex items-center">
                     <h4 className="text-sm font-bold">{user?.username}</h4>
                  </div>
                  <textarea
                     className="mt-1 text-sm w-full rounded border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Add a public comment..."
                     onChange={(e) => {
                        setNewComment(e.target.value);
                        console.log(e.target.value);
                     }}
                  ></textarea>
                  <div className="mt-2 flex justify-end space-x-2">
                     <button className="text-sm text-gray-500">CANCEL</button>
                     <button
                        className="text-sm text-blue-500 font-semibold"
                        onClick={handleCommentSubmit}
                     >
                        COMMENT
                     </button>
                  </div>
               </div>
            </div>
            <div className="">
               {comments.map((comment, index) => (
                  <Comments className="mt-4" comment={comment} key={index} />
               ))}
            </div>
         </div>
         <Footer />
      </>
   );
};

export default PostPage;
