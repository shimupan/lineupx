import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserType } from '../../global.types';
import { Header, SideNavWrapper, Footer, BottomNav } from '../../Components';
import { FaEdit, FaSave, FaArrowLeft, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useIsMobile from '../../hooks/isMobile';

const AdminModifyUser: React.FC = () => {
   const isMobile = useIsMobile();
   const [user, setUser] = useState<UserType | null>(null);
   const [editMode, setEditMode] = useState({
      username: false,
      role: false,
      Verified: false,
   });
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      setUser(location.state as UserType);
   }, [location.state]);

   const handleEdit = (field: keyof typeof editMode) => {
      setEditMode({ ...editMode, [field]: true });
   };

   const handleSave = async (field: keyof typeof editMode) => {
      if (!user) return;

      try {
         const response = await axios.patch(`/user/${user._id}`, {
            [field]: user[field],
         });
         if (response.status === 200) {
            setEditMode({ ...editMode, [field]: false });
            toast.success(
               `${
                  field.charAt(0).toUpperCase() + field.slice(1)
               } updated successfully`,
            );
         }
      } catch (error) {
         console.error('Error updating user:', error);
         toast.error(`Failed to update ${field}`);
      }
   };

   const handleCancel = (field: keyof typeof editMode) => {
      setEditMode({ ...editMode, [field]: false });
      setUser(location.state as UserType);
   };

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
   ) => {
      if (!user) return;
      const { name, value } = e.target;
      setUser({
         ...user,
         [name]: name === 'Verified' ? value === 'true' : value,
      });
   };

   if (!user) return <div>Loading...</div>;

   const renderField = (field: keyof typeof editMode, label: string) => (
      <div className="mb-4">
         <label className="block text-sm font-medium mb-1">{label}</label>
         <div className="flex items-center">
            {editMode[field] ? (
               <>
                  {field === 'Verified' ? (
                     <select
                        name={field}
                        value={user[field].toString()}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                     >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                     </select>
                  ) : field === 'role' ? (
                     <select
                        name={field}
                        value={user[field]}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                     >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                     </select>
                  ) : (
                     <input
                        type="text"
                        name={field}
                        value={user[field] as string}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white px-3 py-2 rounded-md w-full"
                     />
                  )}
                  <FaSave
                     onClick={() => handleSave(field)}
                     className="ml-2 cursor-pointer text-green-500 hover:text-green-400"
                  />
                  <FaTimes
                     onClick={() => handleCancel(field)}
                     className="ml-2 cursor-pointer text-red-500 hover:text-red-400"
                  />
               </>
            ) : (
               <>
                  <span className="bg-gray-700 text-white px-3 py-2 rounded-md w-full">
                     {field === 'Verified'
                        ? user[field]
                           ? 'Yes'
                           : 'No'
                        : user[field]}
                  </span>
                  <FaEdit
                     onClick={() => handleEdit(field)}
                     className="ml-2 cursor-pointer text-blue-500 hover:text-blue-400"
                  />
               </>
            )}
         </div>
      </div>
   );

   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <Header />
         <ToastContainer />
         <div className="flex flex-col md:flex-row">
            {!isMobile && <SideNavWrapper />}
            <main className="flex-1 p-4 md:p-6 md:ml-32">
               <button
                  onClick={() => navigate(-1)}
                  className="mb-4 flex items-center text-blue-400 hover:text-blue-300"
               >
                  <FaArrowLeft className="mr-2" /> Back to Users
               </button>
               <div className="bg-gray-800 shadow-md rounded-lg p-6">
                  <h1 className="text-2xl font-bold mb-6">
                     Modify User: {user.username}
                  </h1>
                  <div className="space-y-4">
                     {renderField('username', 'Username')}
                     <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                           Email
                        </label>
                        <span className="bg-gray-700 text-white px-3 py-2 rounded-md block w-full">
                           {user.email}
                        </span>
                     </div>
                     {renderField('role', 'Role')}
                     {renderField('Verified', 'Verified')}
                  </div>
               </div>
            </main>
         </div>
         <Footer />
         {isMobile && (
            <div className="pb-20">
               <BottomNav />
            </div>
         )}
      </div>
   );
};

export default AdminModifyUser;
