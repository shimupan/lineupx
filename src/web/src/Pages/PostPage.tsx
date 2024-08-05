import { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import {
   Header,
   Footer,
   SideNavWrapper,
   WidePosts,
   Comments,
   BottomNav,
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
import { follow } from '../util/followStatus';
import axios from 'axios';
import { AiOutlineLike, AiOutlineDislike, AiOutlineStar } from 'react-icons/ai';
import { RiUserFollowLine } from 'react-icons/ri';
import { RiUserUnfollowFill } from 'react-icons/ri';
import { CgMaximize, CgMinimize } from 'react-icons/cg';
import useIsMobile from '../hooks/isMobile';

//import gear from '../assets/svg/gear.svg';

export type Comment = {
   _id: string;
   text: string;
   user: string;
   username: string;
   createdAt: Date;
};

const PostPage = () => {
   const isMobile = useIsMobile();
   const location = useLocation();
   const postData = location.state?.postData;
   const [currPostData, setcurrPostData] = useState<PostType | null>(null);
   const imagePositions = [
      postData?.landingPosition?.public_id ||
         currPostData?.landingPosition?.public_id,
      postData?.standingPosition?.public_id ||
         currPostData?.standingPosition?.public_id,
      postData?.aimingPosition?.public_id ||
         currPostData?.aimingPosition?.public_id,
   ].filter(Boolean);

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

   const handleFullScreenToggle = (imageSrc: string) => {
      const fullScreenContainer = document.getElementById(
         'full-screen-container',
      );
      const fullScreenImage = document.getElementById('full-screen-image');

      if (fullScreenImage) {
         (fullScreenImage as HTMLImageElement).src = `${CDN_URL}/${imageSrc}`;
      }

      if (fullScreenContainer) {
         if (fullScreenContainer.classList.contains('hidden')) {
            fullScreenContainer.classList.remove('hidden');
            if (fullScreenContainer.requestFullscreen) {
               fullScreenContainer.requestFullscreen();
            } else if ((fullScreenContainer as any).mozRequestFullScreen) {
               /* Firefox */
               (fullScreenContainer as any).mozRequestFullScreen();
            } else if ((fullScreenContainer as any).webkitRequestFullscreen) {
               /* Chrome, Safari and Opera */
               (fullScreenContainer as any).webkitRequestFullscreen();
            } else if ((fullScreenContainer as any).msRequestFullscreen) {
               /* IE/Edge */
               (fullScreenContainer as any).msRequestFullscreen();
            }

            // Add fullscreenchange event listener
            document.addEventListener('fullscreenchange', () => {
               if (!document.fullscreenElement) {
                  fullScreenContainer.classList.add('hidden');
               }
            });
         } else {
            if (document.exitFullscreen) {
               document.exitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
               /* Firefox */
               (document as any).mozCancelFullScreen();
            } else if ((document as any).webkitExitFullscreen) {
               /* Chrome, Safari and Opera */
               (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) {
               /* IE/Edge */
               (document as any).msExitFullscreen();
            }
            fullScreenContainer.classList.add('hidden');
         }
      }
   };
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

   useEffect(() => {
      const fetchPostData = async () => {
         try {
            const response = await axios.get(`/post/detail/${game}/${id}`);
            setcurrPostData(response.data);
            console.log(response.data.likes);
            // Check if the user has already liked or disliked the post
            setIsLiked(
               response.data.likes.some((like: any) => like.userId === user_Id),
            );
            setIsDisliked(
               response.data.dislikes.some(
                  (dislike: any) => dislike.userId === user_Id,
               ),
            );
         } catch (error) {
            console.error('Failed to fetch post data:', error);
         }
      };
      if (Auth?.saved.includes(postData?._id || currPostData?._id)) {
         setIsSaved(true);
      }
      if (id) {
         fetchPostData();
      }
   }, [id, user_Id]);

   useEffect(() => {
      if (postData) {
         getUserByID(postData.UserID).then((user) => {
            setUser(user);
            setFollowers(new Set(user.followers));
            setFollowerCount(user.followers.length);
         });
         getPostByMap(postData.game, postData.mapName).then((posts) => {
            // Limit the number of related posts to 20
            let filter: PostType[] = posts
               .slice(0, 20)
               .map((post) => post.post!);
            setRelatedPosts(filter);
         });
      } else {
         getUserByID(currPostData?.UserID ?? '').then((user) => {
            setUser(user);
         });
         getPostByMap(
            currPostData?.game ?? '',
            currPostData?.mapName ?? '',
         ).then((posts) => {
            let filter: PostType[] = posts
               .slice(0, 20)
               .map((post) => post.post!);
            setRelatedPosts(filter);
         });
      }
   }, [postData?.UserID || currPostData?.UserID]);

   return (
      <>
         <Header />

         {!isMobile && <SideNavWrapper />}

         <div className="lg:flex">
            <div className="md:ml-[70px] relative lg:w-3/4 bg-black pb-4">
               <div className="">
                  <div
                     style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%',
                        backgroundColor: 'black',
                        overflow: 'hidden',
                     }}
                     className="rounded-r-xl"
                     onMouseEnter={() =>
                        document
                           .getElementById('fullscreen-button')
                           ?.classList.remove('hidden')
                     }
                     onMouseLeave={() =>
                        document
                           .getElementById('fullscreen-button')
                           ?.classList.add('hidden')
                     }
                     onTouchStart={() => {
                        const fullscreenButton =
                           document.getElementById('fullscreen-button');
                        fullscreenButton?.classList.remove('hidden');
                        setTimeout(() => {
                           fullscreenButton?.classList.add('hidden');
                        }, 3000);
                     }}
                     onTouchEnd={() =>
                        document
                           .getElementById('fullscreen-button')
                           ?.classList.add('hidden')
                     }
                  >
                     <img
                        src={`${CDN_URL}/${imagePositions[currentImageIndex]}`}
                        alt={postData?.postTitle || currPostData?.postTitle}
                        style={{
                           position: 'absolute',
                           top: '50%',
                           left: '50%',
                           transform: 'translate(-50%, -50%)',
                           maxWidth: '100%',
                           maxHeight: '100%',
                           width: 'auto',
                           height: 'auto',
                        }}
                        className="cursor-pointer object-contain"
                     />
                     <button
                        id="fullscreen-button"
                        className="hidden absolute bottom-0 right-0 mb-2 mr-2 text-white p-2 rounded transform transition-transform duration-500 hover:scale-110"
                        onClick={() =>
                           handleFullScreenToggle(
                              imagePositions[currentImageIndex],
                           )
                        }
                     >
                        <CgMaximize size={24} />
                     </button>
                     <div
                        id="full-screen-container"
                        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 z-50 hidden flex justify-center items-center"
                     >
                        <div className="relative w-full h-full flex justify-center items-center">
                           <img
                              id="full-screen-image"
                              className="max-w-full max-h-full object-contain"
                              src=""
                              alt="Full-screen image"
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
                              <button
                                 onClick={() => handleFullScreenToggle('')}
                                 className="absolute top-0 right-0 m-4 text-2xl text-white"
                              >
                                 <CgMinimize size={24} />
                              </button>
                           </div>
                        </div>
                     </div>
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
               <div className="flex justify-between ml-2 mr-2">
                  <div className="flex">
                     <div className="flex">
                        <div>
                           <Link
                              to={`/user/${
                                 postData?.Username || currPostData?.Username
                              }`}
                           >
                              <img
                                 className="rounded-full cursor-pointer w-10 h-10"
                                 src={`${user?.ProfilePicture}`}
                              />
                           </Link>
                        </div>
                        <div className="flex flex-col ml-1">
                           <Link
                              to={`/user/${
                                 postData?.Username || currPostData?.Username
                              }`}
                           >
                              <p className="cursor-pointer font-bold">
                                 {postData?.Username || currPostData?.Username}
                              </p>
                           </Link>
                           <p className="text-sm text-gray-500">
                              {followerCount} followers
                           </p>
                        </div>
                     </div>
                     {Auth?.username && Auth?.username !== user?.username && (
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
                        <span>
                           <AiOutlineLike
                              className={`text-white h-5 w-5 cursor-pointer ${
                                 isLiked
                                    ? 'animate-pulse text-yellow-500'
                                    : 'fill-white'
                              }`}
                              onClick={() => {
                                 console.log(user_Id!);
                                 incrementLikeCount(
                                    postData?._id || currPostData?._id,
                                    user_Id!,
                                    postData?.game || currPostData?.game,
                                 );
                                 setIsLiked(true);
                                 setIsDisliked(false);
                              }}
                           />
                        </span>
                        <p className="mr-1">
                           {(postData?.likes?.length ?? 0) ||
                              (currPostData?.likes?.length ?? 0)}
                        </p>
                     </div>
                     <div className="flex">
                        <span>
                           <AiOutlineDislike
                              className={`text-white h-5 w-5 cursor-pointer ${
                                 isDisliked
                                    ? 'animate-pulse text-yellow-500'
                                    : ''
                              }`}
                              onClick={() => {
                                 incrementDislikeCount(
                                    postData?._id || currPostData?._id,
                                    user_Id!,
                                    postData?.game || currPostData?.game,
                                 );
                                 setIsDisliked(true);
                                 setIsLiked(false);
                              }}
                           />
                        </span>
                        <p className="mr-1">
                           {(postData?.dislikes?.length ?? 0) ||
                              (currPostData?.dislikes?.length ?? 0)}
                        </p>
                     </div>
                     <button
                        className={`flex mt-[-2px] ${
                           isSaved ? 'animate-pulse text-yellow-500' : ''
                        }`}
                        onClick={() => savePost()}
                     >
                        <AiOutlineStar className="text-2xl" />
                        <p>Save</p>
                     </button>
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
                     {Auth?.username && (
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
                     )}
                  </div>
                  {comments.map((comment, index) => (
                     <Comments
                        className="mt-4"
                        comment={comment}
                        postId={postData?._id || currPostData?._id}
                        onDelete={removeComment}
                        key={index}
                     />
                  ))}
               </div>
            </div>
            <div className="relative lg:flex-grow bg-black">
               {relatedPosts.map((post, index) => {
                  if (post._id !== (postData?._id || currPostData?._id)) {
                     return <WidePosts post={post} key={index} />;
                  }
               })}
            </div>
         </div>
         <Footer />
         <div style={{ paddingTop: '80px' }}>{isMobile && <BottomNav />}</div>
      </>
   );
};

export default PostPage;
