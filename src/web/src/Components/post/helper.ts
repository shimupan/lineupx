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

// New notification types
export interface Notification {
   _id: string;
   recipient: string;
   sender: {
      _id: string;
      username: string;
      ProfilePicture?: string;
   };
   type: 'comment' | 'follow';
   post?: {
      _id: string;
      postTitle: string;
   };
   message: string;
   read: boolean;
   createdAt: Date;
}

// New socket functions for notifications
export const addComment = async (
   postId: string,
   userId: string,
   username: string,
   text: string,
   game: string,
) => {
   socket.emit('addComment', { postId, userId, username, text, game });
};

export const followUser = async (
   followerId: string,
   followedId: string,
   username: string,
) => {
   socket.emit('follow', { followerId, followedId, username });
};

// Notification room management
export const joinNotificationRoom = (userId: string) => {
   socket.emit('joinNotificationRoom', userId);
};

// Notification listeners
export const onNotification = (callback: (notification: Notification) => void) => {
   socket.on('newNotification', callback);
};

export const offNotification = () => {
   socket.off('newNotification');
};

// New socket event listeners for real-time updates
export const onCommentUpdate = (callback: (data: { postId: string; comments: any[] }) => void) => {
   socket.on('commentUpdate', callback);
};

export const offCommentUpdate = () => {
   socket.off('commentUpdate');
};

export const onFollowUpdate = (callback: (data: { 
   userId: string;
   followedUserId: string;
   isFollowing: boolean;
   updatedUser: {
      id: string;
      username: string;
      ProfilePicture?: string;
   }
}) => void) => {
   socket.on('followingUpdate', callback);
};

export const offFollowUpdate = () => {
   socket.off('followingUpdate');
};

// Example usage in a component:
/*
import { useEffect } from 'react';
import {
   joinNotificationRoom,
   onNotification,
   offNotification,
   onCommentUpdate,
   offCommentUpdate,
   type Notification
} from './helper';

function YourComponent() {
   useEffect(() => {
      // Join notification room
      joinNotificationRoom(currentUserId);

      // Set up notification listener
      onNotification((notification: Notification) => {
         // Handle notification (show toast, update UI, etc.)
         console.log('New notification:', notification);
      });

      // Set up comment update listener
      onCommentUpdate((data) => {
         // Update comments in UI
         console.log('Comment update:', data);
      });

      // Cleanup
      return () => {
         offNotification();
         offCommentUpdate();
      };
   }, []);

   // Rest of your component...
}
*/