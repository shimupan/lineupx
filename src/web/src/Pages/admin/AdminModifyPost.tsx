import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { PostType } from '../../global.types';
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
         <div className="ml-2 sm:ml-5 lg:ml-20">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
               Title: {post?.postTitle}
            </h1>
            <div className="flex flex-col gap-2 sm:gap-4 items-center">
               <img
                  className="w-full sm:max-w-full h-auto shadow-lg rounded"
                  src={`${CDN_URL}/${post?.landingPosition.public_id}`}
                  alt="postImage"
                  loading="lazy"
               />
               <img
                  className="w-full sm:max-w-full h-auto shadow-lg rounded"
                  src={`${CDN_URL}/${post?.aimingPosition.public_id}`}
                  alt="postImage"
                  loading="lazy"
               />
               <img
                  className="w-full sm:max-w-full h-auto shadow-lg rounded"
                  src={`${CDN_URL}/${post?.standingPosition.public_id}`}
                  alt="postImage"
                  loading="lazy"
               />
            </div>
            <MdCancel
               className="cursor-pointer text-red-500 hover:text-red-700 mt-4"
               size={128}
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