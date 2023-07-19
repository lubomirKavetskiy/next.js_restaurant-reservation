'use client';

import {
  ReactNode,
  useState,
  createContext,
  useEffect,
  useCallback,
} from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';

const INIT_STATE = {
  loading: true,
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

  const fetchUser = useCallback(async () => {
    setAuthState({ loading: true, error: null, data: null });
    try {
      const jwt = getCookie('jwt');

      if (!jwt) {
        return setAuthState({ loading: false, error: null, data: null });
      } else {
        const response = await axios.get('http://localhost:3000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

        return setAuthState({
          loading: false,
          error: null,
          data: response.data,
        });
      }
    } catch (error: any) {
      setAuthState({
        loading: false,
        error: error.response.data.errorMessage,
        data: null,
      });
    }
  }, [setAuthState]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
