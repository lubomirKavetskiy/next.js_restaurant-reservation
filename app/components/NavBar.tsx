'use client';
import { useContext } from 'react';
import Link from 'next/link';

import AuthModal from './AuthModal';

import { AuthenticationContext } from '../context/AuthContext';
import useAuth from '@/hooks/useAuth';

export default function NavBar() {
  const { loading, data } = useContext(AuthenticationContext);
  const { signOut } = useAuth();

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>

      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <button
                onClick={signOut}
                className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
              >
                Sign out
              </button>
            ) : (
              <>
                <AuthModal isSignIn />
                <AuthModal />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
