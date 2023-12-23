import { PostType } from '../db.types';
import { CDN_URL } from '../Constants';

interface PostsProps {
   postData: PostType;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   return (
      <div className="max-w-full my-5 p-5 border-t border-b border-gray-300 rounded-lg shadow-sm custom-bg">
         <div className="text-center text-lg font-bold text-white-800 mb-4">
            User ID: {postData.UserID}
            <br />
            {postData.postTitle}
         </div>
         <img
            className="w-full h-auto rounded mb-3"
            src={`${CDN_URL}/${postData.landingPosition.public_id}`}
            alt="Landing Position"
         />
      </div>
   );
};

export default Posts;