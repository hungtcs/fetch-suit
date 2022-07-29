import { Fetch } from '@fetch-suit/fetch-interceptor';
import { PropsWithChildren } from 'react';
import { createInterceptorComponent, FetchInterceptor } from '@fetch-suit/react-fetch-interceptor';

async function timestampInterceptor(request: Request, fetch: Fetch) {
  const url = new URL(request.url);
  url.searchParams.append('_t', Date.now().toString());
  return await fetch(new Request(url.href, request));
}

// export function TimestampInterceptor(props: PropsWithChildren<{}>) {
//   return (
//     <FetchInterceptor
//       interceptors={ timestampInterceptor }>
//       {props.children}
//     </FetchInterceptor>
//   );
// }

export const TimestampInterceptor = createInterceptorComponent(timestampInterceptor);
