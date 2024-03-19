import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../../Pages/PostPage';
import { getUserByUsername } from '../../util/getUser';
import { UserType } from '../../global.types';
import { timeAgo } from './helper';

type CommentProps = {
   comment: Comment;
   className?: string;
};

const Comments: React.FC<CommentProps> = ({ comment, className }) => {
   const [user, setUser] = useState<UserType>();

   useEffect(() => {
      if (comment.username) {
         getUserByUsername(comment.username).then((user) => {
            setUser(user);
         });
      }
   }, [comment.username]);

   return (
      <div className={`flex ${className}`}>
         <div>
            <Link to={`/user/${user?.username}`}>
               <img
                  src={`${user?.ProfilePicture}`}
                  alt="profile"
                  className="rounded-full w-10 h-10"
               />
            </Link>
         </div>
         <div className="ml-2 flex flex-col">
            <div className="flex flex-row">
               <Link to={`/user/${user?.username}`}>
                  <p className="text-sm">{comment.username}</p>
               </Link>
               <p className="text-gray-400 ml-2 text-sm hover:text-white cursor-pointer">
                  {timeAgo(new Date(comment.createdAt))}
               </p>
            </div>
            <p>{comment.text}</p>
         </div>
      </div>
   );
};

export default Comments;
