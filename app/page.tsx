'use client'

import { useState } from 'react'
import { fakeListings } from '@/lib/listings'
import ListingCard from '@/components/ListingCard'
import SearchBar from '@/components/SearchBar'

export default function HomePage() {
  const [search, setSearch] = useState('')

  const filtered = fakeListings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase()) ||
    l.shop.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Find a Chair to Rent</h1>
      <SearchBar value={search} onChange={setSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.map(listing => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </div>
  )
}
