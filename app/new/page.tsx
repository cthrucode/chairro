'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewListingPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    shop: '',
    location: '',
    price: '',
    description: '',
    image: null as File | null,
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image) {
      alert('Please select an image.')
      return
    }

    setLoading(true)

    try {
      // Upload image
      const filename = `${Date.now()}-${form.image.name}`
      const { error: uploadError } = await supabase
        .storage.from('listing-images').upload(filename, form.image)

      if (uploadError) {
        throw uploadError
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${filename}`

      // Insert record
      const { error: insertError } = await supabase.from('listings').insert([
        {
          title: form.title,
          shop: form.shop,
          location: form.location,
          price: form.price,
          description: form.description,
          image_url: imageUrl,
        }
      ])


      const { data, error } = await supabase
  .from('listings')
  .insert([{
    title: form.title,
    shop: form.shop,
    location: form.location,
    price: form.price,
    description: form.description,
    image_url: imageUrl,
  }])
  .select('*');  // <-- will return inserted row


      if (insertError) {
        throw insertError
      }

      alert('Listing submitted successfully!')
      router.push('/')
    } catch (err: any) {
      console.error(err)
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
      <input
        type="text"
        placeholder="Title"
        required
        className="w-full border rounded px-3 py-2"
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Shop Name"
        required
        className="w-full border rounded px-3 py-2"
        onChange={e => setForm(f => ({ ...f, shop: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Location"
        required
        className="w-full border rounded px-3 py-2"
        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Price"
        required
        className="w-full border rounded px-3 py-2"
        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
      />
      <textarea
        placeholder="Description"
        className="w-full border rounded px-3 py-2"
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
      />
      <input
        type="file"
        accept="image/*"
        required
        onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        {loading ? 'Submitting...' : 'Submit Listing'}
      </button>
    </form>
  )
}
