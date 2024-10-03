import React, { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../../Components';
import { AuthContext } from '../../App';
import { useCookies } from '../../hooks';
import { ToastContainer, toast } from 'react-toastify';

const Login: React.FC = () => {
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [loginError, setLoginError] = useState<string | null>(null);
   const [, setAccessToken] = useCookies('accessToken', '');
   const [, setRefreshToken] = useCookies('refreshToken', '');
   const navigate = useNavigate();
   const Auth = useContext(AuthContext);

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoginError('');

      if (!email || !password) {
         setLoginError('Email and password are required');
         return;
      }

      if (!isValidEmail(email)) {
         setLoginError('Please enter a valid email address');
         return;
      }
      const id = toast.loading('Logging in...');

      try {
         const response = await axios.post('/login', { email, password });

         toast.update(id, {
            render: 'Successfully Logged in!',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         });

         const expire = new Date();
         expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 7);
         Auth?.setAccessToken(response.data.accessToken);
         Auth?.setRefreshToken(response.data.refreshToken);
         setAccessToken(response.data.accessToken, {
            path: '/',
            expires: expire,
         });
         setRefreshToken(response.data.refreshToken, {
            path: '/',
            expires: expire,
         });
         navigate('/');
      } catch (error) {
         if (axios.isAxiosError(error) && error.response?.status === 429) {
            toast.update(id, {
               render:
                  error.response?.data ||
                  'Too many login attempts, please try again later.',
               type: 'error',
               isLoading: false,
               autoClose: 2000,
               hideProgressBar: false,
            });
         } else {
            toast.update(id, {
               render: 'Failed to Login...',
               type: 'error',
               isLoading: false,
               autoClose: 2000,
               hideProgressBar: false,
            });
            if (axios.isAxiosError(error)) {
               setLoginError(error.response?.data.message || 'Login failed');
               console.error('Login error:', error.response?.data);
            } else {
               setLoginError('Unexpected error occurred');
               console.error('Unexpected error:', error);
            }
         }
      }
      if (Auth?.accessToken) {
         navigate(`/user/${Auth?.username}`);
      }
   };

   const handleGoogleSignIn = () => {
      window.location.href = axios.defaults.baseURL + '/google';
   };

   const isValidEmail = (email: string) => {
      return email.includes('@');
   };

   return (
      <Layout>
         <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white/10 p-8 rounded-xl shadow-2xl">
               <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                     Sign in to your account
                  </h2>
               </div>
               <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  {loginError && (
                     <div className="text-red-300 text-center bg-red-900/50 py-2 rounded-lg">
                        {loginError}
                     </div>
                  )}
                  <div className="rounded-md shadow-sm -space-y-px">
                     <div>
                        <label htmlFor="email" className="sr-only">
                           Email address
                        </label>
                        <input
                           id="email"
                           type="email"
                           required
                           className="appearance-none rounded-t-lg relative block w-full px-3 py-4 border border-gray-700 placeholder-gray-400 text-white bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                           placeholder="Email address"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>
                     <div>
                        <label htmlFor="password" className="sr-only">
                           Password
                        </label>
                        <input
                           id="password"
                           type="password"
                           required
                           className="appearance-none rounded-b-lg relative block w-full px-3 py-4 border border-gray-700 placeholder-gray-400 text-white bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                           placeholder="Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center">
                        <input
                           id="remember-me"
                           type="checkbox"
                           className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-600 rounded bg-gray-900/50"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                           Remember me
                        </label>
                     </div>

                     <Link to="/forgotpassword" className="text-sm text-purple-300 hover:text-purple-200">
                        Forgot password?
                     </Link>
                  </div>

                  <div>
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out"
                     >
                        Sign in
                     </button>
                  </div>

                  <div>
                     <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 ease-in-out"
                     >
                        Sign in with Google
                     </button>
                  </div>
               </form>

               <p className="mt-2 text-center text-sm text-gray-200">
                  Not registered yet?{' '}
                  <Link to="/register" className="font-medium text-purple-300 hover:text-purple-200">
                     Create an account
                  </Link>
               </p>
            </div>
         </div>
         <ToastContainer position="top-center" />
      </Layout>
   );
};

export default Login;