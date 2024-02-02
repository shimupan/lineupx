import { useEffect, useState } from 'react';

function getSavedValue(key: string, initialVal: any) {
   const savedValue = window.localStorage.getItem(key);
   if (savedValue !== null) return JSON.parse(savedValue);

   if (initialVal instanceof Function) return initialVal();
   return initialVal;
}

export default function useLocalStorage(key: string, initialVal: any) {
   const [value, setValue] = useState(() => {
      return getSavedValue(key, initialVal);
   });

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
   }, [value]);

   return [value, setValue]
}