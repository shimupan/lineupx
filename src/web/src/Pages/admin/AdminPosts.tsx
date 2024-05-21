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
         <div className="mt-8 mb-6 ml-2 sm:ml-10 md:ml-20 text-2xl sm:text-4xl md:text-5xl font-bold text-white">
            Click on a Post to View More Information.
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
                                       onClick={() =>
                                          navigate(
                                             `/admin/post/${p.postTitle}`,
                                             { state: p },
                                          )
                                       }
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

export default AdminPosts;
