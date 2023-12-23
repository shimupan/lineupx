import { PostType } from '../db.types';
import { CDN_URL } from '../Components';

interface PostsProps {
   postData: PostType;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   return (
      <div className="max-w-md mx-auto my-5 p-5 border border-gray-300 rounded-lg shadow-sm bg-white">
         <div className="text-center text-lg font-bold text-gray-800 mb-4">
            User ID: {postData.UserID}
         </div>
         <img
            className="w-full h-auto rounded mb-3"
            src={`${CDN_URL}/${postData.landingPosition.public_id}`}
            alt="Landing Position"
         />
         <img
            className="w-full h-auto rounded mb-3"
            src={`${CDN_URL}/${postData.standingPosition.public_id}`}
            alt="Standing Position"
         />
         <img
            className="w-full h-auto rounded mb-3"
            src={`${CDN_URL}/${postData.aimingPosition.public_id}`}
            alt="Aiming Position"
         />
      </div>
   );
};

export default Posts;

