import { useAxios } from '@fetch-suit/react-axios-interceptor';
import { PropsWithChildren, useEffect } from 'react';
import { BearerTokenInterceptor, TimestampInterceptor } from './interceptors';

function AxiosTest(props: PropsWithChildren<{ url: string }>) {
  const axios = useAxios();

  useEffect(
    () => {
      const controller = new AbortController();
      axios.get(props.url, { signal: controller.signal })
        .then(response => {})
        .catch(err => console.log(err));
      return () => controller.abort();
    },
    [axios],
  );

  return null;
}

export function AxiosInterceptorTest() {
  return (
    <TimestampInterceptor>
      <AxiosTest url='/test1' />
      <AxiosTest url='/test3' />
      <BearerTokenInterceptor>
        <AxiosTest url='/test2' />
      </BearerTokenInterceptor>
    </TimestampInterceptor>
  );
}
