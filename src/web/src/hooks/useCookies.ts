import { useCallback, useState } from 'react';
import Cookies from 'universal-cookie';

export default function useCookie(name: string, defaultValue: any) {
   const cookies = new Cookies();
   const [value, setValue] = useState(() => {
      const cookie = cookies.get(name);
      if (cookie) return cookie;
      cookies.set(name, defaultValue);
      return defaultValue;
   });

   const updateCookie = useCallback(
      (newValue: any, options?: object) => {
         cookies.set(name, newValue, options);
         setValue(newValue);
      },
      [name],
   );

   const deleteCookie = useCallback(() => {
      cookies.remove(name);
      setValue(null);
   }, [name]);

   return [value, updateCookie, deleteCookie];
}
