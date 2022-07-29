import { createInterceptorComponent } from '@fetch-suit/react-axios-interceptor';

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
