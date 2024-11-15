import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../../Components';
import { ToastContainer, toast } from 'react-toastify';

const ResetPassword: React.FC = () => {
   const [password, setPassword] = useState<string>('');
   const [confirmPassword, setConfirmPassword] = useState<string>('');
   const [resetError, setResetError] = useState<string>('');
   const navigate = useNavigate();
   const location = useLocation();
   const query = new URLSearchParams(location.search);
   const token = query.get('token');

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setResetError('');

      if (password !== confirmPassword) {
         setResetError('Passwords do not match');
         return;
      }

      const id = toast.loading('Resetting Password...');

      try {
         await axios.post(`/resetpassword/${token}`, {
            password,
         });

         toast.update(id, {
            render: 'Password reset successful!',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         });

         navigate('/login');
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const errorMessage =
               error.response?.data.message || 'Reset password failed';
            setResetError(errorMessage);
            toast.update(id, {
               render: errorMessage,
               type: 'error',
               isLoading: false,
               autoClose: 2000,
               hideProgressBar: false,
            });
         } else {
            setResetError('An unexpected error occurred');
            toast.update(id, {
               render: 'An unexpected error occurred',
               type: 'error',
               isLoading: false,
               autoClose: 2000,
               hideProgressBar: false,
            });
         }
      }
   };

   return (
      <Layout>
         <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8 rounded-xl shadow-2xl">
               <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                     Reset your password
                  </h2>
                  <p className="mt-2 text-center text-sm text-gray-300">
                     Enter your new password below
                  </p>
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  {resetError && (
                     <div className="text-red-300 text-center bg-red-900/50 py-2 rounded-lg">
                        {resetError}
                     </div>
                  )}
                  <div className="rounded-md shadow-sm -space-y-px">
                     <div>
                        <label htmlFor="password" className="sr-only">
                           New Password
                        </label>
                        <input
                           id="password"
                           type="password"
                           required
                           className="appearance-none rounded-t-lg relative block w-full px-3 py-4 border border-gray-700 placeholder-gray-400 text-white bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                           placeholder="New password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                     </div>
                     <div>
                        <label htmlFor="confirmPassword" className="sr-only">
                           Confirm Password
                        </label>
                        <input
                           id="confirmPassword"
                           type="password"
                           required
                           className="appearance-none rounded-b-lg relative block w-full px-3 py-4 border border-gray-700 placeholder-gray-400 text-white bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                           placeholder="Confirm new password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out"
                     >
                        Reset Password
                     </button>
                  </div>
                  <div className="text-center">
                     <p className="text-sm text-gray-300">
                        Remember your password?{' '}
                        <Link
                           to="/login"
                           className="font-medium text-purple-300 hover:text-purple-200"
                        >
                           Sign in
                        </Link>
                     </p>
                  </div>
               </form>
            </div>
         </div>
         <ToastContainer position="top-center" />
      </Layout>
   );
};

export default ResetPassword;
