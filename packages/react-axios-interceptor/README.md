# React Axios Interceptor

A very simple axios interception solution for react

## Installation

```shell
npm install @fetch-suit/react-axios-interceptor
```

## How To Use

Create a interceptor component

```tsx
import { createInterceptorComponent } from '@fetch-suit/react-axios-interceptor';

export const TimestampInterceptor = createInterceptorComponent({
  request: {
    onFulfilled: (config) => {
      config.params = {
        _t: Date.now().toString(),
        ...config.params,
      };
      return config;
    },
  },
});

export const BearerTokenInterceptor = createInterceptorComponent({
  request: {
    onFulfilled(config) {
      config.headers = {
        'Authorization': `Bearer fake.bearer.token`,
        ...config.headers,
      };
      return config;
    },
  },
});
```

```tsx
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

export default function App() {
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
```

Full example: [click here](../../example)
