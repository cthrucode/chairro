// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Fetch profile error:', error)
        return
      }

      if (!profile) {
        // Insert new profile
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata.full_name || user.email,
          email: user.email,
          role: null,
          created_at: new Date().toISOString(),
        })
        if (insertError) {
          console.error('Insert profile error:', insertError)
          return
        }
        // Redirect to choose role
        router.push('/auth/select-role')
        return
      }

      if (!profile.role) {
        router.push('/auth/select-role')
      } else {
        router.push('/')
      }
    }
    handleCallback()
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen">Loading...</div>
  )
}
