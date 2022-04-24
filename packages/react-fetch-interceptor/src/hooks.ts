import { useContext } from 'react';
import { FetchContext } from './context.js';

export function useFetch() {
  const fetch = useContext(FetchContext);
  return fetch;
}
