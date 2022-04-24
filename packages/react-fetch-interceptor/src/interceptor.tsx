import { FetchContext } from './context.js';
import { useContext, PropsWithChildren } from 'react';
import { applyInterceptors, Interceptor } from '@fetch-suit/fetch-interceptor';

export interface FetchInterceptorProps {
  interceptors: Interceptor | Array<Interceptor>;
}

export function FetchInterceptor(props: PropsWithChildren<FetchInterceptorProps>) {
  const { children, interceptors: _interceptors } = props;
  const interceptors = Array.isArray(_interceptors) ? _interceptors : [_interceptors];
  const fetch = useContext(FetchContext);
  const newFetch = applyInterceptors(fetch, ...interceptors);
  return (<FetchContext.Provider value={newFetch}>{ children }</FetchContext.Provider>);
}
