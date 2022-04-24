export interface Fetch {
  (input: RequestInfo, init?: RequestInit): Promise<Response>;
}

export interface Interceptor {
  (request: Request, fetch: Fetch): Promise<Response>;
}

export function applyInterceptors(fetch: Fetch, ...interceptors: Array<Interceptor>) {
  return interceptors.reduce(
    (fetch, interceptor) => {
      return async function newFetch(input: RequestInfo, init?: RequestInit) {
        const request = new Request(input, init);
        return await interceptor(request, fetch);
      }
    },
    fetch,
  );
}
