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
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.error
          : 'Unknown error';

        setResponse({ isSuccess: false, error: errorMessage });
      } finally {
        setLoading(false); // Ensure loading is false whether success or failure
      }
    },
    [],
  );

  return { loading, response, fetchData };
};

export default useApi;
