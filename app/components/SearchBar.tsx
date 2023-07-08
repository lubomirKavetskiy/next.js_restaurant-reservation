'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';

const INIT_LOCATION = '';

export default function SearchBar() {
  const router = useRouter();
  // const search = useSearchParams();
  // const [location, setLocation] = useState(search?.get('city') || '');
  const [location, setLocation] = useState(INIT_LOCATION);

  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
      <input
        className="rounded  mr-3 p-2 w-[450px]"
        type="text"
        placeholder="State, city or town"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        className="rounded bg-red-600 px-9 py-2 text-white"
        onClick={() => {
          if (location === '') return;
          router.push(`/search?city=${location}`);

          setLocation(INIT_LOCATION);
        }}
      >
        {`Let's go`}
      </button>
    </div>
  );
}
