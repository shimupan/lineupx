import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { AuthContext } from '../../App';
import { CDN_URL, GAMES } from '../../Constants';
import { PostType } from '../../global.types';
import axios from 'axios';

const AdminPosts: React.FC = () => {
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const Auth = useContext(AuthContext);
   const navigate = useNavigate();
   useEffect(() => {
      if (Auth?.role) {
         const requests = GAMES.map((game) =>
            axios.get(`/post/${game}`).then((response) => response.data),
         );

         Promise.all(requests)
            .then((postsArr) => {
               setPosts(postsArr);
            })
            .catch((error) => {
               console.log(error);
            });
      }
   }, [Auth?.role]);

   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="ml-2 sm:ml-10 md:ml-20 font-extrabold text-xl sm:text-3xl md:text-4xl mb-4">
            Click on a Post to View More Information.
         </div>
         <div className="flex flex-col overflow-x-auto ml-2 sm:ml-10 md:ml-20">
            <div className="-mx-2 sm:-mx-6 lg:-mx-8">
               <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-x-auto">
                     <table className="min-w-full text-left text-xs sm:text-sm md:text-base font-light pl-2 sm:pl-16 md:pl-32">
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
                                                   navigate(
                                                      `/admin/post/${p.postTitle}`,
                                                      { state: p },
                                                   )
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

export default AdminPosts;
