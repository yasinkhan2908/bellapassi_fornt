'use client';

import { Provider } from 'react-redux';
import { store } from '../lib/store';
import SessionSync from "@/components/SessionSync";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><SessionSync />{children}</Provider>;
}


