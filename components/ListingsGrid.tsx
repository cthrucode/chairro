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
      {/* Search and + New button */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search by shop, city or keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:flex-1 border border-gray-300 rounded-full px-4 py-2 mb-4 md:mb-0 md:mr-4 focus:outline-none focus:ring focus:border-black"
        />
        <Link
          href="/new"
          className="bg-black text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          + New Listing
        </Link>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          <p className="text-center text-gray-500 col-span-full">No listings found.</p>
        )}
      </div>
    </>
  )
}
