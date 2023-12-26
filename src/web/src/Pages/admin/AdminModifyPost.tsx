import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { PostType } from '../../db.types';
import { Footer, Header, SideNavWrapper } from '../../Components';
import { CDN_URL } from '../../Constants';
import { AuthContext } from '../../App';
import { approveRejectPosts } from '../../util/updatePost';
import { MdCancel } from 'react-icons/md';

const AdminModifyPost = () => {
   const [post, setPost] = useState<PostType>();
   const Auth = useContext(AuthContext);
   const location = useLocation();
   useEffect(() => {
      setPost(location.state);
   }, [location.state]);
   return (
      <>
         <Header />
         <SideNavWrapper />
         <div className="ml-20">
            <h1>Title: {post?.postTitle}</h1>
            <img
               src={`${CDN_URL}/${post?.landingPosition.public_id}`}
               alt="postImage"
               loading="lazy"
            />
            <img
               src={`${CDN_URL}/${post?.aimingPosition.public_id}`}
               alt="postImage"
               loading="lazy"
            />
            <img
               src={`${CDN_URL}/${post?.standingPosition.public_id}`}
               alt="postImage"
               loading="lazy"
            />
            <MdCancel
               className="cursor-pointer"
               size={100}
               color="red"
               onClick={() =>
                  approveRejectPosts(
                     post?._id!,
                     'reject',
                     post?.game!,
                     Auth?.role!,
                  ).then(() => window.location.reload())
               }
            />
         </div>

         <Footer />
      </>
   );
};

export default AdminModifyPost;
