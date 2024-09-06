import { useState, useCallback, useRef } from 'react';
import { UserType } from '../global.types';
import { getUsersByIDs } from '../util/getUser';

const useUserCache = () => {
   const [userCache, setUserCache] = useState<Record<string, UserType>>({});
   const fetchingUsers = useRef<Set<string>>(new Set());

   const fetchUsers = useCallback(
      async (userIds: string[]) => {
         const uniqueUserIds = [...new Set(userIds)];
         const usersToFetch = uniqueUserIds.filter(
            (id) => !userCache[id] && !fetchingUsers.current.has(id),
         );

         if (usersToFetch.length > 0) {
            usersToFetch.forEach((id) => fetchingUsers.current.add(id));
            try {
               const newUsers = await getUsersByIDs(usersToFetch);
               const newUsersRecord = newUsers.reduce(
                  (acc: Record<string, UserType>, user: UserType) => {
                     acc[user._id] = user;
                     return acc;
                  },
                  {},
               );

               setUserCache((prevCache) => ({
                  ...prevCache,
                  ...newUsersRecord,
               }));
            } catch (error) {
               console.error('Error fetching users:', error);
            } finally {
               usersToFetch.forEach((id) => fetchingUsers.current.delete(id));
            }
         }
      },
      [userCache],
   );

   return { userCache, fetchUsers };
};

export default useUserCache;
