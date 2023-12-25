import axios from 'axios';

export async function getUserByID(id: string) {
   try {
      const response = await axios.get(`user/id/${id}`);
      return response.data;
   } catch (error) {
      return error;
   }
}

export async function getUserByUsername(username: string) {
   try {
      const response = await axios.get(`user/${username}`);
      return response.data;
   } catch (error) {
      return error;
   }
}
