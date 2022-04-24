# Fetch Interceptor

## How To Use

First install @fetch-suit/fetch-interceptor via npm or yarn:

```shell
npm i @fetch-suit/fetch-interceptor
```

Implement an interception, the interceptor looks like this:

```ts
async function interceptor(request: Request, fetch: Fetch) {
  // before request
  const response = await fetch(request);
  // after response
  return response;
}
```

Use the `applyInterceptors` method to apply the interceptors.
the following code, `fetch1` will apply timestamp interceptor, and `fetch2` both apply timestamp interceptor and bearer token header interceptor.

```ts
import { applyInterceptors } from '@fetch-suit/fetch-interceptor';

const fetch1 = applyInterceptors(
  window.fetch,
  // add timestamp
  async (request: Request, fetch: Fetch) => {
    const url = new URL(request.url);
    url.searchParams.append('_t', Date.now().toString());
    return await fetch(new Request(url.href, request));
  },
);

const fetch2 = applyInterceptors(
  fetch1,
  // add bearer token header
  async (request: Request, fetch: Fetch) => {
    request.headers.append('Authorization', `Bearer xxx.xxx.xxx`);
    return await fetch(request);
  },
);
```
