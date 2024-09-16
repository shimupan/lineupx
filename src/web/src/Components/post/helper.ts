import socket from '../../services/socket';

export function timeAgo(date: Date) {
   const now = new Date();
   const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
   const minutesAgo = Math.floor(secondsAgo / 60);
   const hoursAgo = Math.floor(minutesAgo / 60);
   const daysAgo = Math.floor(hoursAgo / 24);
   const monthsAgo = Math.floor(daysAgo / 30);
   const yearsAgo = Math.floor(daysAgo / 365);

   if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
   if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
   if (hoursAgo < 24) return `${hoursAgo} hours ago`;
   if (daysAgo < 30) return `${daysAgo} days ago`;
   if (monthsAgo < 12) return `${monthsAgo} months ago`;
   return `${yearsAgo} years ago`;
}

export const incrementLikeCount = async (
   postId: string,
   user_Id: string,
   game: string,
) => {
   socket.emit('incrementLike', { postId, userId: user_Id, game });
};

export const incrementDislikeCount = async (
   postId: string,
   user_Id: string,
   game: string,
) => {
   socket.emit('incrementDislike', { postId, userId: user_Id, game });
};

export const removeLike = async (
   postId: string,
   user_Id: string,
   game: string,
) => {
   socket.emit('removeLike', { postId, userId: user_Id, game });
};

export const removeDislike = async (
   postId: string,
   user_Id: string,
   game: string,
) => {
   socket.emit('removeDislike', { postId, userId: user_Id, game });
};
