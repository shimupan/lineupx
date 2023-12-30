import { useState } from 'react';
import { UserType } from '../global.types';
import { IoMdClose } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

type ProfileEditProps = {
   user: UserType;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setOpen }) => {
   const [newUsername, setNewUsername] = useState(user.username);
   const [newEmail, setNewEmail] = useState(user.email);

   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const id = toast.loading('Saving Changes...');
      if (newUsername === user.username && newEmail === user.email) {
         toast.update(id, {
            render: 'Username and Email are the same',
            type: 'error',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         });
         return;
      }
      axios
         .post('/user/update', {
            user: user,
            newUsername: newUsername,
            newEmail: newEmail,
         })
         .then((response) => {
            toast.update(id, {
               render: response.data.message,
               type: response.data.type,
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         })
         .catch((error) => {
            toast.update(id, {
               render: error.response.data.message,
               type: error.response.data.type,
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         });
   }

   return (
      <>
         <div className="flex justify-center mt-20 px-8">
            <form className="max-w-2xl" onSubmit={handleSubmit}>
               <div className="flex flex-wrap border shadow rounded-lg p-3 dark:bg-gray-600">
                  <div className="flex justify-between w-full text-xl text-gray-600 dark:text-gray-300 pb-2">
                     <h2>Account Settings:</h2>
                     <IoMdClose
                        size={20}
                        className="cursor-pointer"
                        onClick={() => {
                           setOpen(!open);
                        }}
                     />
                  </div>

                  <div className="flex flex-col gap-2 w-full border-gray-400">
                     <div>
                        <label className="text-gray-600 dark:text-gray-400">
                           User Name: {user.username}
                        </label>
                        <input
                           className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                           type="text"
                           placeholder="Enter your username (leave blank for default)"
                           onChange={(e) => {
                              setNewUsername(e.target.value);
                           }}
                        />
                     </div>

                     <div>
                        <label className="text-gray-600 dark:text-gray-400">
                           Email: {user.email}
                        </label>
                        <input
                           className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                           type="text"
                           placeholder="Enter your email (leave blank for default)"
                           onChange={(e) => {
                              setNewEmail(e.target.value);
                           }}
                        />
                     </div>
                     <div className="flex justify-end">
                        <button
                           className="py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white  hover:bg-violet-500 hover:text-gray-100 dark:text-gray-200 dark:bg-violet-700"
                           type="submit"
                        >
                           Save changes
                        </button>
                     </div>
                  </div>
               </div>
            </form>
         </div>
         <ToastContainer position="top-center" />
      </>
   );
};

export default ProfileEdit;
