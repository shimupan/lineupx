import { useState } from 'react';

const CookiesPopup = () => {
   const [open, setOpen] = useState(true);

   return (
      <div className="fixed bottom-0 right-0 z-40">
         <div
            className={`fixed sm:right-4 bottom-20 rounded-lg bg-white shadow-2xl w-full sm:w-1/2 xl:w-1/4 max-w-[450px] overflow-hidden 
          ${
             open
                ? 'opacity-100 transform translate-x-0'
                : 'opacity-0 transform -translate-x-40'
          }`}
            style={{ transition: 'ease-in duration-200' }}
         >
            <div className="text-black">
               <div className="relative overflow-hidden px-8 pt-8">
                  <div className="absolute -top-10 -right-10 text-yellow-500">
                     <svg
                        width="120"
                        height="119"
                        viewBox="0 0 120 119"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           opacity="0.3"
                           d="M6.38128 49.1539C3.20326 32.893 13.809 17.1346 30.0699 13.9566L70.3846 6.07751C86.6455 2.89948 102.404 13.5052 105.582 29.7661L113.461 70.0808C116.639 86.3417 106.033 102.1 89.7724 105.278L49.4577 113.157C33.1968 116.335 17.4384 105.729 14.2604 89.4686L6.38128 49.1539Z"
                           fill="currentColor"
                        />
                     </svg>
                  </div>
                  <div className="text-2xl flex flex-col pb-4">
                     <small>Hello there..</small>
                     <span className="text-3xl font-bold">
                        We are the Cookies !
                     </span>
                  </div>
                  <div className="pb-4">
                     <p>
                        We use cookies to make the overall user experience alot
                        better for you! We do not store any personal information
                        about you or sell your data to any third party! Your
                        data is safe with us!
                     </p>
                  </div>
                  <span className="text-2xl font-bold">
                     Click below to accept...
                  </span>
               </div>
            </div>

            <div className="w-full flex flex-grow justify-center items-center border-t border-solid border-gray-200">
               <button
                  className="border-r border-gray-200 flex-1 px-4 py-3 text-gray-500 hover:text-white hover:bg-green-400 duration-150"
                  onClick={() => setOpen(false)}
               >
                  Necessary Cookies!
               </button>
               <button
                  className="flex-1 px-4 py-3 h-full text-gray-500 hover:text-white hover:bg-green-400 duration-150"
                  onClick={() => setOpen(false)}
               >
                  All Cookies!
               </button>
            </div>
         </div>
         <button
            className="fixed right-4 bottom-2 uppercase text-sm px-4 py-3 bg-gray-900 text-white rounded-full"
            onClick={() => setOpen(!open)}
         >
            Cookies
         </button>
      </div>
   );
};

export default CookiesPopup;
