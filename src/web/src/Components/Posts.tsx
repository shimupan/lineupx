import { useNavigate } from 'react-router-dom';
import { PostType } from '../db.types';
import { CDN_URL } from '../Constants';

import decoy from '../assets/svg/decoy.svg';
import smoke from '../assets/svg/smoke.svg';
import molotov from '../assets/svg/molotov.svg';
import he from '../assets/svg/he.svg';
import flash from '../assets/svg/flash.svg';
import views from '../assets/svg/views.svg';
import like from '../assets/svg/like.svg';
import dislike from '../assets/svg/dislike.svg';

interface PostsProps {
   postData: PostType;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   const navigate = useNavigate();
   return (
      <div className="max-w-full my-5 p-5 border rounded-lg shadow-sm bg-white overflow-hidden">
         <div className="text-center text-sm text-gray-600">
            User ID: {postData.UserID}
         </div>

         <div className="svg-container relative text-sm text-gray-600">
            {postData.grenadeType === 'flash' ? (
               <img
                  className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                  src={flash}
                  alt="Flash"
                  title="Flash"
               />
            ) : postData.grenadeType === 'smoke' ? (
               <img
                  className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                  src={smoke}
                  alt="Smoke"
                  title="Smoke"
               />
            ) : postData.grenadeType === 'molotov' ? (
               <img
                  className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                  src={molotov}
                  alt="Molotov"
                  title="Molotov"
               />
            ) : postData.grenadeType === 'shock' ? (
               <img
                  className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                  src={decoy}
                  alt="Decoy"
                  title="Decoy"
               />
            ) : postData.grenadeType === 'he' ? (
               <img
                  className="svg-icon absolute top-0 right-0 w-4 h-4 mt-[-25px]"
                  src={he}
                  alt="HE"
                  title="HE"
               />
            ) : (
               'Unknown'
            )}
         </div>
         <img
            className="w-full h-60 object-cover cursor-pointer"
            src={`${CDN_URL}/${postData.landingPosition.public_id}`}
            alt={postData.postTitle}
            onClick={() =>
               navigate(`/game/${postData.game}/${postData.postTitle}`, {
                  state: { postData },
               })
            }
         />
         <div className="text-center mt-3">
            <div className="text-lg font-bold text-gray-800">
               {postData.postTitle}
            </div>
            <div className="mt-2 text-sm text-gray-600 flex justify-between">
               <div className="flex items-center">
                  <img
                     className="svg-icon w-4 h-4 mr-2"
                     src={views}
                     alt="Views"
                  />
                  : {postData.views}
               </div>
               <div className="flex items-center">
                  <img
                     className="svg-icon w-4 h-4 mr-2"
                     src={like}
                     alt="Likes"
                  />
                  : {postData.likes}
               </div>
               <div className="flex items-center">
                  <img
                     className="svg-icon w-4 h-4 mr-2"
                     src={dislike}
                     alt="Dislikes"
                  />
                  : {postData.dislikes}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Posts;
