import { PostType } from '../db.types';
import { CDN_URL } from '../Constants';

interface PostsProps {
   postData: PostType;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   return (
      <div className="max-w-full my-5 p-5 border rounded-lg shadow-sm bg-white overflow-hidden">
         <img
            className="w-full h-60 object-cover" 
            src={`${CDN_URL}/${postData.landingPosition.public_id}`}
            alt={postData.postTitle} 
         />
         <div className="text-center mt-3">
            <div className="text-lg font-bold text-gray-800">
               {postData.postTitle}
            </div>
            <div className="text-sm text-gray-600">
               User ID: {postData.UserID}
            </div>
            <div className="text-sm text-gray-600">
               Grenade Type: 

               {postData.grenadeType === 'flash' ? 'Flashbang' :
               postData.grenadeType === 'smoke' ? 'Smoke' :
               postData.grenadeType === 'molotov' ? 'Molotov' :
               postData.grenadeType === 'shock' ? 'Decoy' :
               postData.grenadeType === 'he' ? 'HE' :
               'Unknown'}
            </div>
         </div>
      </div>
   );
};

export default Posts;
