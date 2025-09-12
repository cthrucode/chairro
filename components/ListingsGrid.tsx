'use client'

import { useState } from 'react'
import Link from 'next/link'
import ListingCard from './ListingCard'

export default function ListingsGrid({ listings }: { listings: any[] }) {
  const [search, setSearch] = useState('')

  const filteredListings = listings.filter(listing =>
    (listing.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (listing.shop?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (listing.location?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <>
      {/* Search + Button */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 max-w-5xl mx-auto w-full">
        <input
          type="text"
          placeholder="Search chairs by shop, city, or keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:flex-1 border border-gray-300 rounded-full px-5 py-3 mb-4 md:mb-0 md:mr-4 focus:outline-none focus:ring-2 focus:ring-pink focus:border-pink shadow-sm"
        />
        <Link
          href="/new"
          className="bg-pink text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-blue transition shadow"
        >
          + Post a Chair
        </Link>
      </div>

      {/* Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredListings.length > 0 ? (
          filteredListings.map(listing => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title || ''}
              shop={listing.shop || ''}
              location={listing.location || ''}
              price={listing.price}
              image={listing.image_urls?.[0] || listing.image_url || ''}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No listings found.
          </p>
        )}
      </div>
    </>
  )
}
