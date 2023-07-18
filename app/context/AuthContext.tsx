'use client';

import { ReactNode, useState, createContext } from 'react';

const INIT_STATE = {
  loading: false,
  error: null,
  data: null,
};

interface User {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  phone: string;
}

interface IState {
  loading: boolean;
  error: string | null;
  data: User | null;
}

interface IAuthState extends IState {
  setAuthState: (state: IState) => void;
}

export const AuthenticationContext = createContext<IAuthState>({
  ...INIT_STATE,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<IState>(INIT_STATE);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
