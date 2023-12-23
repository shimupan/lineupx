import { PostType } from '../db.types';
import { CDN_URL } from '../Components';

interface PostsProps {
   postData: PostType;
}

const Posts: React.FC<PostsProps> = ({ postData }) => {
   return (
      <>
         <div>{postData.UserID}</div>
         <img
            src={`${CDN_URL}/${postData.landingPosition.public_id}`}
            alt="landing position"
         />
         <img
            src={`${CDN_URL}/${postData.standingPosition.public_id}`}
            alt="aiming position"
         />
         <img
            src={`${CDN_URL}/${postData.aimingPosition.public_id}`}
            alt="landing position"
         />
      </>
   );
};

export default Posts;
