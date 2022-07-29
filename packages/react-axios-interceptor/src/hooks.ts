import { AxiosConfigContext } from './context.js';
import { useContext, useMemo } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export function useAxios<D = any>(config?: AxiosRequestConfig<D>) {
  const { interceptors = [] } = useContext(AxiosConfigContext);

  const instance = useMemo(
    () => {
      const instance = axios.create(config);

      for (const interceptor of interceptors) {
        const { request, response } = interceptor;
        instance.interceptors.request.use(request?.onFulfilled, request?.onRejected);
        instance.interceptors.response.use(response?.onFulfilled, response?.onRejected);
      }

      return instance;
    },
    [interceptors, config],
  );

  return instance;
}
