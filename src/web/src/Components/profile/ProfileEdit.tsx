import React, { useState } from 'react';
import { UserType } from '../../global.types';
import { IoMdClose, IoMdArrowBack } from 'react-icons/io'; // Import the IoMdArrowBack icon
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

type ProfileEditProps = {
   user: UserType;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setOpen }) => {
   const [newUsername, setNewUsername] = useState(user.username);

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const id = toast.loading('Saving Changes...');
      if (newUsername === user.username) {
         toast.update(id, {
            render: 'No changes detected.',
            type: 'info',
            isLoading: false,
            autoClose: 2000,
         });
         return;
      }

      axios
         .post('/user/update', {
            user: user,
            newUsername: newUsername,
         })
         .then((response) => {
            toast.update(id, {
               render: response.data.message,
               type: 'success',
               isLoading: false,
               autoClose: 2000,
            });
         })
         .catch((error) => {
            toast.update(id, {
               render: error.response
                  ? error.response.data.message
                  : 'An error occurred',
               type: 'error',
               isLoading: false,
               autoClose: 2000,
            });
         });
   }

   return (
      <>
         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl text-gray-700 font-semibold">
                     Edit Profile
                  </h2>
                  <IoMdClose
                     className="cursor-pointer"
                     onClick={() => setOpen(false)}
                  />
               </div>
               {/* Replace the button text with an arrow icon */}
               <button
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-gray-700"
               >
                  <IoMdArrowBack className="inline mr-2" />
                  Back
               </button>
               <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                     <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                     >
                        New Username
                     </label>
                     <input
                        type="text"
                        id="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="text-gray-700 mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                     />
                  </div>
                  <button
                     type="submit"
                     className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                     Save Changes
                  </button>
               </form>
            </div>
         </div>
         <ToastContainer position="top-center" />
      </>
   );
};

export default ProfileEdit;
