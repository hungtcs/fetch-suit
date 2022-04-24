import { Fetch } from '@fetch-suit/fetch-interceptor';
import { createContext } from 'react';

export const FetchContext = createContext<Fetch>(window.fetch);
