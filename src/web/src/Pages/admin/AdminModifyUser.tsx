import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserType } from '../../global.types';
import { Layout } from '../../Components';
import { FaEdit, FaSave, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminModifyUser: React.FC = () => {
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

   return (
      <Layout>
      <div className="min-h-screen bg-gray-900 text-white">
         <ToastContainer />
         <div className="flex">
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
                     <div className="flex items-center">
                        <label className="w-24 font-semibold">Username:</label>
                        {editMode.username ? (
                           <input
                              type="text"
                              name="username"
                              value={user.username}
                              onChange={handleInputChange}
                              className="bg-gray-700 text-white px-2 py-1 rounded"
                           />
                        ) : (
                           <span>{user.username}</span>
                        )}
                        {editMode.username ? (
                           <FaSave
                              onClick={() => handleSave('username')}
                              className="ml-2 cursor-pointer text-green-500 hover:text-green-400"
                           />
                        ) : (
                           <FaEdit
                              onClick={() => handleEdit('username')}
                              className="ml-2 cursor-pointer text-blue-500 hover:text-blue-400"
                           />
                        )}
                     </div>
                     <div className="flex items-center">
                        <label className="w-24 font-semibold">Email:</label>
                        <span>{user.email}</span>
                     </div>
                     <div className="flex items-center">
                        <label className="w-24 font-semibold">Role:</label>
                        {editMode.role ? (
                           <select
                              name="role"
                              value={user.role}
                              onChange={handleInputChange}
                              className="bg-gray-700 text-white px-2 py-1 rounded"
                           >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                           </select>
                        ) : (
                           <span>{user.role}</span>
                        )}
                        {editMode.role ? (
                           <FaSave
                              onClick={() => handleSave('role')}
                              className="ml-2 cursor-pointer text-green-500 hover:text-green-400"
                           />
                        ) : (
                           <FaEdit
                              onClick={() => handleEdit('role')}
                              className="ml-2 cursor-pointer text-blue-500 hover:text-blue-400"
                           />
                        )}
                     </div>
                     <div className="flex items-center">
                        <label className="w-24 font-semibold">Verified:</label>
                        {editMode.Verified ? (
                           <select
                              name="Verified"
                              value={user.Verified.toString()}
                              onChange={handleInputChange}
                              className="bg-gray-700 text-white px-2 py-1 rounded"
                           >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                           </select>
                        ) : (
                           <span>{user.Verified ? 'Yes' : 'No'}</span>
                        )}
                        {editMode.Verified ? (
                           <FaSave
                              onClick={() => handleSave('Verified')}
                              className="ml-2 cursor-pointer text-green-500 hover:text-green-400"
                           />
                        ) : (
                           <FaEdit
                              onClick={() => handleEdit('Verified')}
                              className="ml-2 cursor-pointer text-blue-500 hover:text-blue-400"
                           />
                        )}
                     </div>
                  </div>
               </div>
            </main>
         </div>

      </div>
      </Layout>
   );
};

export default AdminModifyUser;
