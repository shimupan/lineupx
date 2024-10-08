import { useEffect, useState, useCallback, useRef } from 'react';
import { UserType } from '../global.types';
import { getUsersByIDs } from '../util/getUser';

const useUserCache = () => {
   const [userCache, setUserCache] = useState<Record<string, UserType>>({});
   const userCacheRef = useRef(userCache);
   const fetchingUsers = useRef<Set<string>>(new Set());

   useEffect(() => {
      userCacheRef.current = userCache;
   }, [userCache]);

   const fetchUsers = useCallback(async (userIds: string[]) => {
      const uniqueUserIds = [...new Set(userIds)];
      const usersToFetch = uniqueUserIds.filter(
         (id) => !userCacheRef.current[id] && !fetchingUsers.current.has(id),
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
   }, []);

   return { userCache, fetchUsers };
};

export default useUserCache;
