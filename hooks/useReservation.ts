import axios from 'axios';
import { useState } from 'react';

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    day,
    time,
    partySize,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequests,
  }: {
    slug: string;
    day: string;
    time: string;
    partySize: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion?: string;
    bookerRequests?: string;
  }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        {
          bookerFirstName,
          bookerLastName,
          bookerPhone,
          bookerEmail,
          bookerOccasion,
          bookerRequests,
        },
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      setError(error.response.data.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createReservation,
  };
}
