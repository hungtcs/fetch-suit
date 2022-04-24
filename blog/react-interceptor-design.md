# 关于 React Fetch 拦截器的设计

`fetch()` 是 [Fetch API] 中提供的一种简单、合理的网络异步资源获取方法。
这种功能以前是使用 `XMLHttpRequest` 实现的，但是现在 Fetch 提供了一个更理想的替代方案。（关于 fetch 方法的介绍，MDN上面有[详细的介绍][Fetch API]）

Web中的拦截器（Interceptor）是一种对 HTTP 请求进行 统一处理 的设计方式。

例如，通过拦截器，我们可以统一添加 JWT token 到 Request 的请求头中，而不用每一个请求都单独配置；再如，通过拦截器，我们可以统一处理 HTTP 错误，监测到 401 响应码的时候 自动跳转到登录页面。

## 如何实现 Fetch 拦截器

一个合格的拦截器需要有以下特点：

1. 可以拦截特性范围内的请求，而是不直接污染全局的 fetch 方法
2. 支持灵活的组合多个拦截器
3. 需要同时支持对 Request 和 Response 的处理

实现拦截器最合适的是洋葱模型，这也符合拦截器 先进后出 的顺序要求。

我们首先来对拦截器进行类型定义：

```ts
export interface Interceptor {
  (request: Request, fetch: Fetch): Promise<Response>;
}
```

上面的定义中，`Interceptor` 方法接受两个参数，分别是 `request`  和 `fetch`。

`request` 是从上一个 拦截器 而来的 Request 对象，根据需求，我们可以首先对此对象进行修改，比如添加 Headers 等；然后，将新的 request 对象传入 `fetch` 方法，`fetch` 方法将返回一个 Response 对象；接下来，我们可以根据需要对 Response 对象进行修改，最后返回出去。

让我们来实现一个简单的拦截器，此拦截器有两个功能，一是自动添加时间戳到url，二是自动解析返回的json数据，免去后续调用 response.json() 的动作，具体实现方式是：

```ts
async function demoInterceptor(
    request: Request, fetch: Fetch): Promise<Response> {
  const url = new URL(request.url);
  url.searchParams.append('_t', Date.now().toString());

  const response = await fetch(new Request(url.href, request));

  const contentType = response.headers.get('content-type');
  if (contentType.startsWith('application/json')) {
    const data = await response.clone().json();
    response.data = data;
  }
  return response;
}
```

接下来我们考虑如何使用上述拦截器包裹 fetch 方法，假设我们如下定义，
每次调用 `applyInterceptor` 都会返回一个新的 `fetch` 方法，
这个新的方法在使用和定义上和原本的 `fetch` 方法没有任何区别，只是它已经被拦截器包裹了。

```ts
function applyInterceptor(fetch: Fetch, interceptor: Interceptor): Fetch {
  return async function newFetch(input: RequestInfo, init?: RequestInit) {
    const request = new Request(input, init);
    return await interceptor(request, fetch);
  }
}
```

使用 `applyInterceptor` 将上面的拦截器应用：

```ts
const fetch1 = applyInterceptor(window.fetch, demoInterceptor);
```

让我们再创建一个拦截器，功能是自动添加一个时间戳到请求头中：

```ts
async function demo2Interceptor(
    request: Request, fetch: Fetch): Promise<Response> {
  request.headers.append('_t', Date.now().toString);
  return await fetch(request);
}
```

这一次我们无需对响应做任何处理，所以直接返回即可。将此拦截器继续应用到 `fetch1`，然后我们得到了 `fetch2`：

```ts
const fetch2 = applyInterceptor(fetch1, demoInterceptor);
```

上面的两个 fetch 方法，fetch1 的请求会通过一个拦截器，而 fetch2 的请求会通过两个拦截器。

## React 的封装

React 使用 JSX 作为数据和结构的载体，如果我们的拦截器可以和JSX完美结合起来，那就太棒了！

在 React 中，针对跨多级组件传值，`Context` 是一个很好的解决方案。
我们这里，需要跨多级组件共享的是被拦截器附魔了的 `fetch` 方法。
首先创建一个 `Context`，默认值是 `window.fetch`，这是原生的 `fetch` 方法。

```ts
import { Fetch } from '@fetch-suit/fetch-interceptor';
import { createContext } from 'react';

export const FetchContext = createContext<Fetch>(window.fetch);
```

接着创建一个 `FetchInterceptor` 组建，它的作用是应用拦截器并将新的 fetch 方法传递给它的子孙后代。

```tsx
export interface FetchInterceptorProps {
  interceptors: Interceptor | Array<Interceptor>;
}

export function FetchInterceptor(props: PropsWithChildren<FetchInterceptorProps>) {
  const { children, interceptors: _interceptors } = props;
  const interceptors = Array.isArray(_interceptors) ? _interceptors : [_interceptors];
  const fetch = useContext(FetchContext);
  const newFetch = applyInterceptors(fetch, ...interceptors);
  return (<FetchContext.Provider value={newFetch}>{ children }</FetchContext.Provider>);
}
```

这样，只要被 `FetchInterceptor` 包裹的组建，都可以通过 `FetchContext` 来获取到被拦截器附魔的 `fetch` 方法了。

虽然上面的实现很简单，但是它可以实现非常灵活的拦截策略，下面的例子中，
Component1 只受到 TimestampInterceptor 的影响，但是 Component2 同时受到 TimestampInterceptor 和 BearerTokenInterceptor 的影响。

```tsx
<TimestampInterceptor>
  <BearerTokenInterceptor>
    <Component2 />
  </BearerTokenInterceptor>
  <Component1 />
</TimestampInterceptor>
```

这是一个非常 react 的 React 拦截器！

上述代码托管于 <https://github.com/hungtcs/fetch-suit>，NPM 包地址分别是：

- [@fetch-suit/fetch-interceptor](https://www.npmjs.com/package/@fetch-suit/fetch-interceptor)
- [@fetch-suit/react-fetch-interceptor](https://www.npmjs.com/package/@fetch-suit/react-fetch-interceptor)

[Fetch API]: https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API

---

[hungtcs](https://github.com/hungtcs) 发表于 2022年04月24日。未经作者授权，禁止转载。
