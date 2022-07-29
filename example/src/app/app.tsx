import { Fragment } from "react";
import { AxiosInterceptorTest } from './axios';
import { FetchInterceptorsTest } from './fetch';

export default function App() {
  return (
    <Fragment>
      <FetchInterceptorsTest />
      {/* <AxiosInterceptorTest /> */}
    </Fragment>
  );
}
