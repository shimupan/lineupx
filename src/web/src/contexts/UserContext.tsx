import React, { createContext, useState, useContext } from 'react';
import { UserType } from '../global.types';
import { getUserByID } from '../util/getUser';

interface UserContextType {
   users: { [key: string]: UserType };
   getUser: (userId: string) => Promise<UserType>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [users, setUsers] = useState<{ [key: string]: UserType }>({});

   const getUser = async (userId: string): Promise<UserType> => {
      if (users[userId]) {
         return users[userId];
      }

      const user = await getUserByID(userId);
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: user }));
      return user;
   };

   return (
      <UserContext.Provider value={{ users, getUser }}>
         {children}
      </UserContext.Provider>
   );
};

export const useUser = () => {
   const context = useContext(UserContext);
   if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
   }
   return context;
};
