# React Fetch Interceptor

A very simple fetch interception solution for react

## Installation

```shell
npm install @fetch-suit/fetch-interceptor @fetch-suit/react-fetch-interceptor
```

## How To Use

Create a interceptor component

```tsx
import React from 'react';
import { PropsWithChildren } from 'react';
import { FetchInterceptor, Fetch } from '@fetch-suit/react-fetch-interceptor';

async function bearerTokenInterceptor(request: Request, fetch: Fetch) {
  request.headers.append('Authorization', `Bearer fake.bearer.token`);
  return await fetch(request);
}

export const BearerTokenInterceptor = createInterceptorComponent(bearerTokenInterceptor);

// createInterceptorComponent equivalent to
export function BearerTokenInterceptor(props: PropsWithChildren<{}>) {
  return (
    <FetchInterceptor
      interceptors={ [bearerTokenInterceptor] }>
      {props.children}
    </FetchInterceptor>
  );
}
```

```tsx
import React from "react";
import { useFetch } from '@fetch-suit/react-fetch-interceptor';
import { useEffect } from "react";
import { BearerTokenInterceptor } from './interceptors';

function FetchTest() {
  // use the intercepted fetch method instead of `window.fetch`
  const fetch = useFetch();

  useEffect(
    () => {
      const controller = new AbortController();
      fetch('/', { signal: controller.signal })
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
    <BearerTokenInterceptor>
      {/* apply bearer-token-interceptor */}
      <FetchTest />
    </BearerTokenInterceptor>
  );
}
```

Full example: [click here](../../example)
