'use client'

import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Chairro</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Sign in with Google
      </button>
    </div>
  )
}
