import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../../Components';
import { ToastContainer, toast } from 'react-toastify';

const ForgotPassword: React.FC = () => {
   const [email, setEmail] = useState<string>('');
   const navigate = useNavigate();

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const id = toast.loading('Sending forgot password email...');

      try {
         const response = await axios.post('/forgotpassword', { email });
         console.log(response.data);

         toast.update(id, {
            render: 'Reset link sent to your email!',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         });

         navigate('/login');
      } catch (error) {
         if (axios.isAxiosError(error)) {
            console.error('Forgot password error:', error.response?.data);
            toast.update(id, {
               render: error.response?.data || 'Failed to send reset link.',
               type: 'error',
               isLoading: false,
               autoClose: 2000,
               hideProgressBar: false,
            });
         } else {
            console.error('Unexpected error:', error);
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
            <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl">
               <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                     Reset your password
                  </h2>
                  <p className="mt-2 text-center text-sm text-gray-300">
                     Enter your email and we'll send you a reset link
                  </p>
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div>
                     <label htmlFor="email" className="sr-only">
                        Email address
                     </label>
                     <input
                        id="email"
                        type="email"
                        required
                        className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-gray-700 placeholder-gray-400 text-white bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out"
                     >
                        Send reset link
                     </button>
                  </div>
                  <div className="text-center">
                     <Link
                        to="/login"
                        className="text-sm text-purple-300 hover:text-purple-200"
                     >
                        Back to login
                     </Link>
                  </div>
               </form>
            </div>
         </div>
         <ToastContainer position="top-center" />
      </Layout>
   );
};

export default ForgotPassword;
