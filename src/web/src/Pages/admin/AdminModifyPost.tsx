import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { PostType } from '../../global.types';
import { Header, Footer, SideNavWrapper } from '../../Components';
import { CDN_URL } from '../../Constants';
import { AuthContext } from '../../App';
import { approveRejectPosts } from '../../util/updatePost';
import { MdCancel } from 'react-icons/md';

const AdminModifyPost = () => {
   const [post, setPost] = useState<PostType>();
   const Auth = useContext(AuthContext);
   const location = useLocation();
   const navigate = useNavigate();
   useEffect(() => {
      setPost(location.state);
   }, [location.state]);

   return (
      <>
         <Header />
         <SideNavWrapper />

         <div className="container mx-auto px-4 py-8">
            <button
               className="flex items-center mb-4 text-blue-500 hover:text-blue-700 cursor-pointer"
               onClick={() => navigate(-1)}
            >
               <IoIosArrowBack size={24} />
               <span className="ml-2">Back</span>
            </button>

            <h1 className="text-2xl font-bold text-center mb-4">
               Title: {post?.postTitle}
            </h1>
            <div className="flex flex-wrap gap-4 justify-center">
               <img
                  className="w-full sm:max-w-md h-auto shadow-lg rounded mb-4"
                  src={`${CDN_URL}/${post?.landingPosition.public_id}`}
                  alt="postImage"
                  loading="lazy"
               />
               <img
                  className="w-full sm:max-w-md h-auto shadow-lg rounded mb-4"
                  src={`${CDN_URL}/${post?.aimingPosition.public_id}`}
                  alt="postImage"
                  loading="lazy"
               />
               <img
                  className="w-full sm:max-w-md h-auto shadow-lg rounded mb-4"
                  src={`${CDN_URL}/${post?.standingPosition.public_id}`}
                  alt="postImage"
                  loading="lazy"
               />
            </div>
            <MdCancel
               className="cursor-pointer text-red-500 hover:text-red-700 mx-auto mt-8"
               size={128}
               onClick={() =>
                  approveRejectPosts(
                     post?._id!,
                     'reject',
                     post?.game!,
                     Auth?.role!,
                  ).then(() => navigate(-1))
               }
            />
         </div>

         <Footer />
      </>
   );
};

export default AdminModifyPost;
