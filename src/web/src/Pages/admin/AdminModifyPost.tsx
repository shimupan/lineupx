import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { PostType } from '../../global.types';
import { Layout } from '../../Components';
import { CDN_URL } from '../../Constants';
import { AuthContext } from '../../App';
import { approveRejectPosts } from '../../util/updatePost';
import { MdCancel, MdReport, MdEdit } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';

type PositionKey = 'landingPosition' | 'aimingPosition' | 'standingPosition';

const AdminModifyPost = () => {
   const [post, setPost] = useState<PostType>();
   const Auth = useContext(AuthContext);
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      setPost(location.state as PostType);
   }, [location.state]);

   const handlePostAction = async (action: 'approve' | 'reject') => {
      if (post && Auth?.role) {
         try {
            await approveRejectPosts(post._id, action, post.game, Auth.role);
            navigate(-1);
         } catch (error) {
            console.error(`Error ${action}ing post:`, error);
         }
      }
   };

   const getPositionImage = (position: PositionKey) => {
      return post ? `${CDN_URL}/${post[position].public_id}.png` : '';
   };

   const handleEdit = (post: PostType) => {
      navigate(`/edit-post/${post.game}/${Auth?.username}/${post._id}`, {
         state: { post },
      });
   };

   return (
      <Layout>
         <div className="min-h-screen bg-gray-900 text-white">
            <div className="flex">
               <main className="flex-1 p-4 md:p-6 md:ml-32">
                  <button
                     className="flex items-center mb-6 text-blue-400 hover:text-blue-300"
                     onClick={() => navigate(-1)}
                  >
                     <IoIosArrowBack size={24} />
                     <span className="ml-2">Back</span>
                  </button>
                  <h1 className="text-2xl md:text-3xl font-bold mb-6 w-full sm:w-[75rem] line-clamp-2">
                     {post?.postTitle}
                  </h1>

                  <div className="flex flex-wrap justify-center gap-4 mb-4">
                     {['landing', 'aiming', 'standing'].map((pos) => (
                        <div
                           key={pos}
                           className="w-full md:w-96 h-54 bg-black rounded-lg overflow-hidden"
                           style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              aspectRatio: '16 / 9',
                           }}
                        >
                           <img
                              src={getPositionImage(
                                 `${pos}Position` as PositionKey,
                              )}
                              alt={`${pos} position`}
                              className="w-full h-full object-contain"
                           />
                        </div>
                     ))}
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 mb-8">
                     <h2 className="text-xl font-semibold mb-4">
                        Post Details
                     </h2>
                     <p>
                        <strong>Game:</strong> {post?.game}
                     </p>
                     <p>
                        <strong>User ID:</strong> {post?.UserID}
                     </p>
                     <p>
                        <strong>Username:</strong> {post?.Username}
                     </p>
                     <p>
                        <strong>Likes:</strong> {post?.likes.length}
                     </p>
                     <p>
                        <strong>Dislikes:</strong> {post?.dislikes.length}
                     </p>
                     <p>
                        <strong>
                           {post?.game === 'CS2' ? 'Grenade Type' : 'Ability'}:
                        </strong>{' '}
                        {post?.game === 'CS2'
                           ? post?.grenadeType
                           : post?.ability}
                     </p>
                     {post?.game === 'Valorant' && (
                        <p>
                           <strong>Agent:</strong> {post?.valorantAgent}
                        </p>
                     )}
                     <p>
                        <strong>Lineup Description:</strong>{' '}
                        <ReactMarkdown>{post?.lineupDescription}</ReactMarkdown>
                     </p>
                     <p>
                        <strong>Lineup Location:</strong> {post?.lineupLocation}
                     </p>
                     <p>
                        <strong>Map:</strong> {post?.mapName}
                     </p>
                     <p>
                        <strong>Team Side:</strong> {post?.teamSide}
                     </p>

                     <p>
                        <strong>Created At:</strong>{' '}
                        {post?.date
                           ? new Date(post.date).toLocaleString()
                           : 'N/A'}
                     </p>
                     <p>
                        <strong>Views:</strong> {post?.views}
                     </p>
                  </div>

                  {post?.reports && post.reports.length > 0 && (
                     <div className="bg-gray-800 rounded-lg p-4 mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                           <MdReport className="mr-2" />
                           Reports ({post.reports.length})
                        </h2>
                        <div className="space-y-4">
                           {post.reports.map((report, index) => (
                              <div
                                 key={index}
                                 className="bg-gray-700 rounded-lg p-3"
                              >
                                 <p>
                                    <strong>User ID:</strong> {report.userId}
                                 </p>
                                 <p>
                                    <strong>Reason:</strong> {report.reason}
                                 </p>
                                 <p>
                                    <strong>Reported At:</strong>{' '}
                                    {new Date(
                                       report.createdAt,
                                    ).toLocaleString()}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  <div className="flex justify-center space-x-8">
                     <button
                        onClick={() => handlePostAction('reject')}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                     >
                        <MdCancel size={24} />
                        <span>Delete Post</span>
                     </button>
                     {post && (
                        <button
                           onClick={() => handleEdit(post)}
                           className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                           <MdEdit size={24} />
                           <span>Edit Post</span>
                        </button>
                     )}
                  </div>
               </main>
            </div>
         </div>
      </Layout>
   );
};

export default AdminModifyPost;
