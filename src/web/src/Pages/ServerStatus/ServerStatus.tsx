import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../../Components';

const ServerStatus: React.FC = () => {
   const [status, setStatus] = useState<string>('Checking...');
   const [lastChecked, setLastChecked] = useState<Date | null>(null);

   const checkServerStatus = async () => {
      try {
         await axios.get('/health');
         setStatus('Online');
         setLastChecked(new Date());
      } catch (error) {
         setStatus('Offline');
         setLastChecked(new Date());
      }
   };

   useEffect(() => {
      checkServerStatus();
      const interval = setInterval(checkServerStatus, 60000); // Check every minute
      return () => clearInterval(interval);
   }, []);

   return (
      <>
         <Layout>
         <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
               <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
                  Server Status Monitor
               </h1>
               <div className="flex flex-col items-center mb-8">
                  <div
                     className={`w-32 h-32 rounded-full flex items-center justify-center ${
                        status === 'Online' ? 'bg-green-100' : 'bg-red-100'
                     }`}
                  >
                     <span
                        className={`text-5xl ${
                           status === 'Online'
                              ? 'text-green-500'
                              : 'text-red-500'
                        }`}
                     >
                        {status === 'Online' ? '✓' : '✗'}
                     </span>
                  </div>
                  <h2
                     className={`text-3xl font-semibold mt-4 ${
                        status === 'Online' ? 'text-green-500' : 'text-red-500'
                     }`}
                  >
                     {status}
                  </h2>
               </div>
               <div className="text-center mb-8">
                  <p className="text-gray-600">
                     Last checked:{' '}
                     {lastChecked ? lastChecked.toLocaleString() : 'Never'}
                  </p>
               </div>
               <div className="flex justify-center">
                  <button
                     onClick={checkServerStatus}
                     className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                     Check Now
                  </button>
               </div>
            </div>
         </div>
         </Layout>
      </>
   );
};

export default ServerStatus;
