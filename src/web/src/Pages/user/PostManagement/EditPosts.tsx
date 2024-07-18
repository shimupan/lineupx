import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PostType } from '../../../global.types';
import { toast } from 'react-toastify';
import { Header, Footer } from '../../../Components';
import { CDN_URL } from '../../../Constants';
import { FaEye, FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
import { AuthContext } from '../../../App';

const EditPost: React.FC = () => {
   const { postId } = useParams<{ postId: string }>();
   const Auth = useContext(AuthContext);
   const location = useLocation();
   const [post, setPost] = useState<PostType | null>(
      location.state?.post || null,
   );
   const [loading, setLoading] = useState(!location.state?.post);

   useEffect(() => {
      if (!post) {
         const fetchPost = async () => {
            try {
               const response = await axios.get(`/post/${postId}`);
               setPost(response.data);
            } catch (error) {
               toast.error('Error fetching post data');
               console.error('Error fetching post:', error);
            } finally {
               setLoading(false);
            }
         };

         fetchPost();
      }
   }, [postId, post]);

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      try {
         await axios.put(`/post/${postId}`, {
            game: post?.game,
            userId: post?.UserID,
            postTitle: post?.postTitle,
            lineupDescription: post?.lineupDescription,
            role: Auth?.role,
         });
         toast.success('Post updated successfully');
      } catch (error) {
         toast.error('Failed to update post');
         console.error('Error updating post:', error);
      }
   };

   if (loading) return <div>Loading...</div>;
   if (!post) return <div>Post not found</div>;

   return (
      <>
         <Header />
         <div className="min-h-screen text-white p-8">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            <div className="flex flex-col md:flex-row gap-8">
               {/* Left side - Form */}
               <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                  <div>
                     <label htmlFor="postTitle" className="block mb-2">
                        Title
                     </label>
                     <input
                        type="text"
                        id="postTitle"
                        value={post.postTitle}
                        onChange={(e) =>
                           setPost({ ...post, postTitle: e.target.value })
                        }
                        className="w-full bg-gray-800 rounded p-2"
                     />
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
                  <button
                     type="submit"
                     className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                  >
                     Update Post
                  </button>
               </form>

               {/* Right side - Preview */}
               <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Preview</h2>
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4">
                        {(['landing', 'standing', 'aiming'] as const).map(
                           (pos) => (
                              <div
                                 key={pos}
                                 className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden"
                              >
                                 <div className="flex items-center justify-center w-full h-full">
                                    <img
                                       src={`${CDN_URL}/${
                                          post[`${pos}Position`]?.public_id
                                       }.png`}
                                       alt={`${pos} position`}
                                       className="max-w-full max-h-full object-contain"
                                    />
                                 </div>
                              </div>
                           ),
                        )}
                     </div>
                     <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                           {post.postTitle}
                        </h3>
                        <p className="text-gray-400 mb-2">
                           {post.lineupDescription}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                           <FaEye className="mr-1" /> {post.views || 0}
                           <FaThumbsUp className="ml-4 mr-1" />{' '}
                           {post.likes?.length || 0}
                           <FaThumbsDown className="ml-4 mr-1" />{' '}
                           {post.dislikes?.length || 0}
                           <FaComment className="ml-4 mr-1" />{' '}
                           {post.comments.length || 0}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default EditPost;
