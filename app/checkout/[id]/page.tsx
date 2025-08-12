import React, { use } from 'react'
import CheckoutForm from './CheckoutForm'

async function fetchListing(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/listings/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Failed to fetch listing: ${res.status} - ${errorText}`)
  }
  return res.json()
}

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await and unwrap params outside try/catch
  const resolvedParams = use(params)
  const id = resolvedParams.id

  // 2. Try/catch for the async fetch only
  try {
    const listing = await fetchListing(id)

    return (
      <div>
        {/* @ts-expect-error Server Component passing to Client Component */}
        <CheckoutForm listing={listing} />
      </div>
    )
  } catch (error: any) {
    return (
      <div className="p-4 text-red-600">
        Error loading listing: {error.message || 'Unknown error'}
      </div>
    )
  }
}
