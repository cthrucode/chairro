'use client';

import Link from 'next/link';
import { useSession } from '@/lib/SupabaseProvider';
import { supabase } from '@/lib/supabaseClient';

export default function AuthButton() {
  const { user, loading, signOut } = useSession();

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {/* Profile link */}
        <Link
          href={`/profile/${user.id}`}
          className="text-sm font-medium hover:underline"
        >
          Profile
        </Link>

        {/* Sign out button */}
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/auth/callback` },
        })
      }
      className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
    >
      Login
    </button>
  );
}
