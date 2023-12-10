import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Header, SideNavWrapper } from '../../Components';

const ForgotPassword: React.FC = () => {
   const [email, setEmail] = useState<string>('');
   const navigate = useNavigate();

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
         const response = await axios.post('/forgotpassword', { email });
         console.log(response.data);
         navigate('/login');
      } catch (error) {
         if (axios.isAxiosError(error)) {
            console.error('Forgot password error:', error.response?.data);
         } else {
            console.error('Unexpected error:', error);
         }
      }
   };

   return (
      <>
         <Header />

         <SideNavWrapper />

         <div className="h-screen md:h-full md:w-1/2 lg:w-1/3 container flex flex-col mx-auto bg-white rounded-lg md:pt-12 md:my-5">
            <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
               <div className="flex items-center justify-center w-full lg:p-12">
                  <div className="flex items-center xl:p-10">
                     <form
                        className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
                        onSubmit={handleSubmit}
                     >
                        <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                           Forgot Password
                        </h3>
                        <p className="mb-4 text-gray-500">
                           Enter your email to reset your password
                        </p>
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
                           className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                        />
                        <button
                           type="submit"
                           className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900"
                        >
                           Reset Password
                        </button>
                        <p className="text-sm leading-relaxed text-gray-900">
                           Remember your password?{' '}
                           <Link
                              to={'../login'}
                              className="font-bold text-blue-900"
                           >
                              Log In
                           </Link>
                        </p>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default ForgotPassword;
