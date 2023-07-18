import axios from 'axios';
import { useCallback } from 'react';

export default function useAuth() {
  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/auth/signin',
          {
            email,
            password,
          }
        );

        console.log({ response });
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const signUp = useCallback(async () => {
    console.log('signUp');
  }, []);

  return {
    signIn,
    signUp,
  };
}
