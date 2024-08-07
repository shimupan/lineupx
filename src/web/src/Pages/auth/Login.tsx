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
      <>
         <Layout>
            <div className="h-screen md:h-full md:w-1/2 lg:w-1/2 container flex flex-col mx-auto bg-white rounded-lg md:pt-12 md:my-5">
               <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
                  <div className="flex items-center justify-center w-full lg:p-12">
                     <div className="flex items-center xl:p-10">
                        <form
                           className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
                           onSubmit={handleSubmit}
                        >
                           {loginError && (
                              <div className="text-red-500">{loginError}</div>
                           )}
                           <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                              Sign In
                           </h3>
                           <label
                              htmlFor="email"
                              className="mb-2 text-sm text-start text-gray-900"
                           >
                              Email*
                           </label>
                           <input
                              id="email"
                              type="email"
                              placeholder="name@gmail.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                           />
                           <label
                              htmlFor="password"
                              className="mb-2 text-sm text-start text-gray-900"
                           >
                              Password*
                           </label>
                           <input
                              id="password"
                              type="password"
                              placeholder="Enter a password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="flex text-black items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                           />
                           <div className="flex flex-row justify-between mb-8">
                              <div className="flex items-center">
                                 <input
                                    type="checkbox"
                                    id="rememberMe"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                                 />
                                 <label
                                    htmlFor="rememberMe"
                                    className="ml-2 text-sm text-gray-900"
                                 >
                                    Remember me
                                 </label>
                              </div>
                              <Link
                                 to="/forgotpassword"
                                 className="text-sm font-medium text-blue-900"
                              >
                                 Forgot password?
                              </Link>
                           </div>
                           <button
                              type="submit"
                              className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900"
                           >
                              Sign In
                           </button>
                           <button
                              type="button"
                              className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-red-600"
                              onClick={handleGoogleSignIn}
                           >
                              Sign In with Google
                           </button>
                           <p className="text-sm leading-relaxed text-gray-900">
                              Not registered yet?{' '}
                              <Link
                                 to="/register"
                                 className="font-bold text-blue-900"
                              >
                                 Create an Account
                              </Link>
                           </p>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </Layout>
         <ToastContainer position="top-center" />
      </>
   );
};

export default Login;
