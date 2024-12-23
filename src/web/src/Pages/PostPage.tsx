import { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import {
   Layout,
   WidePosts,
   Comments,
   SharePopup,
   PostPageSkeleton,
   MobileComments,
   ZoomableImage,
} from '../Components';
import { CDN_URL } from '../Constants';
import { PostType, UserType } from '../global.types';
import { AuthContext } from '../App';
import useUserCache from '../hooks/useUserCache';
import {
   incrementLikeCount,
   incrementDislikeCount,
   removeLike,
   removeDislike,
} from '../Components/post/helper';
import { getUserByID } from '../util/getUser';
import { getPostByMap } from '../util/getPost';
import { follow } from '../util/followStatus';
import axios from 'axios';
import { AiOutlineLike, AiOutlineDislike, AiOutlineStar } from 'react-icons/ai';
import { FaShare } from 'react-icons/fa';
import { RiUserFollowLine } from 'react-icons/ri';
import { RiUserUnfollowFill } from 'react-icons/ri';

//import gear from '../assets/svg/gear.svg';

export type Comment = {
   _id: string;
   text: string;
   user: string;
   username: string;
   createdAt: Date;
};

const PostPage = () => {
   const location = useLocation();
   const postData = location.state?.postData;
   const [currPostData, setcurrPostData] = useState<PostType | null>(null);
   const shareUrl = `${window.location.origin}/post/${postData?._id || currPostData?._id}`;
   const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
   const imagePositions = [
      postData?.landingPosition?.public_id ||
         currPostData?.landingPosition?.public_id,
      postData?.standingPosition?.public_id ||
         currPostData?.standingPosition?.public_id,
      postData?.aimingPosition?.public_id ||
         currPostData?.aimingPosition?.public_id,
   ].filter(Boolean);
   const { userCache, fetchUsers } = useUserCache();
   const imageTitles = [
      'Landing Position',
      'Standing Position',
      'Aiming Position',
   ];
   const Auth = useContext(AuthContext);
   const user_Id = Auth?._id;
   const verified = Auth?.Verified;
   const { game, id } = useParams<{ game: string; id: string }>();
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [followerCount, setFollowerCount] = useState(0);
   const [followers, setFollowers] = useState<Set<string>>();
   /*
   const [viewMode, setViewMode] = useState('carousel');
   const [isPopupVisible, setPopupVisible] = useState(false);
   const popupRef = useRef<HTMLDivElement>(null);
   */
   const [comments, setComments] = useState<Comment[]>([]);
   const [userComments, setUserComments] = useState<Comment[]>([]);
   const [newComment, setNewComment] = useState('');
   const [isLiked, setIsLiked] = useState(false);
   const [isDisliked, setIsDisliked] = useState(false);
   const [user, setUser] = useState<UserType>();
   const [relatedPosts, setRelatedPosts] = useState<PostType[]>([]);
   const [isSaved, setIsSaved] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [isFullScreen, setIsFullScreen] = useState(false);
   /*
   const handleGearClick = () => {
      setPopupVisible(!isPopupVisible);
   };
   */
   const handleArrowClick = (direction: 'prev' | 'next') => {
      let newIndex = currentImageIndex;

      if (direction === 'prev') {
         newIndex =
            currentImageIndex > 0
               ? currentImageIndex - 1
               : imagePositions.length - 1;
      } else if (direction === 'next') {
         newIndex =
            currentImageIndex < imagePositions.length - 1
               ? currentImageIndex + 1
               : 0;
      }

      setCurrentImageIndex(newIndex);

      const fullScreenImage = document.getElementById('full-screen-image');
      if (fullScreenImage) {
         (fullScreenImage as HTMLImageElement).src =
            `${CDN_URL}/${imagePositions[newIndex]}`;
      }
   };
   /*
   const handleViewModeChange = () => {
      setViewMode(viewMode === 'carousel' ? 'all' : 'carousel');
   };
   */

   const handleFullScreenToggle = useCallback(() => {
      setIsFullScreen((prev) => !prev);
      const fullScreenContainer = document.getElementById(
         'full-screen-container',
      );
      if (fullScreenContainer) {
         if (!isFullScreen) {
            fullScreenContainer.classList.remove('hidden');
            if (fullScreenContainer.requestFullscreen) {
               fullScreenContainer.requestFullscreen();
            } else if ((fullScreenContainer as any).mozRequestFullScreen) {
               (fullScreenContainer as any).mozRequestFullScreen();
            } else if ((fullScreenContainer as any).webkitRequestFullscreen) {
               (fullScreenContainer as any).webkitRequestFullscreen();
            } else if ((fullScreenContainer as any).msRequestFullscreen) {
               (fullScreenContainer as any).msRequestFullscreen();
            }
         } else {
            if (document.exitFullscreen) {
               document.exitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
               (document as any).mozCancelFullScreen();
            } else if ((document as any).webkitExitFullscreen) {
               (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
               (document as any).msExitFullscreen();
            }
            fullScreenContainer.classList.add('hidden');
         }
      }
   }, [isFullScreen]);

   useEffect(() => {
      const handleFullscreenChange = () => {
         if (!document.fullscreenElement) {
            setIsFullScreen(false);
            const fullScreenContainer = document.getElementById(
               'full-screen-container',
            );
            if (fullScreenContainer) {
               fullScreenContainer.classList.add('hidden');
            }
         }
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
         document.removeEventListener(
            'fullscreenchange',
            handleFullscreenChange,
         );
      };
   }, []);
   const savePost = async () => {
      try {
         await axios.post(`/user/${user_Id}/save-post`, {
            postId: postData?._id || currPostData?._id,
         });
         setIsSaved(!isSaved);
         console.log('Post saved successfully');
      } catch (error) {
         console.error('Error saving post:', error);
      }
   };
   const fetchComments = async () => {
      try {
         const postId = location.pathname.split('/')[2];
         const commentsUrl = `/post/${postId}`;

         const response = await axios.get(commentsUrl);

         const specificPost = response.data.find(
            (post: PostType) =>
               post._id === (postData?._id || currPostData?._id),
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

   const handleFollowers = async () => {
      follow(user?._id!, Auth?._id!).then((response) => {
         if (response === 200) {
            setFollowers((prevState) => {
               const newFollowerSet = new Set(prevState);
               const isFollowing = newFollowerSet.has(Auth?._id!);

               if (isFollowing) {
                  newFollowerSet.delete(Auth?._id!);
               } else {
                  newFollowerSet.add(Auth?._id!);
               }

               setFollowerCount((prevCount) =>
                  isFollowing ? prevCount - 1 : prevCount + 1,
               );

               return newFollowerSet;
            });
         } else {
            console.error('Error following user');
         }
      });
   };

   // Handle the submission of a new comment
   const handleCommentSubmit = async () => {
      if (newComment.trim() && verified) {
         try {
            const response = await axios.post(
               `/post/${postData?._id || currPostData?._id}/comment`,
               {
                  text: newComment,
                  userId: user_Id,
                  username: Auth?.username,
                  game: postData?.game || currPostData?.game,
               },
            );
            const userResponse = await axios.post(`/user/${user_Id}/comment`, {
               text: newComment,
               user: user_Id,
               post: postData?._id || currPostData?._id,
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

   const removeComment = (commentId: string) => {
      setComments((prevComments) =>
         prevComments.filter((comment) => comment._id !== commentId),
      );
   };

   const incrementViewCount = async () => {
      axios
         .post(`/post/${postData._id}/increment-view-count`, {
            game: postData.game || currPostData?.game,
         })

         .then((response) => {
            console.log('Successfully incremented view count:', response);
         })
         .catch((error) => {
            console.error('Failed to increment view count:', error);
         });
   };

   useEffect(() => {
      fetchComments();
      incrementViewCount();
   }, []);

   useEffect(() => {
      if (!currPostData && postData) {
         document.title = postData.postTitle;
      } else if (!postData && currPostData) {
         document.title = currPostData.postTitle;
      }
   }, [postData, currPostData]);

   const fetchPostData = useCallback(async () => {
      setIsLoading(true);
      try {
         const response = await axios.get(`/post/detail/${game}/${id}`);
         setcurrPostData(response.data);
         console.log(response.data.likes);
         setIsLiked(
            response.data.likes.some((like: any) => like.userId === user_Id),
         );
         setIsDisliked(
            response.data.dislikes.some(
               (dislike: any) => dislike.userId === user_Id,
            ),
         );

         // Fetch user data for the post author
         fetchUsers([response.data.UserID]);
      } catch (error) {
         console.error('Failed to fetch post data:', error);
      } finally {
         setIsLoading(false);
      }
   }, [id, user_Id, game, fetchUsers]);

   useEffect(() => {
      if (id) {
         fetchPostData();
      }
   }, [id, fetchPostData]);

   useEffect(() => {
      if (Auth?.saved.includes(postData?._id || currPostData?._id)) {
         setIsSaved(true);
      }
   }, [Auth?.saved, postData?._id, currPostData?._id]);

   useEffect(() => {
      const fetchRelatedData = async () => {
         const userId = postData?.UserID || currPostData?.UserID;
         if (userId) {
            const user = userCache[userId] || (await getUserByID(userId));
            setUser(user);
            setFollowers(new Set(user.followers));
            setFollowerCount(user.followers.length);
         }

         const game = postData?.game || currPostData?.game;
         const mapName = postData?.mapName || currPostData?.mapName;
         if (game && mapName) {
            const posts = await getPostByMap(game, mapName);
            let filter: PostType[] = posts
               .slice(0, 20)
               .map((post) => post.post!);
            setRelatedPosts(filter);

            // Fetch user data for related posts
            const userIds = filter.map((post) => post.UserID);
            fetchUsers(userIds);
         }
      };

      fetchRelatedData();
   }, [postData, currPostData, userCache, fetchUsers]);

   if (isLoading) {
      return (
         <>
            <Layout>
               <div
                  style={{
                     position: 'relative',
                     width: '100%',
                     backgroundColor: 'black',
                     overflow: 'hidden',
                  }}
               >
                  <PostPageSkeleton />;
               </div>
            </Layout>
         </>
      );
   }

   return (
      <>
         <Layout>
            <div className="lg:flex">
               <div className="md:ml-[70px] relative lg:w-3/4 bg-black pb-4">
                  <div className="w-full" style={{ aspectRatio: '16/9' }}>
                     <div className="relative w-full h-full rounded-r-xl overflow-hidden">
                        <ZoomableImage
                           src={`${CDN_URL}/${imagePositions[currentImageIndex]}`}
                           alt={postData?.postTitle || currPostData?.postTitle}
                           isFullScreen={false}
                           onFullScreenToggle={handleFullScreenToggle}
                        />
                     </div>
                  </div>
                  <div className="flex justify-between w-full">
                     <button
                        onClick={() => handleArrowClick('prev')}
                        className="text-2xl"
                     >
                        ←
                     </button>
                     {imageTitles[currentImageIndex]}
                     <button
                        onClick={() => handleArrowClick('next')}
                        className="text-2xl"
                     >
                        →
                     </button>
                  </div>
                  <div className="ml-2 text-lg font-bold text-center">
                     <p>{postData?.postTitle || currPostData?.postTitle}</p>
                  </div>
                  <div className="overflow-x-auto">
                     <div className="flex justify-between ml-2 mr-2 min-w-max">
                        <div className="flex">
                           <div className="flex">
                              <div>
                                 <Link
                                    to={`/user/${postData?.Username || currPostData?.Username}`}
                                 >
                                    <img
                                       className="rounded-full cursor-pointer w-10 h-10"
                                       src={`${user?.ProfilePicture}`}
                                       alt="Profile"
                                    />
                                 </Link>
                              </div>
                              <div className="flex flex-col ml-1">
                                 <Link
                                    to={`/user/${postData?.Username || currPostData?.Username}`}
                                 >
                                    <p className="cursor-pointer font-bold">
                                       {postData?.Username ||
                                          currPostData?.Username}
                                    </p>
                                 </Link>
                                 <p className="text-sm text-gray-500">
                                    {followerCount} followers
                                 </p>
                              </div>
                           </div>
                           {Auth?.username &&
                              Auth?.username !== user?.username && (
                                 <button
                                    className="ml-5 flex items-center justify-center px-5 py-1 bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300 ease-in-out"
                                    onClick={handleFollowers}
                                 >
                                    <div className="flex text-center items-center gap-x-1">
                                       {followers?.has(Auth?._id!) ? (
                                          <>
                                             <RiUserUnfollowFill />
                                             <p>Unfollow</p>
                                          </>
                                       ) : (
                                          <>
                                             <RiUserFollowLine />
                                             <p>Follow</p>
                                          </>
                                       )}
                                    </div>
                                 </button>
                              )}
                        </div>
                        <div className="flex">
                           <div className="flex">
                              <div
                                 className="flex items-center rounded-full px-4 py-0.5 transition-colors duration-200"
                                 style={{
                                    backgroundColor: '#212121',
                                    transition: 'background-color 0.2s',
                                 }}
                                 onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                       '#1a1a1a')
                                 }
                                 onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                       '#212121')
                                 }
                              >
                                 <span
                                    className="flex items-center cursor-pointer"
                                    onClick={() => {
                                       if (isLiked) {
                                          removeLike(
                                             postData?._id || currPostData?._id,
                                             user_Id!,
                                             postData?.game ||
                                                currPostData?.game,
                                          );
                                          setIsLiked(false);
                                       } else {
                                          incrementLikeCount(
                                             postData?._id || currPostData?._id,
                                             user_Id!,
                                             postData?.game ||
                                                currPostData?.game,
                                          );
                                          setIsLiked(true);
                                          setIsDisliked(false);
                                       }
                                    }}
                                 >
                                    <AiOutlineLike
                                       className={`text-white h-5 w-5 ${
                                          isLiked
                                             ? 'animate-pulse text-yellow-500'
                                             : 'fill-white'
                                       }`}
                                    />
                                    <p className="ml-1 text-white">
                                       {(postData?.likes?.length ?? 0) ||
                                          (currPostData?.likes?.length ?? 0)}
                                    </p>
                                 </span>
                                 <span className="mx-2 text-white">|</span>
                                 <span
                                    className="flex items-center cursor-pointer"
                                    onClick={() => {
                                       if (isDisliked) {
                                          removeDislike(
                                             postData?._id || currPostData?._id,
                                             user_Id!,
                                             postData?.game ||
                                                currPostData?.game,
                                          );
                                          setIsDisliked(false);
                                       } else {
                                          incrementDislikeCount(
                                             postData?._id || currPostData?._id,
                                             user_Id!,
                                             postData?.game ||
                                                currPostData?.game,
                                          );
                                          setIsDisliked(true);
                                          setIsLiked(false);
                                       }
                                    }}
                                 >
                                    <AiOutlineDislike
                                       className={`text-white h-5 w-5 ${
                                          isDisliked
                                             ? 'animate-pulse text-yellow-500'
                                             : ''
                                       }`}
                                    />
                                    <p className="ml-1 text-white">
                                       {(postData?.dislikes?.length ?? 0) ||
                                          (currPostData?.dislikes?.length ?? 0)}
                                    </p>
                                 </span>
                              </div>
                           </div>
                           <button
                              className="flex items-center rounded-full px-4 py-0.5 transition-colors duration-200 ml-2 bg-[#212121] hover:bg-[#1a1a1a]"
                              onClick={() =>
                                 setIsSharePopupOpen(!isSharePopupOpen)
                              }
                           >
                              <FaShare className="text-xl mr-1 text-white" />
                              <span className="text-sm font-medium text-white">
                                 Share
                              </span>
                           </button>
                           <button
                              className={`flex items-center rounded-full px-4 py-0.5 transition-colors duration-200 ml-2 ${
                                 isSaved ? 'animate-pulse bg-yellow-100' : ''
                              }`}
                              style={{
                                 backgroundColor: '#212121',
                                 transition: 'background-color 0.2s',
                              }}
                              onMouseEnter={(e) =>
                                 (e.currentTarget.style.backgroundColor =
                                    '#1a1a1a')
                              }
                              onMouseLeave={(e) =>
                                 (e.currentTarget.style.backgroundColor =
                                    '#212121')
                              }
                              onClick={() => savePost()}
                           >
                              <AiOutlineStar
                                 className={`text-xl mr-1 ${
                                    isSaved ? 'text-yellow-500' : 'text-white'
                                 }`}
                              />
                              <span
                                 className={`text-sm font-medium ${
                                    isSaved ? 'text-yellow-600' : 'text-white'
                                 }`}
                              >
                                 Save
                              </span>
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="mt-4 mb-4 bg-gray-500 rounded-xl p-4 ml-2 mr-2">
                     <div className="flex flex-row space-x-2 font-bold">
                        <p>{postData?.views || currPostData?.views} views</p>
                        <p>
                           {new Date(
                              postData?.date || currPostData?.date,
                           ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                           })}
                        </p>
                        {postData?.jumpThrow && (
                           <i className="italic ml-16">
                              Lineup requires jump throw
                           </i>
                        )}
                     </div>
                     {postData?.lineupDescription ||
                        currPostData?.lineupDescription}
                  </div>
                  <div className="bg-black md:ml-[10px]">
                     <div className="flex items-start space-x-3">
                        {Auth?.username &&
                           (Auth.Verified ? (
                              <>
                                 <img
                                    className="w-10 h-10 rounded-full"
                                    src={`${Auth?.ProfilePicture}`}
                                    alt="PFP"
                                 />
                                 <div className="flex-1">
                                    <div className="flex items-center">
                                       <h4 className="text-sm font-bold">
                                          {Auth?.username}
                                       </h4>
                                    </div>
                                    <textarea
                                       className="mt-1 text-sm w-full rounded border-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="Add a public comment..."
                                       onChange={(e) => {
                                          setNewComment(e.target.value);
                                       }}
                                    ></textarea>
                                    <div className="mt-2 flex justify-end space-x-2">
                                       <button className="text-sm text-gray-500">
                                          CANCEL
                                       </button>
                                       <button
                                          className="text-sm text-blue-500 font-semibold"
                                          onClick={handleCommentSubmit}
                                       >
                                          COMMENT
                                       </button>
                                    </div>
                                 </div>
                              </>
                           ) : (
                              <div className="text-red-500 text-sm font-semibold align-content:center">
                                 Please verify your account to comment.
                              </div>
                           ))}
                     </div>
                     {window.innerWidth <= 768 ? (
                        <MobileComments
                           comments={comments}
                           postId={postData?._id || currPostData?._id}
                           onDelete={removeComment}
                           className="mt-4"
                        />
                     ) : (
                        // Your existing Comments component
                        comments.map((comment, index) => (
                           <Comments
                              className="mt-4"
                              comment={comment}
                              postId={postData?._id || currPostData?._id}
                              onDelete={removeComment}
                              key={index}
                           />
                        ))
                     )}
                  </div>
               </div>
               <div className="relative lg:flex-grow bg-black">
                  {relatedPosts.map((post, index) => {
                     if (post._id !== (postData?._id || currPostData?._id)) {
                        return (
                           <WidePosts
                              post={post}
                              key={index}
                              userCache={userCache}
                              fetchUsers={fetchUsers}
                           />
                        );
                     }
                     return null;
                  })}
               </div>
            </div>
         </Layout>
         <div
            id="full-screen-container"
            className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-50 hidden flex justify-center items-center"
         >
            <div className="relative w-full h-full flex justify-center items-center">
               <ZoomableImage
                  src={`${CDN_URL}/${imagePositions[currentImageIndex]}`}
                  alt={postData?.postTitle || currPostData?.postTitle}
                  isFullScreen={true}
                  onFullScreenToggle={handleFullScreenToggle}
               />
               <div className="absolute bottom-0 w-full h-16 bg-black bg-opacity-50 flex justify-between items-center p-4">
                  <div className="flex justify-center items-center w-full space-x-4">
                     <button
                        onClick={() => handleArrowClick('prev')}
                        className="text-2xl text-white"
                     >
                        ←
                     </button>
                     <div
                        style={{
                           width: '200px',
                           textAlign: 'center',
                        }}
                        className="text-white"
                     >
                        {imageTitles[currentImageIndex]}
                     </div>
                     <button
                        onClick={() => handleArrowClick('next')}
                        className="text-2xl text-white"
                     >
                        →
                     </button>
                  </div>
               </div>
            </div>
         </div>
         {isSharePopupOpen && (
            <div className="absolute z-10 mt-2">
               <SharePopup
                  shareUrl={shareUrl}
                  isOpen={isSharePopupOpen}
                  onClose={() => setIsSharePopupOpen(false)}
               />
            </div>
         )}
      </>
   );
};

export default PostPage;
