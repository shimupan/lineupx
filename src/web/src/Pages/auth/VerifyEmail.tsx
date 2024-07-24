import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, SideNavWrapper, BottomNav } from '../../Components';
import { ToastContainer, toast } from 'react-toastify';
import useIsMobile from '../../hooks/isMobile';

const VerifyEmail: React.FC = () => {
   const isMobile = useIsMobile();
   const [verificationCode, setVerificationCode] = useState<string>('');
   const navigate = useNavigate();
   const location = useLocation();
   const query = new URLSearchParams(location.search);
   const userId = query.get('userId');

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const id = toast.loading('Verifying Email...');

      try {
         await axios.post(`/verifyemail/${userId}`, {
            verificationCode,
         });

         toast.update(id, {
            render: 'Email verification successful!',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            hideProgressBar: false,
         });

         navigate('/login');
      } catch (error) {
         if (axios.isAxiosError(error)) {
            console.error('Email verification error:', error.response?.data);

            toast.update(id, {
               render: 'Email verification failed. Please try again.',
               type: 'error',
               isLoading: false,
               autoClose: 1000,
               hideProgressBar: false,
            });
         } else {
            console.error('Unexpected error:', error);

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
                           Verify Email
                        </h3>
                        <p className="mb-4 text-gray-500">
                           Enter your verification code
                        </p>
                        <label
                           htmlFor="verificationCode"
                           className="mb-2 text-sm text-start text-gray-900"
                        >
                           Verification Code*
                        </label>
                        <input
                           id="verificationCode"
                           type="text"
                           placeholder="Enter verification code"
                           value={verificationCode}
                           onChange={(e) => setVerificationCode(e.target.value)}
                           className="flex text-black items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                        />
                        <button
                           type="submit"
                           className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900"
                        >
                           Submit
                        </button>
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

export default VerifyEmail;
