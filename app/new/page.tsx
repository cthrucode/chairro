'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface FormState {
  title: string
  shop: string
  location: string
  price: string
  description: string
  images: File[]
}

export default function NewListingPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    title: '',
    shop: '',
    location: '',
    price: '',
    description: '',
    images: [],
  })
  const [loading, setLoading] = useState(false)
  const fileInputs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.images.length === 0) {
      alert('Please select at least one image.')
      return
    }

    setLoading(true)

    try {
      const uploadedUrls: string[] = []
      for (const image of form.images) {
        const filename = `${Date.now()}-${image.name}`
        const { error: uploadError } = await supabase
          .storage.from('listing-images')
          .upload(filename, image)

        if (uploadError) throw uploadError

        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${filename}`
        uploadedUrls.push(imageUrl)
      }

      const { error: insertError } = await supabase
        .from('listings')
        .insert([{
          title: form.title,
          shop: form.shop,
          location: form.location,
          price: form.price,
          description: form.description,
          image_urls: uploadedUrls,
        }])

      if (insertError) throw insertError

      alert('Listing submitted successfully!')
      router.push('/')
    } catch (err: unknown) {
      console.error(err)
      if (err instanceof Error) alert('Error: ' + err.message)
      else alert('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files
    if (!files) return
    const newImages = [...form.images]
    newImages[index] = files[0]
    setForm(f => ({ ...f, images: newImages }))
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Chairro Logo */}
      <div className="flex justify-center">
        <Image
          src="/chairro-logo.png"
          alt="Chairro Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* 3 upload slots */}
        <div className="flex gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputs[idx]}
                style={{ display: 'none' }}
                onChange={e => handleImageChange(e, idx)}
              />

              <div
                className="w-24 h-24 border rounded flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => fileInputs[idx].current?.click()}
              >
                {form.images[idx] ? (
                  <Image
                    src={URL.createObjectURL(form.images[idx])}
                    alt={`preview-${idx}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-2xl text-gray-400">+</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
        >
          {loading ? 'Submitting...' : 'Submit Listing'}
        </button>
      </form>
    </div>
  )
}
