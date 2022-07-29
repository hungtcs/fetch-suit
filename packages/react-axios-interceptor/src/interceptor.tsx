import { useContext, PropsWithChildren } from 'react';
import { AxiosConfigContext, Interceptor } from './context.js';

export interface AxiosInterceptorProps {
  interceptors: Interceptor | Array<Interceptor>;
}

export function AxiosInterceptor(props: PropsWithChildren<AxiosInterceptorProps>) {
  const { children, interceptors: _interceptors } = props;
  const interceptors = Array.isArray(_interceptors) ? _interceptors : [_interceptors];
  const { interceptors: upperInterceptors = [] } = useContext(AxiosConfigContext);

  return (
    <AxiosConfigContext.Provider
      value={{ interceptors: [...upperInterceptors, ...interceptors] }}>
      { children }
    </AxiosConfigContext.Provider>
  );
}

export function createInterceptorComponent(interceptors: Interceptor | Array<Interceptor>) {
  return function Interceptor(props: PropsWithChildren<{}>) {
    return (<AxiosInterceptor interceptors={interceptors}>{props.children}</AxiosInterceptor>);
  }
}
