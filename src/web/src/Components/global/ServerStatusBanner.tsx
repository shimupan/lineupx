import React from 'react';
import { useServerStatus } from '../../Pages/ServerStatus/ServerStatusContext';

const ServerStatusBanner: React.FC = () => {
   const { isOnline } = useServerStatus();

   if (isOnline) return null;

   return (
      <div className="bg-red-500 text-white text-center py-2 px-4 fixed top-0 left-0 right-0 z-50">
         Server is currently offline. We are working to resolve the issue.
      </div>
   );
};

export default ServerStatusBanner;
