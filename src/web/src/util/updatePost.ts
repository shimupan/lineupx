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

export const abbreviateNumber = (num: number): string => {
   // Exporting the function
   if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
   } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
   } else {
      return num.toString();
   }
};
