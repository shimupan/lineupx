import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PostType } from '../../../global.types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout, Dropzone, LoadingSpinner } from '../../../Components';
import { CDN_URL } from '../../../Constants';
import {
   FaEye,
   FaThumbsUp,
   FaThumbsDown,
   FaComment,
   FaArrowLeft,
   FaArrowRight,
} from 'react-icons/fa';
import { AuthContext } from '../../../App';

const EditPost: React.FC = () => {
   const { postId, game } = useParams();
   const Auth = useContext(AuthContext);
   const location = useLocation();
   const [post, setPost] = useState<PostType | null>(
      location.state?.post || null,
   );
   const [loading, setLoading] = useState(!location.state?.post);
   const [standingPosition, setStandingPosition] = useState<string>('');
   const [aimingPosition, setAimingPosition] = useState<string>('');
   const [landingPosition, setLandingPosition] = useState<string>('');
   const [standingPreview, setStandingPreview] = useState<string | null>(null);
   const [aimingPreview, setAimingPreview] = useState<string | null>(null);
   const [landingPreview, setLandingPreview] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [previewMode, setPreviewMode] = useState<'grid' | 'arrow'>('grid');
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
   const [titleCharCount, setTitleCharCount] = useState(0);

   useEffect(() => {
      if (!post) {
         const fetchPost = async () => {
            try {
               const response = await axios.get(
                  `/post/detail/${game}/${postId}`,
               );
               setPost(response.data);
               setTitleCharCount(response.data.postTitle.length);
            } catch (error) {
               toast.error('Error fetching post data');
               console.error('Error fetching post:', error);
            } finally {
               setLoading(false);
            }
         };

         fetchPost();
      } else {
         setTitleCharCount(post.postTitle.length);
      }
   }, [postId, post]);

   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value.slice(0, 100);
      setPost({ ...post, postTitle: newTitle } as PostType);
      setTitleCharCount(newTitle.length);
   };

   const handleSubmit = async (event: React.FormEvent) => {
      setIsLoading(true);
      event.preventDefault();
      try {
         await axios.put(`/post/${postId}`, {
            game: post?.game,
            userId: post?.UserID,
            postTitle: post?.postTitle,
            lineupDescription: post?.lineupDescription,
            role: Auth?.role,
            jumpThrow: post?.jumpThrow,
            teamSide: post?.teamSide,
            aimingPosition: aimingPosition,
            standingPosition: standingPosition,
            landingPosition: landingPosition,
         });
         toast.success('Post updated successfully');
      } catch (error) {
         toast.error('Failed to update post');
         console.error('Error updating post:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleArrowClick = (direction: 'prev' | 'next') => {
      const imagePositions = ['landing', 'standing', 'aiming'];
      let newIndex = currentImageIndex;

      if (direction === 'prev') {
         newIndex =
            currentImageIndex > 0
               ? currentImageIndex - 1
               : imagePositions?.length - 1;
      } else if (direction === 'next') {
         newIndex =
            currentImageIndex < imagePositions?.length - 1
               ? currentImageIndex + 1
               : 0;
      }

      setCurrentImageIndex(newIndex);
   };

   const resetEditableFields = (currentPost: PostType): Partial<PostType> => ({
      postTitle: '',
      lineupDescription: '',
      jumpThrow: false,
      teamSide: currentPost.game === 'Valorant' ? 'Attacker' : 'CT',
   });

   const clearForm = () => {
      if (
         window.confirm(
            'Are you sure you want to reset the form? All unsaved changes will be lost.',
         )
      ) {
         if (post) {
            setPost({
               ...post,
               ...resetEditableFields(post),
            });
            setStandingPosition('');
            setAimingPosition('');
            setLandingPosition('');
            setStandingPreview(null);
            setAimingPreview(null);
            setLandingPreview(null);
         }
      } else {
         toast.info('Form reset cancelled');
      }
   };

   if (loading) return <div>Loading...</div>;
   if (!post) return <div>Post not found</div>;

   return (
      <>
         <Layout>
            <div className="min-h-screen text-white md:p-6 md:ml-32">
               <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
               <div className="flex flex-col md:flex-row gap-8">
                  {/* Left side - Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                     <div>
                        <div className="float-right">
                           <button
                              type="button"
                              onClick={clearForm}
                              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                           >
                              Reset Fields
                           </button>
                        </div>
                        <div className="clear-both"></div>
                        <label htmlFor="postTitle" className="block mb-2">
                           Title
                        </label>
                        <input
                           type="text"
                           id="postTitle"
                           value={post.postTitle}
                           onChange={handleTitleChange}
                           className="w-full bg-gray-800 rounded p-2"
                           maxLength={100}
                        />
                        <div className="text-sm text-gray-400 mt-1">
                           {titleCharCount}/100 characters
                           {titleCharCount === 100 && (
                              <span className="text-yellow-500 ml-2">
                                 Character limit reached
                              </span>
                           )}
                        </div>
                     </div>
                     <div>
                        <label htmlFor="description" className="block mb-2">
                           Description
                        </label>
                        <textarea
                           id="description"
                           value={post.lineupDescription}
                           onChange={(e) =>
                              setPost({
                                 ...post,
                                 lineupDescription: e.target.value,
                              })
                           }
                           className="w-full bg-gray-800 rounded p-2 h-32"
                        />
                     </div>
                     <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                           <label
                              htmlFor="jumpThrow"
                              className="block mb-2 text-sm font-medium text-gray-300"
                           >
                              Is the Lineup A Jump Throw?
                           </label>
                           <select
                              id="jumpThrow"
                              value={post.jumpThrow.toString()}
                              onChange={(e) =>
                                 setPost({
                                    ...post,
                                    jumpThrow: e.target.value === 'true',
                                 })
                              }
                              className="w-full bg-gray-800 text-white rounded p-2"
                           >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                           </select>
                        </div>
                        <div className="flex-1">
                           <label
                              htmlFor="teamSide"
                              className="block mb-2 text-sm font-medium text-gray-300"
                           >
                              Teamside
                           </label>
                           <select
                              id="teamSide"
                              value={post.teamSide}
                              onChange={(e) =>
                                 setPost({
                                    ...post,
                                    teamSide: e.target.value,
                                 } as PostType)
                              }
                              className="w-full bg-gray-800 text-white rounded p-2"
                           >
                              {post.game === 'Valorant' ? (
                                 <>
                                    <option value="Attacker">Attacker</option>
                                    <option value="Defender">Defender</option>
                                 </>
                              ) : post.game === 'CS2' ? (
                                 <>
                                    <option value="CT">CT</option>
                                    <option value="T">T</option>
                                 </>
                              ) : null}
                           </select>
                        </div>
                     </div>

                     {/* Dropzone for each image position */}
                     <div className="flex flex-col md:flex-row md:space-x-4">
                        {['Landing', 'Standing', 'Aiming'].map((position) => (
                           <div key={position} className="flex-1 mb-4 md:mb-0">
                              <label className="block mb-2 text-sm font-medium text-gray-300">
                                 {position} Position
                              </label>
                              <Dropzone
                                 setFile={(file, preview) => {
                                    switch (position) {
                                       case 'Landing':
                                          setLandingPosition(file);
                                          setLandingPreview(preview);
                                          break;
                                       case 'Standing':
                                          setStandingPosition(file);
                                          setStandingPreview(preview);
                                          break;
                                       case 'Aiming':
                                          setAimingPosition(file);
                                          setAimingPreview(preview);
                                          break;
                                    }
                                 }}
                              />
                           </div>
                        ))}
                     </div>

                     <div className="flex justify-center items-center">
                        <button
                           type="submit"
                           className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                           disabled={isLoading}
                        >
                           Update Post
                        </button>
                        {isLoading && (
                           <LoadingSpinner
                              size={30}
                              color="#3498db"
                              secondaryColor="#f3f3f3"
                              speed={1}
                           />
                        )}
                     </div>
                  </form>

                  {/* Right side - Preview */}
                  <div className="flex-1">
                     <h2 className="text-xl font-bold mb-4">Preview</h2>
                     <div className="mb-4">
                        <label className="inline-flex items-center cursor-pointer">
                           <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={previewMode === 'arrow'}
                              onChange={() =>
                                 setPreviewMode(
                                    previewMode === 'grid' ? 'arrow' : 'grid',
                                 )
                              }
                           />
                           <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                           <span className="ml-3 text-sm font-medium text-white dark:text-gray-300">
                              {previewMode === 'grid'
                                 ? 'Grid View'
                                 : 'Arrow View'}
                           </span>
                        </label>
                     </div>
                     <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        {previewMode === 'grid' ? (
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                              {(['landing', 'standing', 'aiming'] as const).map(
                                 (pos) => (
                                    <div
                                       key={pos}
                                       className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden"
                                       style={{
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          aspectRatio: '16 / 9',
                                       }}
                                    >
                                       <img
                                          src={
                                             pos === 'standing' &&
                                             standingPreview
                                                ? standingPreview
                                                : pos === 'aiming' &&
                                                    aimingPreview
                                                  ? aimingPreview
                                                  : pos === 'landing' &&
                                                      landingPreview
                                                    ? landingPreview
                                                    : post[`${pos}Position`]
                                                           ?.public_id
                                                      ? `${CDN_URL}/${post[`${pos}Position`].public_id}.png`
                                                      : ''
                                          }
                                          alt={`${pos} position`}
                                          className="object-contain w-full h-full"
                                       />
                                    </div>
                                 ),
                              )}
                           </div>
                        ) : (
                           <div
                              className="relative bg-black"
                              style={{
                                 display: 'flex',
                                 justifyContent: 'center',
                                 alignItems: 'center',
                                 aspectRatio: '16 / 9',
                              }}
                           >
                              <img
                                 src={
                                    (
                                       [
                                          'landing',
                                          'standing',
                                          'aiming',
                                       ] as const
                                    )[currentImageIndex] === 'standing' &&
                                    standingPreview
                                       ? standingPreview
                                       : (
                                              [
                                                 'landing',
                                                 'standing',
                                                 'aiming',
                                              ] as const
                                           )[currentImageIndex] === 'aiming' &&
                                           aimingPreview
                                         ? aimingPreview
                                         : (
                                                [
                                                   'landing',
                                                   'standing',
                                                   'aiming',
                                                ] as const
                                             )[currentImageIndex] ===
                                                'landing' && landingPreview
                                           ? landingPreview
                                           : post[
                                                  `${
                                                     (
                                                        [
                                                           'landing',
                                                           'standing',
                                                           'aiming',
                                                        ] as const
                                                     )[currentImageIndex]
                                                  }Position`
                                               ]?.public_id
                                             ? `${CDN_URL}/${
                                                  post[
                                                     `${
                                                        (
                                                           [
                                                              'landing',
                                                              'standing',
                                                              'aiming',
                                                           ] as const
                                                        )[currentImageIndex]
                                                     }Position`
                                                  ].public_id
                                               }.png`
                                             : ''
                                 }
                                 alt={`${
                                    (
                                       [
                                          'landing',
                                          'standing',
                                          'aiming',
                                       ] as const
                                    )[currentImageIndex]
                                 } position`}
                                 className="object-contain w-full h-full"
                              />
                              <button
                                 onClick={() => handleArrowClick('prev')}
                                 className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-r"
                              >
                                 <FaArrowLeft />
                              </button>
                              <button
                                 onClick={() => handleArrowClick('next')}
                                 className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-l"
                              >
                                 <FaArrowRight />
                              </button>
                           </div>
                        )}
                        <div className="p-4 max-h-60 overflow-y-auto w-[40rem] h-32">
                           <h3 className="text-lg font-semibold mb-2 break-words truncate">
                              {post.postTitle}
                           </h3>
                           <p className="text-gray-400 mb-2 break-words">
                              {post.lineupDescription}
                           </p>
                           <div className="flex items-center text-sm text-gray-500 mb-2">
                              <FaEye className="mr-1" /> {post.views || 0}
                              <FaThumbsUp className="ml-4 mr-1" />{' '}
                              {post.likes?.length || 0}
                              <FaThumbsDown className="ml-4 mr-1" />{' '}
                              {post.dislikes?.length || 0}
                              <FaComment className="ml-4 mr-1" />{' '}
                              {post.comments?.length || 0}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <ToastContainer position="top-center" />
            </div>
         </Layout>
      </>
   );
};

export default EditPost;
