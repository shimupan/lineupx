import { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

type AxiosReturn<T> = {
   response: AxiosResponse<T> | null;
   error: Error | null;
   loading: boolean;
};

export default function useAxios<T = any>(config: AxiosRequestConfig): AxiosReturn<T> {
   const [response, setResponse] = useState<AxiosResponse<T> | null>(null);
   const [error, setError] = useState<AxiosError | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const res = await axios(config);
            setResponse(res);
         } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [config]);

   return { response, error, loading };
}
