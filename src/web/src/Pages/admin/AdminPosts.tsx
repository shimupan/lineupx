import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../Components';
import { AuthContext } from '../../App';
import { CDN_URL, GAMES } from '../../Constants';
import { PostType } from '../../global.types';
import axios from 'axios';
import { FaEye, FaFlag, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AdminPosts: React.FC = () => {
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const [loading, setLoading] = useState(true);
   const [expandedPost, setExpandedPost] = useState<string | null>(null);
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(() => {
      if (Auth?.role) {
         setLoading(true);
         const requests = GAMES.map((game) =>
            axios.get(`/post/${game}`, {
               params: { page: 1, limit: 1000 },
            }),
         );

         Promise.all(requests)
            .then((responses) => {
               setPosts(responses.map((response) => response.data));
               setLoading(false);
            })
            .catch((error) => {
               console.error('Error fetching posts:', error);
               setLoading(false);
            });
      }
   }, [Auth?.role]);

   const togglePost = (postId: string) => {
      setExpandedPost(expandedPost === postId ? null : postId);
   };

   return (
      <Layout>
         <div className="min-h-screen bg-gray-900 text-white">
            <div className="flex flex-col md:flex-row">
               <main className="flex-1 p-2 md:p-6 md:ml-32">
                  <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 pl-2">
                     Admin Posts
                  </h1>
                  {loading ? (
                     <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                     </div>
                  ) : (
                     <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        {posts.flat().map((p) => (
                           <div
                              key={p._id}
                              className="border-b border-gray-700 last:border-b-0"
                           >
                              <div
                                 className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700"
                                 onClick={() => togglePost(p._id)}
                              >
                                 <div className="flex items-center space-x-4">
                                    <img
                                       src={`${CDN_URL}/${p.landingPosition.public_id}.png`}
                                       alt="Landing Position"
                                       className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                       <h3 className="font-medium">
                                          Post Title: {p.postTitle}
                                       </h3>
                                       <p className="text-sm text-gray-400">
                                          Game: {p.game}
                                       </p>
                                       <p className="text-sm text-gray-400">
                                          Date Uploaded:{' '}
                                          {new Date(p.date).toLocaleDateString(
                                             'en-US',
                                             {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                             },
                                          )}
                                       </p>
                                       <p className="text-sm text-gray-400">
                                          By: {p.Username}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-4">
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(
                                             `/admin/post/${p._id}`,
                                             {
                                                state: p,
                                             },
                                          );
                                       }}
                                       className="text-blue-400 hover:text-blue-300"
                                    >
                                       <FaEye className="inline mr-1" /> View
                                    </button>
                                    <button
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          togglePost(p._id);
                                       }}
                                       className="text-red-400 hover:text-red-300"
                                    >
                                       <FaFlag className="inline mr-1" />{' '}
                                       Reports ({p.reports.length})
                                    </button>
                                    {expandedPost === p._id ? (
                                       <FaChevronUp />
                                    ) : (
                                       <FaChevronDown />
                                    )}
                                 </div>
                              </div>
                              {expandedPost === p._id && (
                                 <div className="p-4 bg-gray-700">
                                    <div className="flex flex-wrap justify-center gap-4 mb-4">
                                       {['landing', 'aiming', 'standing'].map(
                                          (pos) => (
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
                                                   src={`${CDN_URL}/${
                                                      (p as any)[
                                                         `${pos}Position`
                                                      ].public_id
                                                   }.png`}
                                                   alt={`${pos} position`}
                                                   className="max-w-full max-h-full object-contain"
                                                />
                                             </div>
                                          ),
                                       )}
                                    </div>
                                    <div className="mt-4">
                                       <h4 className="text-lg font-semibold mb-2 text-white">
                                          Reports
                                       </h4>
                                       {p.reports.map((report, index) => (
                                          <div
                                             key={index}
                                             className="mb-4 p-3 bg-gray-600 rounded shadow"
                                          >
                                             <p className="text-sm text-gray-300">
                                                User ID: {report.userId}
                                             </p>
                                             <p className="text-sm text-gray-300">
                                                Reason: {report.reason}
                                             </p>
                                             <p className="text-sm text-gray-300">
                                                Reported At:{' '}
                                                {new Date(
                                                   report.createdAt,
                                                ).toLocaleString()}
                                             </p>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </main>
            </div>
         </div>
      </Layout>
   );
};

export default AdminPosts;
