import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loading, ProfileEdit, DeletePopup, Layout } from '../../../Components';
import { getUserByUsername } from '../../../util/getUser';
import { GAMES, CDN_URL } from '../../../Constants';
import { AuthContext } from '../../../App';
import { UserType, PostType } from '../../../global.types';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import SearchBar from './SearchPost';
import {
   FaEye,
   FaTrash,
   FaEdit,
   FaThumbsUp,
   FaThumbsDown,
} from 'react-icons/fa';

const ManagePosts = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const [user, setUser] = useState<UserType>({
      role: '',
      _id: '',
      username: '',
      email: '',
      password: '',
      Verified: false,
      ProfilePicture: '',
      verificationCode: '',
      likes: [''],
      dislikes: [''],
      saved: [''],
      comments: [
         {
            text: '',
            createdAt: new Date(),
            post: '',
         },
      ],
      followers: [''],
      following: [''],
      resetPasswordToken: '',
      resetPasswordExpires: new Date(),
   });
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState<PostType[]>([]);
   const [open, setOpen] = useState(false);
   const [postname, setPostName] = useState('');
   const [deletePopup, setDeletePopup] = useState({
      isOpen: false,
      postId: '',
      game: '',
   });
   const Auth = useContext(AuthContext);

   const calculateLikePercentage = (likes: number, dislikes: number) => {
      const total = likes + dislikes;
      return total > 0 ? Math.round((likes / total) * 100) : 0;
   };

   useEffect(() => {
      // Fetch Users
      getUserByUsername(id!, Auth!.username)
         .then((response) => {
            setUser(response);
            // Fetch User Posts
            const postsPromises = GAMES.map((game) =>
               axios.get(`/post/${game}/${response._id}`),
            );
            return Promise.all(postsPromises);
         })
         .then((responses) => {
            const allPosts = responses.flatMap((response) => response.data);
            setPosts(allPosts);
         })
         .catch((error) => {
            toast.error('Error Fetching Data');
            return error;
         })
         .finally(() => {
            setLoading(false);
         });
   }, [id]);

   const filteredPosts = posts.filter((post) =>
      post.postTitle.toLowerCase().includes(postname.toLowerCase()),
   );

   const handleDeleteClick = (postId: string, game: string) => {
      setDeletePopup({ isOpen: true, postId, game });
   };

   const handleDeleteConfirm = async () => {
      const { postId, game } = deletePopup;
      try {
         const response = await axios.delete(`/post/${game}/${postId}`, {
            data: { role: Auth?.role },
         });

         if (response.status === 200) {
            toast.success('Post deleted successfully');
            setPosts(posts.filter((post) => post._id !== postId));
         } else {
            toast.error('Failed to delete post');
         }
      } catch (error) {
         console.error('Error deleting post:', error);
         toast.error('An error occurred while deleting the post');
      } finally {
         setDeletePopup({ isOpen: false, postId: '', game: '' });
      }
   };

   const handleDeleteCancel = () => {
      setDeletePopup({ isOpen: false, postId: '', game: '' });
   };

   const handleEdit = (post: PostType) => {
      navigate(`/edit-post/${post.game}/${Auth?.username}/${post._id}`, {
         state: { post },
      });
   };

   if (loading) return <Loading />;

   return (
      <>
         <Layout>
            {open && Auth?.username == user.username ? (
               <div className="h-screen">
                  <ProfileEdit user={user} setOpen={setOpen} />
               </div>
            ) : (
               <div className="min-h-screen pb-40 text-white">
                  <div className="w-full px-4 pt-20 md:pl-32">
                     <h1 className="text-2xl font-bold mb-6">Manage Posts</h1>
                     <SearchBar
                        onSearch={(query) => console.log(query)}
                        game="someGame"
                        placeholder="Search posts..."
                        className=""
                        onChange={(e) => setPostName(e.target.value)}
                        suggestions={[]}
                        post={posts}
                        searchTerm={postname}
                     />
                     <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                        <div className="p-4 border-b border-gray-700 flex flex-wrap items-center text-gray-400 font-medium">
                           <div className="w-full sm:w-2/5">Post</div>
                           <div className="w-full sm:w-1/5 text-center">
                              Date
                           </div>
                           <div className="w-full sm:w-1/5 text-center">
                              Views
                           </div>
                           <div className="w-full sm:w-1/5 text-center">
                              Likes vs. Dislikes
                           </div>
                           <div className="w-full sm:w-1/5 text-center">
                              Actions
                           </div>
                        </div>
                        {filteredPosts.map((post) => {
                           const likePercentage = calculateLikePercentage(
                              post.likes?.length || 0,
                              post.dislikes?.length || 0,
                           );

                           return (
                              <div
                                 key={post._id}
                                 className="p-4 border-b border-gray-700 flex flex-wrap items-center hover:bg-gray-700"
                              >
                                 <div className="w-full sm:w-2/5 flex items-center mb-4 sm:mb-0">
                                    <img
                                       src={`${CDN_URL}/${post.landingPosition.public_id}.png`}
                                       alt="Thumbnail"
                                       className="w-20 h-12 object-cover rounded mr-4"
                                    />
                                    <div>
                                       <h3 className="text-lg font-bold m-0 no-underline w-full sm:w-[25rem] line-clamp-2">
                                          {post.postTitle}
                                       </h3>
                                       <p className="text-sm text-gray-400">
                                          {post.game}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="w-full sm:w-1/5 text-center text-sm text-gray-400 mb-2 sm:mb-0">
                                    {new Date(post.date).toLocaleDateString()}
                                 </div>
                                 <div className="w-full sm:w-1/5 text-center text-sm text-gray-400 mb-2 sm:mb-0">
                                    <FaEye className="inline mr-1" />{' '}
                                    {post.views || 0}
                                 </div>
                                 <div className="w-full sm:w-1/5 text-center text-sm text-gray-400 mb-2 sm:mb-0">
                                    <div className="flex items-center justify-center">
                                       <FaThumbsUp className="text-green-500 mr-1" />
                                       <span className="mr-2">
                                          {likePercentage}%
                                       </span>
                                       <FaThumbsDown className="text-red-500 mr-1" />
                                       <span>
                                          {post.dislikes.length !== 0
                                             ? `${100 - likePercentage}%`
                                             : '0%'}
                                       </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                       <div
                                          className="bg-green-600 h-2.5 rounded-full"
                                          style={{
                                             width: `${likePercentage}%`,
                                          }}
                                       ></div>
                                    </div>
                                 </div>
                                 <div className="w-full sm:w-1/5 text-center">
                                    <button
                                       onClick={() => handleEdit(post)}
                                       className="text-yellow-400 hover:text-yellow-300 mr-3"
                                       title="Edit"
                                    >
                                       <FaEdit />
                                    </button>
                                    <button
                                       onClick={() =>
                                          handleDeleteClick(post._id, post.game)
                                       }
                                       className="text-red-400 hover:text-red-300"
                                       title="Delete"
                                    >
                                       <FaTrash />
                                    </button>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>
            )}
         </Layout>
         <ToastContainer position="top-center" />

         <DeletePopup
            isOpen={deletePopup.isOpen}
            onClose={handleDeleteCancel}
            title="Confirm Deletion"
         >
            <p className="text-gray-300 mb-4">
               Are you sure you want to delete this post? This action cannot be
               undone.
            </p>
            <div className="flex justify-end space-x-4">
               <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
               >
                  Cancel
               </button>
               <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
               >
                  Delete
               </button>
            </div>
         </DeletePopup>
      </>
   );
};

export default ManagePosts;
