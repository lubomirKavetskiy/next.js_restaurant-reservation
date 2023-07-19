import { useCallback, useContext } from 'react';
import axios from 'axios';

import { AuthenticationContext } from '@/app/context/AuthContext';

export default function useAuth() {
  const { setAuthState } = useContext(AuthenticationContext);

  const signIn = useCallback(
    async (
      { email, password }: { email: string; password: string },
      cb?: () => void
    ) => {
      setAuthState({ loading: true, error: null, data: null });

      try {
        const response = await axios.post(
          'http://localhost:3000/api/auth/signin',
          {
            email,
            password,
          }
        );

        setAuthState({ loading: false, error: null, data: response.data });
        cb!();
      } catch (error: any) {
        setAuthState({
          loading: false,
          error: error.response.data.errorMessage,
          data: null,
        });
      }
    },
    [setAuthState]
  );

  const signUp = useCallback(
    async (
      {
        firstName,
        lastName,
        email,
        password,
        city,
        phone,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        city: string;
        phone: string;
      },
      cb?: () => void
    ) => {
      setAuthState({ loading: true, error: null, data: null });

      try {
        const response = await axios.post(
          'http://localhost:3000/api/auth/signup',
          {
            firstName,
            lastName,
            email,
            password,
            city,
            phone,
          }
        );

        setAuthState({ loading: false, error: null, data: response.data });
        cb!();
      } catch (error: any) {
        setAuthState({
          loading: false,
          error: error.response.data.errorMessage,
          data: null,
        });
      }
    },
    [setAuthState]
  );

  return {
    signIn,
    signUp,
  };
}
