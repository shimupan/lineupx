import { useContext, useEffect, useRef, useState } from 'react';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { AuthContext } from '../../App';
import { CDN_URL } from '../../Constants';
import { PostType } from '../../db.types';
import axios from 'axios';

import { MdCancel, MdCheckCircle } from 'react-icons/md';

function acceptPost(id: string) {
   console.log('accept', id);
}

function rejectPost(id: string) {
   console.log('reject', id);
}

const AdminCheck: React.FC = () => {
   const [posts, setPosts] = useState<PostType[][]>([[]]);
   const Auth = useContext(AuthContext);
   const isMounted = useRef(true);
   useEffect(() => {
      if (isMounted.current) {
         isMounted.current = false;
         return;
      }
      if (Auth?.role) {
         axios
            .post('/post/check', {
               role: Auth?.role,
            })
            .then((response) => {
               console.log(response);
               setPosts(response.data);
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
         <div className="flex flex-col overflow-x-auto ml-20">
            <div className="sm:-mx-6 lg:-mx-8">
               <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-x-auto">
                     <table className="min-w-full text-left text-sm font-light pl-32">
                        <thead className="border-b font-medium dark:border-neutral-500">
                           <tr>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 #
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 Game
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 Title
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 UserID
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 Landing Position
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 Aiming Position
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 Standing Position
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 Approve
                              </th>
                              <th
                                 scope="col"
                                 className="border-r px-6 py-4 dar:border-neutral-500"
                              >
                                 Reject
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           {posts.map((post) => {
                              return (
                                 <>
                                    {post.map((p, index) => {
                                       return (
                                          <tr className="border-b dark:border-neutral-500">
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
                                                   className="w-10"
                                                />
                                             </td>
                                             <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                <img
                                                   src={`${CDN_URL}/${p.aimingPosition.public_id}.png`}
                                                   className="w-10"
                                                />
                                             </td>
                                             <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                <img
                                                   src={`${CDN_URL}/${p.standingPosition.public_id}.png`}
                                                   className="w-10"
                                                />
                                             </td>
                                             <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                <MdCheckCircle
                                                   size={50}
                                                   onClick={() =>
                                                      acceptPost(p._id)
                                                   }
                                                   className="cursor-pointer"
                                                />
                                             </td>
                                             <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                                <MdCancel
                                                   size={50}
                                                   onClick={() =>
                                                      rejectPost(p._id)
                                                   }
                                                   className="cursor-pointer"
                                                />
                                             </td>
                                          </tr>
                                       );
                                    })}
                                 </>
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
