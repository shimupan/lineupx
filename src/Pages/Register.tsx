import React, { useState, FormEvent } from 'react';
import axios from 'axios'; // Ensure Axios is installed
import { Link } from 'react-router-dom';
import { Header, SideNav, SideNavItems } from '../Components';

import { MdOutlineSettings,  MdOutlineGamepad, MdHome } from "react-icons/md";

const Register: React.FC = () => {
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (password !== passwordConfirmation) {
         alert('Passwords do not match');
         return;
      }

      try {
         const response = await axios.post('/register', { email, password });
         console.log(response.data);
         // Redirect to login or another page upon successful registration
      } catch (error) {
         if (axios.isAxiosError(error)) {
            console.error('Registration error:', error.response?.data);
         } else {
            console.error('Unexpected error:', error);
         }
      }
   };

   return (
   <>
      <Header />
      <SideNav>
         <SideNavItems icon={<MdHome size={25} />} text="Home" active />
         <SideNavItems icon={<MdOutlineGamepad size={25} />} text=" CS 2" />
         <SideNavItems icon={<MdOutlineGamepad size={25} />} text="Valorant" />
         <SideNavItems icon={<MdOutlineSettings size={25} />} text="Settings" alert />
      </SideNav>
      <div className="h-screen md:h-full md:w-1/2 lg:w-1/3 container flex flex-col mx-auto bg-white rounded-lg md:pt-12 md:my-5">
         <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
            <div className="flex items-center justify-center w-full lg:p-12">
               <div className="flex items-center xl:p-10">
                  <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl" onSubmit={handleSubmit}>
                     <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                        Sign Up
                     </h3>
                     <p className="mb-4 text-gray-500">
                        Enter your email and password
                     </p>
                     <div className="flex items-center mb-3"></div>
                     <label htmlFor="email" className="mb-2 text-sm text-start text-gray-900">
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
                     <label htmlFor="password" className="mb-2 text-sm text-start text-gray-900">
                        Password*
                     </label>
                     <input
                        id="password"
                        type="password"
                        placeholder="Enter a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                     />
                     <label htmlFor="passwordConfirmation" className="mb-2 text-sm text-start text-gray-900">
                        Confirm your Password*
                     </label>
                     <input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Confirm password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                     />
                     <button type="submit" className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900">
                        Sign Up
                     </button>
                     <p className="text-sm leading-relaxed text-gray-900">
                        Have an account?{" "}
                        <Link to={"../login"} className='font-bold text-blue-900'>
                           Login In
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

export default Register;
