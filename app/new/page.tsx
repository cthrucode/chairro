'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewListingPage() {
  const [form, setForm] = useState({ title: '', shop: '', location: '', price: '', description: '', image: null })
  const router = useRouter()

  async function handleSubmit(e: any) {
    e.preventDefault()

    // 1. Upload image
    const file = form.image
    const filename = `${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase
      .storage.from('listing-images').upload(filename, file)

    if (uploadError) return alert('Upload failed: ' + uploadError.message)

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${filename}`

    // 2. Insert record into listings table
    const { data, error } = await supabase.from('listings').insert([{
      title: form.title,
      shop: form.shop,
      location: form.location,
      price: form.price,
      description: form.description,
      image_url: imageUrl
    }])

    if (error) {
      alert('Submission failed: ' + error.message)
    } else {
      alert('Listing submitted!')
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
      <input type="text" placeholder="Title" required className="input" onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      <input type="text" placeholder="Shop Name" required className="input" onChange={e => setForm(f => ({ ...f, shop: e.target.value }))} />
      <input type="text" placeholder="Location" required className="input" onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
      <input type="text" placeholder="Price" required className="input" onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
      <textarea placeholder="Description" className="input" onChange={e => setForm(f => ({ ...f, description: e.target.value }))}></textarea>
      <input type="file" accept="image/*" required onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] }))} />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Submit Listing</button>
    </form>
  )
}
