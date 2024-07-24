import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Header, SideNavWrapper, BottomNav } from '../../Components';
import { ToastContainer, toast } from 'react-toastify';
import useIsMobile from '../../hooks/isMobile';

const Register: React.FC = () => {
   const isMobile = useIsMobile();
   const [userName, setUserName] = useState<string>('');
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
   const [registerError, setRegisterError] = useState<string>('');
   const navigate = useNavigate();

   const isValidEmail = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setRegisterError('');

      if (!isValidEmail(email)) {
         setRegisterError('Please enter a valid email address');
         return;
      }

      if (password !== passwordConfirmation) {
         setRegisterError('Passwords do not match');
         return;
      }

      const id = toast.loading('Registering User...');

      try {
         await axios.post('/register', {
            userName,
            email,
            password,
         });

         toast.update(id, {
            render: 'Successfully Registered!',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         });

         navigate('/login');
      } catch (error) {
         if (axios.isAxiosError(error)) {
            setRegisterError(
               error.response?.data.message || 'Registration failed',
            );
            toast.update(id, {
               render: error.response?.data.message || 'Registration failed',
               type: 'error',
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         } else {
            setRegisterError('Unexpected error occurred');
            toast.update(id, {
               render: 'Unexpected error occurred',
               type: 'error',
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         }
      }
   };

   return (
      <>
         <Header />

         {!isMobile && <SideNavWrapper />}

         <div className="h-screen md:h-full md:w-1/2 lg:w-1/2 container flex flex-col mx-auto bg-white rounded-lg md:pt-12 md:my-5">
            <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
               <div className="flex items-center justify-center w-full lg:p-12">
                  <div className="flex items-center xl:p-10">
                     <form
                        className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
                        onSubmit={handleSubmit}
                     >
                        <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                           Sign Up
                        </h3>
                        {registerError && (
                           <div className="text-red-500">{registerError}</div>
                        )}
                        <div className="flex items-center mb-3"></div>
                        <label
                           htmlFor="username"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Username*
                        </label>
                        <input
                           id="username"
                           type="username"
                           placeholder="Enter an username"
                           value={userName}
                           onChange={(e) => setUserName(e.target.value)}
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                        />
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
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                        />
                        <label
                           htmlFor="passwordConfirmation"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Confirm your Password*
                        </label>
                        <input
                           id="passwordConfirmation"
                           type="password"
                           placeholder="Confirm password"
                           value={passwordConfirmation}
                           onChange={(e) =>
                              setPasswordConfirmation(e.target.value)
                           }
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                        />
                        <button
                           type="submit"
                           className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900"
                        >
                           Sign Up
                        </button>
                        <p className="text-sm leading-relaxed text-gray-900">
                           Have an account?{' '}
                           <Link
                              to={'../login'}
                              className="font-bold text-blue-900"
                           >
                              Login In
                           </Link>
                        </p>
                     </form>
                  </div>
               </div>
            </div>
         </div>
         <div style={{ paddingTop: '80px' }}>{isMobile && <BottomNav />}</div>
         <ToastContainer position="top-center" />
      </>
   );
};

export default Register;
