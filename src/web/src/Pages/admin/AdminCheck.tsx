import React, { useContext, useEffect, useState } from 'react';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { AuthContext } from '../../App';
import { CDN_URL } from '../../Constants';
import { PostType } from '../../db.types';
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
               console.log(response.data);
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
         <div className="ml-20 font-extrabold text-4xl">
            Click on a Post to Expand and View the Images.
         </div>
         <div className="flex flex-col overflow-x-auto ml-20">
            <div className="sm:-mx-6 lg:-mx-8">
               <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-x-auto">
                     <table className="min-w-full text-left text-sm font-light pl-32">
                        <thead className="border-b font-medium dark:border-neutral-500">
                           <tr>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dark:border-neutral-500"
                              >
                                 #
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dark:border-neutral-500"
                              >
                                 Game
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dark:border-neutral-500"
                              >
                                 Title
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dark:border-neutral-500"
                              >
                                 UserID
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dark:border-neutral-500"
                              >
                                 Landing Position
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dark:border-neutral-500"
                              >
                                 Aiming Position
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dark:border-neutral-500"
                              >
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
                                                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600 cursor-pointer"
                                                onClick={() =>
                                                   expandPost(p._id)
                                                }
                                             >
                                                <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                   {index}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                   {p.game}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                   {p.postTitle}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                   {p.UserID}
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                   <img
                                                      src={`${CDN_URL}/${p.landingPosition.public_id}.png`}
                                                      height={50}
                                                      width={25}
                                                      className="w-10"
                                                   />
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                   <img
                                                      src={`${CDN_URL}/${p.aimingPosition.public_id}.png`}
                                                      height={50}
                                                      width={25}
                                                      className="w-10"
                                                   />
                                                </td>
                                                <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                   <img
                                                      src={`${CDN_URL}/${p.standingPosition.public_id}.png`}
                                                      height={50}
                                                      width={25}
                                                      className="w-10"
                                                   />
                                                </td>
                                             </tr>
                                             <tr id={p._id} className="hidden">
                                                <td>
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
                                                               acceptPost(
                                                                  p._id,
                                                                  p.game,
                                                               )
                                                            }
                                                            size={100}
                                                         />
                                                         approve
                                                         <MdCancel
                                                            className="text-red-500 text-4xl cursor-pointer"
                                                            onClick={() =>
                                                               rejectPost(
                                                                  p._id,
                                                                  p.game,
                                                               )
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
               </div>
            </div>
         </div>

         <Footer />
      </>
   );
};

export default AdminCheck;
