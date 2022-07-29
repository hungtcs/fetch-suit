import { createContext } from 'react';
import { AxiosRequestConfig } from 'axios';

type onFulfilled<D = any> = (value: AxiosRequestConfig<D>) => AxiosRequestConfig<D> | Promise<AxiosRequestConfig<D>>;
type onRejected = ((error: unknown) => unknown) | undefined;

export type Interceptor = {
  request?: {
    onFulfilled?: onFulfilled,
    onRejected?: onRejected,
  },
  response?: {
    onFulfilled?: onFulfilled,
    onRejected?: onRejected,
  },
};

export interface AxiosConfigContextPayload {
  interceptors?: Array<Interceptor>;
}

export const AxiosConfigContext = createContext<AxiosConfigContextPayload>({});
