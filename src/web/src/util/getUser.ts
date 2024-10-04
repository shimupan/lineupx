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

export async function getUserByUsername(username: string, currUser: string, params: string[] = []) {
   try {
      //currUser = "" is treated as a guest or invalid user signin, this case will not be able to access profile data specific to username
      if(!currUser){
         currUser = "";
      }
      const response = await axios.get(`user/${username}?CurrentUser=${currUser}&Params=${params}`);
      return response.data;
   } catch (error) {
      throw error;
   }
}
