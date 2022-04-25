import React from 'react';
import { PropsWithChildren } from 'react';
import { Fetch } from '@fetch-suit/fetch-interceptor';
import { FetchInterceptor } from '@fetch-suit/react-fetch-interceptor';

async function bearerTokenInterceptor(request: Request, fetch: Fetch) {
  request.headers.append('Authorization', `Bearer fake.bearer.token`);
  return await fetch(request);
}

export function BearerTokenInterceptor(props: PropsWithChildren<{}>) {
  return (
    <FetchInterceptor
      interceptors={ [bearerTokenInterceptor] }>
      {props.children}
    </FetchInterceptor>
  );
}
