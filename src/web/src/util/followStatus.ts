import axios from 'axios';
import socket from '../services/socket';

export async function follow(follower: string, followee: string) {
   try {
      const res = await axios.post(`/user/${follower}/follow`, {
         userIdToFollow: followee,
         username: follower,
      });

      // Emit follow event for real-time notification
      socket.emit('follow', {
         followerId: followee,
         username: follower,
      });

      return res.status;
   } catch (error) {
      console.error('Error following user:', error);
      return 500;
   }
}
