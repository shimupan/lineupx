import React, { useContext, useEffect, useState } from 'react';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { AuthContext } from '../../App';
import { CDN_URL } from '../../Constants';
import { PostType } from '../../global.types';
import { approveRejectPosts } from '../../util/updatePost';
import axios from 'axios';
import {
   MdCancel,
   MdCheckCircle,
   MdExpandMore,
   MdExpandLess,
} from 'react-icons/md';

const AdminCheck: React.FC = () => {
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const [expandedPost, setExpandedPost] = useState<string | null>(null);
   const Auth = useContext(AuthContext);

   useEffect(() => {
      if (Auth?.role) {
         axios
            .post('/post/check', { role: Auth?.role })
            .then((response) => setPosts(response.data))
            .catch((error) => console.log(error));
      }
   }, [Auth?.role]);

   const togglePost = (id: string) => {
      setExpandedPost(expandedPost === id ? null : id);
   };

   const handlePostAction = async (
      id: string,
      game: string,
      action: 'approve' | 'reject',
   ) => {
      try {
         await approveRejectPosts(id, action, game, Auth?.role!);
         setPosts(
            posts.map((gamePost) => gamePost.filter((p) => p._id !== id)),
         );
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <Header />
         <div className="flex flex-col md:flex-row">
            <SideNavWrapper />
            <main className="flex-1 p-4 md:p-6 md:ml-32">
               <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                  Posts Pending Approval
               </h1>
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
                                 <h3 className="font-medium">{p.postTitle}</h3>
                                 <p className="text-sm text-gray-400">
                                    {p.game} - {p.mapName}
                                 </p>
                              </div>
                           </div>
                           {expandedPost === p._id ? (
                              <MdExpandLess size={24} />
                           ) : (
                              <MdExpandMore size={24} />
                           )}
                        </div>
                        {expandedPost === p._id && (
                           <div className="p-4 bg-gray-700">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                 <div>
                                    <h4 className="font-semibold mb-2">
                                       Post Details
                                    </h4>
                                    <p>Username: {p.Username}</p>
                                    <p>Map: {p.mapName}</p>
                                    <p>Team Side: {p.teamSide}</p>
                                    <p>
                                       Jump Throw: {p.jumpThrow ? 'Yes' : 'No'}
                                    </p>
                                    <p>
                                       Date: {new Date(p.date).toLocaleString()}
                                    </p>
                                    <p>Lineup Location: {p.lineupLocation}</p>
                                    <p>
                                       Lineup Description: {p.lineupDescription}
                                    </p>
                                 </div>
                                 <div>
                                    <h4 className="font-semibold mb-2">
                                       Game-Specific Details
                                    </h4>
                                    {p.game === 'CS2' ? (
                                       <p>Grenade Type: {p.grenadeType}</p>
                                    ) : (
                                       <>
                                          <p>
                                             Valorant Agent: {p.valorantAgent}
                                          </p>
                                          <p>Ability: {p.ability}</p>
                                       </>
                                    )}
                                 </div>
                              </div>
                              <div className="mb-4">
                                 <h4 className="font-semibold mb-2">
                                    Coordinates
                                 </h4>
                                 <p>
                                    Lineup Location: X:{' '}
                                    {p.lineupLocationCoords.x}, Y:{' '}
                                    {p.lineupLocationCoords.y}
                                 </p>
                                 <p>
                                    Lineup Position: X:{' '}
                                    {p.lineupPositionCoords.x}, Y:{' '}
                                    {p.lineupPositionCoords.y}
                                 </p>
                              </div>
                              <div className="flex flex-nowrap overflow-x-auto mb-4 space-x-4">
                                 {['landing', 'aiming', 'standing'].map(
                                    (pos) => (
                                       <div
                                          key={pos}
                                          className="h-48 w-96 bg-black rounded-lg flex-shrink-0 overflow-hidden"
                                          style={{
                                             display: 'flex',
                                             justifyContent: 'center',
                                             alignItems: 'center',
                                          }}
                                       >
                                          <img
                                             src={`${CDN_URL}/${
                                                (p as any)[`${pos}Position`]
                                                   .public_id
                                             }.png`}
                                             alt={`${pos} position`}
                                             className="max-h-full max-w-full object-contain"
                                          />
                                       </div>
                                    ),
                                 )}
                              </div>
                              <div className="flex justify-center space-x-4">
                                 <button
                                    onClick={() =>
                                       handlePostAction(
                                          p._id,
                                          p.game,
                                          'approve',
                                       )
                                    }
                                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                 >
                                    <MdCheckCircle size={20} />
                                    <span>Approve</span>
                                 </button>
                                 <button
                                    onClick={() =>
                                       handlePostAction(p._id, p.game, 'reject')
                                    }
                                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                 >
                                    <MdCancel size={20} />
                                    <span>Reject</span>
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </main>
         </div>
         <Footer />
      </div>
   );
};

export default AdminCheck;
