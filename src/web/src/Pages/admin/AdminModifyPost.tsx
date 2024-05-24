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

         <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
            <button
               className="flex items-center mb-6 sm:mb-8 text-blue-500 hover:text-blue-700 cursor-pointer"
               onClick={() => navigate(-1)}
            >
               <IoIosArrowBack size={24} />
               <span className="ml-2 text-sm sm:text-base">Back</span>
            </button>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
               Title: {post?.postTitle}
            </h1>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center">
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
            <div className="flex justify-center mt-8 sm:mt-12">
               <MdCancel
                  className="cursor-pointer text-red-500 hover:text-red-700"
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
         </div>

         <Footer />
      </>
   );
};

export default AdminModifyPost;
