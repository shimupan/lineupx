import React from 'react';
import { toast } from 'react-toastify';
import { sendVerificationEmail } from '../../util/sendVerificationEmail';
import { UserType } from '../../global.types';

interface VerificationMessageProps {
   user: UserType;
}

const VerificationMessage: React.FC<VerificationMessageProps> = ({ user }) => {
   const handleVerification = () => {
      const id = toast.loading('Sending verification email...');
      sendVerificationEmail(user).then((response) => {
         toast.update(id, response);
      });
   };

   return (
      <div className="max-w-md mx-auto bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg rounded-lg p-6 mt-8">
         <div className="flex items-center mb-4">
            <svg
               className="w-6 h-6 mr-2"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
               />
            </svg>
            <h2 className="text-xl font-semibold">Verification Needed</h2>
         </div>
         <p className="mb-4">
            Your account is not verified. Please check your email to verify your
            account.
         </p>
         <button
            className="w-full bg-white text-pink-500 font-bold py-2 px-4 rounded-full hover:bg-pink-100 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleVerification}
         >
            Send Verification Email
         </button>
      </div>
   );
};

export default VerificationMessage;
