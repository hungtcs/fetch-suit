import React from "react";
import { useFetch } from '@fetch-suit/react-fetch-interceptor';
import { TimestampInterceptor } from './interceptors';
import { BearerTokenInterceptor } from './interceptors';
import { PropsWithChildren, useEffect } from "react";

function FetchTest(props: PropsWithChildren<{ url: string }>) {
  const fetch = useFetch();

  useEffect(
    () => {
      const controller = new AbortController();
      fetch(props.url, { signal: controller.signal })
        .then(response => {})
        .catch(err => console.log(err));
      return () => controller.abort();
    },
    [],
  );

  return null;
}

export default function App() {
  return (
    <TimestampInterceptor>
      <BearerTokenInterceptor>
        {/* apply timestamp-interceptor and bearer-token-interceptor */}
        <FetchTest url="/test1" />
      </BearerTokenInterceptor>
      {/* only apply timestamp-interceptor */}
      <FetchTest url="/test2" />

      <p>Open devtools and view network requests</p>
    </TimestampInterceptor>
  );
}
