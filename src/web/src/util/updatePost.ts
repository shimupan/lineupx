import axios from 'axios';

export async function approveRejectPosts(
   id: string,
   status: string,
   game: string,
   role: string,
) {
   try {
      console.log(id, status, game, role);
      const response = await axios.post(`post/${status}`, {
         id,
         status,
         game,
         role,
      });
      return response.data;
   } catch (error) {
      return error;
   }
}
