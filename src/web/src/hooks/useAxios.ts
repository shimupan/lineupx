import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

type Response<T> = [T | null, boolean, any];

function useAxios<T = any>(options: AxiosRequestConfig): Response<T> {
   const [response, setResponse] = useState<T | null>(null);
   const [error, setError] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setIsLoading(true);
         try {
            const res: AxiosResponse<T> = await axios(options);
            setResponse(res.data);
         } catch (error) {
            setError(error);
         }
         setIsLoading(false);
      };

      fetchData();
   }, [options]);

   return [response, isLoading, error];
}

export default useAxios;
