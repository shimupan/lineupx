import axios from 'axios';
import { UserType } from '../global.types';

type ResponseType = {
   render: any;
   type: 'success' | 'error';
   isLoading: boolean;
   autoClose: number;
   hideProgressBar: boolean;
};

export const sendVerificationEmail = async (
   user: UserType,
): Promise<ResponseType> => {
   try {
      const response = await axios.post('/send-verification-email', {
         email: user?.email,
         userId: user?._id,
      });

      if (response.status === 200) {
         return {
            render: 'Verification email sent!',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         };
      } else {
         return {
            render: 'Error sending verification email.',
            type: 'error',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         };
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return {
            render:
               error.response?.data.message ||
               'Error sending verification email.',
            type: 'error',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         };
      } else {
         return {
            render: 'Unexpected error occurred',
            type: 'error',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         };
      }
   }
};
