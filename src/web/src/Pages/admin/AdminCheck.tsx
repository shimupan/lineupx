import React, { useContext, useEffect, useState } from 'react';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { AuthContext } from '../../App';
import { CDN_URL } from '../../Constants';
import { PostType } from '../../global.types';
import { approveRejectPosts } from '../../util/updatePost';
import axios from 'axios';

import { MdCancel, MdCheckCircle } from 'react-icons/md';

export function expandPost(id: string) {
   const element = document.getElementById(id);
   if (element?.classList.contains('hidden')) {
      element?.classList.remove('hidden');
   } else {
      element?.classList.add('hidden');
   }
}

const AdminCheck: React.FC = () => {
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const Auth = useContext(AuthContext);
   useEffect(() => {
      if (Auth?.role) {
         axios
            .post('/post/check', {
               role: Auth?.role,
            })
            .then((response) => {
               setPosts(response.data);
            })
            .catch((error) => {
               console.log(error);
            });
      }
   }, [Auth?.role]);

   function acceptPost(id: string, game: string) {
      try {
         approveRejectPosts(id, 'approve', game, Auth?.role!);
         window.location.reload();
      } catch (error) {
         console.log(error);
      }
   }

   function rejectPost(id: string, game: string) {
      try {
         approveRejectPosts(id, 'reject', game, Auth?.role!);
         window.location.reload();
      } catch (error) {
         console.log(error);
      }
   }

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="mt-8 mb-6 ml-2 sm:ml-10 md:ml-20 text-2xl sm:text-4xl md:text-5xl font-bold text-white">
            Click on a Post to expand and view the images.
         </div>
         <div className="mx-2 sm:mx-10 md:mx-20 overflow-x-auto">
            <table className="w-full table-auto border-collapse text-white">
               <thead className="bg-gray-700">
                  <tr>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        #
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Game
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Title
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        UserID
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Landing Position
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Aiming Position
                     </th>
                     <th className="px-4 py-3 text-left text-sm sm:text-base md:text-lg font-medium">
                        Standing Position
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {posts.map((post, index) => {
                     return (
                        <React.Fragment key={index}>
                           {post.map((p, index) => {
                              return (
                                 <React.Fragment key={p._id}>
                                    <tr
                                       className="border-b border-gray-600 transition duration-300 ease-in-out hover:bg-gray-600 cursor-pointer"
                                       onClick={() => expandPost(p._id)}
                                    >
                                       <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                                          {index}
                                       </td>
                                       <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                                          {p.game}
                                       </td>
                                       <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                                          {p.postTitle}
                                       </td>
                                       <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                                          {p.UserID}
                                       </td>
                                       <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                                          <img
                                             src={`${CDN_URL}/${p.landingPosition.public_id}.png`}
                                             height={50}
                                             width={25}
                                             className="w-10"
                                          />
                                       </td>
                                       <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                                          <img
                                             src={`${CDN_URL}/${p.aimingPosition.public_id}.png`}
                                             height={50}
                                             width={25}
                                             className="w-10"
                                          />
                                       </td>
                                       <td className="px-4 py-3 text-sm sm:text-base md:text-lg font-medium">
                                          <img
                                             src={`${CDN_URL}/${p.standingPosition.public_id}.png`}
                                             height={50}
                                             width={25}
                                             className="w-10"
                                          />
                                       </td>
                                    </tr>
                                    <tr id={p._id} className="hidden">
                                       <td colSpan={7}>
                                          <div className="flex mb-4 mt-4">
                                             <img
                                                src={`${CDN_URL}/${p.landingPosition.public_id}`}
                                                className="w-128 h-64 object-contain"
                                             />
                                             <img
                                                src={`${CDN_URL}/${p.aimingPosition.public_id}`}
                                                className="ml-4 mr-4 w-128 h-64 object-contain"
                                             />
                                             <img
                                                src={`${CDN_URL}/${p.standingPosition.public_id}`}
                                                className="w-128 h-64 object-contain"
                                             />
                                             <div className="flex flex-col m-4 items-center">
                                                <MdCheckCircle
                                                   className="text-green-500 text-4xl cursor-pointer"
                                                   onClick={() =>
                                                      acceptPost(p._id, p.game)
                                                   }
                                                   size={100}
                                                />
                                                approve
                                                <MdCancel
                                                   className="text-red-500 text-4xl cursor-pointer"
                                                   onClick={() =>
                                                      rejectPost(p._id, p.game)
                                                   }
                                                   size={100}
                                                />
                                                reject
                                             </div>
                                          </div>
                                       </td>
                                    </tr>
                                 </React.Fragment>
                              );
                           })}
                        </React.Fragment>
                     );
                  })}
               </tbody>
            </table>
         </div>

         <Footer />
      </>
   );
};

export default AdminCheck;
