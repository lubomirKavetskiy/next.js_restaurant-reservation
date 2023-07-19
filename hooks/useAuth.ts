import { useCallback, useContext } from 'react';
import axios from 'axios';

import { AuthenticationContext } from '@/app/context/AuthContext';

export default function useAuth() {
  const { loading, error, data, setAuthState } = useContext(
    AuthenticationContext
  );

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

  const signUp = useCallback(async () => {
    console.log('signUp');
  }, []);

  return {
    signIn,
    signUp,
  };
}
