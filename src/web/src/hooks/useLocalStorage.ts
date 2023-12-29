import { useState } from 'react';

function useLocalStorage<T>(
   key: string,
   initialValue: T,
): [T, (value: T) => void] {
   const readValue = (): T => {
      if (typeof window === 'undefined') {
         return initialValue;
      }

      try {
         const item = window.localStorage.getItem(key);
         return item ? JSON.parse(item) : initialValue;
      } catch (error) {
         console.warn(`Error reading localStorage key “${key}”:`, error);
         return initialValue;
      }
   };

   const [storedValue, setStoredValue] = useState<T>(readValue);

   const setValue = (value: T) => {
      if (typeof window == 'undefined') {
         console.warn(
            `Tried setting localStorage key “${key}” even though environment is not a client`,
         );
      }

      try {
         const newValue =
            value instanceof Function ? value(storedValue) : value;

         window.localStorage.setItem(key, JSON.stringify(newValue));

         setStoredValue(newValue);

         window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
         console.warn(`Error setting localStorage key “${key}”:`, error);
      }
   };

   return [storedValue, setValue];
}

export default useLocalStorage;
