import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory

const ServerStatusBanner: React.FC = () => {
   const [status, setStatus] = useState<string>('Checking server status...');
   const [lastChecked, setLastChecked] = useState<Date | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const navigate = useNavigate();

   const checkServerStatus = async () => {
      try {
         await axios.get('/health');
         setStatus('Server is online.');
         setIsLoading(false);
      } catch (error) {
         setStatus(
            'Server is currently offline. We are working to resolve the issue.',
         );
         setIsLoading(false);
      } finally {
         setLastChecked(new Date());
      }
   };

   useEffect(() => {
      checkServerStatus();
      const interval = setInterval(checkServerStatus, 60000); // Check every minute
      return () => clearInterval(interval);
   }, []);

   const navigateToServerStatus = () => {
      navigate('/server-status');
   };

   if (status === 'Server is online.' || isLoading) return null;

   return (
      <div
         className="bg-gradient-to-r from-blue-500 to-blue-300 text-white text-center py-3 px-6 fixed top-0 left-0 right-0 z-50 shadow-lg cursor-pointer"
         onClick={navigateToServerStatus}
      >
         <p className="font-semibold text-lg">{status}</p>
         <p className="text-sm mt-1">
            Last checked:{' '}
            {lastChecked ? lastChecked.toLocaleString() : 'Checking...'}
         </p>
      </div>
   );
};

export default ServerStatusBanner;
