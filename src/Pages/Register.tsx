import { Link } from 'react-router-dom';

const Register = () => {

   // TODO: Add form Verification
   // add backend call after Register

   return (
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
         <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
         <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
               <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
               <h3 className="mb-3 text-4xl font-extrabold text-blue-900">
                  Sign Up
               </h3>
               <p className="mb-4 text-gray-500">
                  Enter your email and password
               </p>
               <div className="flex items-center mb-3"></div>
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
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
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
                  className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
               />
               <label
                  htmlFor="passwordConfirmation"
                  className="mb-2 text-sm text-start text-gray-900"
               >
                  Comfirm your Password*
               </label>
               <input
                  id="passwordConfirmation"
                  type="password"
                  placeholder="Enter a password"
                  className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
               />
               <div className="flex flex-row justify-between mb-8">
                  <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                     <input
                     type="checkbox"
                     checked
                     value=""
                     className="sr-only peer"
                     />
                  </label>
               </div>
               <button className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-900">
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
   );
};

export default Register;
