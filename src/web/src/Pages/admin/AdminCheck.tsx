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
         <div>
            {posts.map((post, index) => {
               return (
                  <div key={index}>
                     {post.map((p) => {
                        return (
                           <div className="m-32">
                              <div>
                                 <p>Game: {p.game}</p>
                                 <p>Title: {p.postTitle}</p>
                                 <p>UserID: {p.UserID}</p>
                                 <p>Landing Position --- Aiming Position --- Standing Position</p>
                              </div>
                              <div key={p.game} className="flex flex-row">
                                 <img
                                    src={`${CDN_URL}/${p.landingPosition.public_id}`}
                                    width={250}
                                    height={250}
                                 />
                                 <img
                                    className="pl-4 pr-4"
                                    src={`${CDN_URL}/${p.aimingPosition.public_id}`}
                                    width={250}
                                    height={250}
                                 />
                                 <img
                                    src={`${CDN_URL}/${p.standingPosition.public_id}`}
                                    width={250}
                                    height={250}
                                 />
                              </div>
                              <div className="flex">
                                 <MdCheckCircle
                                    size={50}
                                    className="cursor-pointer"
                                    onClick={() => acceptPost(p._id)}
                                 />
                                 <MdCancel
                                    size={50}
                                    className="cursor-pointer"
                                    onClick={() => rejectPost(p._id)}
                                 />
                              </div>
                           </div>
                        );
                     })}
                  </div>
               );
            })}
         </div>
         <Footer />
      </>
   );
};

export default AdminCheck;
