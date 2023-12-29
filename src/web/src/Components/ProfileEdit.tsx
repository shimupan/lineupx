import { UserType } from '../db.types';
import { IoMdClose } from 'react-icons/io';

type ProfileEditProps = {
   user: UserType;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, setOpen }) => {
   return (
      <>
         <div className="flex justify-center mt-20 px-8">
            <form className="max-w-2xl">
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
                        />
                     </div>

                     <div>
                        <label className="text-gray-600 dark:text-gray-400">
                           Email: {user.email}
                        </label>
                        <input
                           className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                           type="text"
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
      </>
   );
};

export default ProfileEdit;
