// ServerStatusContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

interface ServerStatusContextType {
   isOnline: boolean;
   lastChecked: Date | null;
}

const ServerStatusContext = createContext<ServerStatusContextType>({
   isOnline: true,
   lastChecked: null,
});

export const ServerStatusProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [isOnline, setIsOnline] = useState(true);
   const [lastChecked, setLastChecked] = useState<Date | null>(null);

   const checkServerStatus = async () => {
      try {
         await axios.get('/health');
         setIsOnline(true);
      } catch (error) {
         setIsOnline(false);
      }
      setLastChecked(new Date());
   };

   useEffect(() => {
      checkServerStatus();
      const interval = setInterval(checkServerStatus, 60000); // Check every minute
      return () => clearInterval(interval);
   }, []);

   return (
      <ServerStatusContext.Provider value={{ isOnline, lastChecked }}>
         {children}
      </ServerStatusContext.Provider>
   );
};

// Export the hook
export const useServerStatus = () => useContext(ServerStatusContext);
