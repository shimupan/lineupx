import axios from 'axios';

export async function follow(follower: string, followee: string) {
    console.log("follower: ", follower);
   const res = await axios.post(`/user/${follower}/follow`, {
      userIdToFollow: followee,
   });
   return res.status;
}
