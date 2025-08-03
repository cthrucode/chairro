'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SelectRolePage() {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [router])

  async function handleSelectRole(role: 'host' | 'professional') {
    if (!userId) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

      if (error) throw error

      router.push('/')
    } catch (err: any) {
      console.error(err)
      alert('Error setting role: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4 text-center">
      <h1 className="text-2xl font-bold">Choose Your Role</h1>
      <p className="text-gray-600 max-w-md">
        Are you posting chairs for rent (Host) or booking a chair to work (Professional)?
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleSelectRole('host')}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          I'm a Host
        </button>
        <button
          onClick={() => handleSelectRole('professional')}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          I'm a Professional
        </button>
      </div>
    </div>
  )
}
