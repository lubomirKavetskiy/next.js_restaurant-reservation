'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import useReservation from '@/hooks/useReservation';
import { CircularProgress } from '@mui/material';

interface IProps {
  slug: string;
  date: string;
  partySize: string;
}

export default function Form({ slug, date, partySize }: IProps) {
  const [inputs, setInputs] = useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequests: '',
  });

  const [isDisabled, setDisabled] = useState(true);
  const [day, time] = date.split('T');
  const { error, loading, createReservation } = useReservation();

  useEffect(() => {
    if (
      inputs.bookerEmail &&
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerPhone
    ) {
      return setDisabled(false);
    } else {
      return setDisabled(true);
    }
  }, [inputs]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const booking = await createReservation({
      slug,
      time,
      day,
      partySize,
      ...inputs,
    });
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="First name"
        name="bookerFirstName"
        value={inputs.bookerFirstName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Last name"
        name="bookerLastName"
        value={inputs.bookerLastName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Phone number"
        name="bookerPhone"
        value={inputs.bookerPhone}
        onChange={handleInputChange}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Email"
        name="bookerEmail"
        value={inputs.bookerEmail}
        onChange={handleInputChange}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Occasion (optional)"
        name="bookerOccasion"
        value={inputs.bookerOccasion}
        onChange={handleInputChange}
      />
      <input
        type="text"
        className="border rounded p-3 w-80 mb-4"
        placeholder="Requests (optional)"
        name="bookerRequests"
        value={inputs.bookerRequests}
        onChange={handleInputChange}
      />
      <button
        disabled={isDisabled || loading}
        onClick={handleSubmit}
        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          'Complete reservation'
        )}
      </button>
      <p className="mt-4 text-sm">
        By clicking “Complete reservation” you agree to the OpenTable Terms of
        Use and Privacy Policy. Standard text message rates may apply. You may
        opt out of receiving text messages at any time.
      </p>
    </div>
  );
}
