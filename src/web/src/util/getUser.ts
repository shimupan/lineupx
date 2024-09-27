import axios from 'axios';

export async function getAllUsers(role: string) {
   try {
      const response = await axios.post('user', { role: role });
      return response.data;
   } catch (error) {
      throw error;
   }
}

export async function getUserByID(id: string) {
   try {
      const response = await axios.get(`user/id/${id}`);
      return response.data;
   } catch (error) {
      throw error;
   }
}

export async function getUsersByIDs(ids: string[]) {
   try {
      const response = await axios.get(`users/ids?ids=${ids.join(',')}`);
      return response.data;
   } catch (error) {
      throw error;
   }
}

export async function getUserByUsername(username: string) {
   try {
      console.log("hello")
      const response = await axios.get(`user/${username}`);
      return response.data;
   } catch (error) {
      throw error;
   }
}
