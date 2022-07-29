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
