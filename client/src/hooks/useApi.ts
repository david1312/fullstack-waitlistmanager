import { useState, useCallback } from 'react';
import axiosInstance from '@/utils/axios';
import { APIResponse } from '@/types/api'; // Adjust the import path as necessary
import axios from 'axios';

const useApi = <T, B = unknown>() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<APIResponse<T> | null>(null);

  const fetchData = useCallback(
    async (
      url: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      body?: B,
    ) => {
      setLoading(true);
      setResponse(null); // Reset response before fetching

      try {
        const res = await axiosInstance({
          method,
          url,
          ...(method !== 'GET' && method !== 'DELETE' && { data: body }), // Include body only for non-GET methods
        });

        setResponse({ isSuccess: true, data: res.data || null });
      } catch (err: unknown) {
        console.log({ err });
        const isAxiosError = axios.isAxiosError(err);

        setResponse({
          isSuccess: false,
          error: isAxiosError ? err.response?.data?.error : 'Unknown error',
          errorCode: isAxiosError ? err.response?.data?.errorCode : '',
        });
      } finally {
        setLoading(false); // Ensure loading is false whether success or failure
      }
    },
    [],
  );

  return { loading, response, fetchData };
};

export default useApi;
