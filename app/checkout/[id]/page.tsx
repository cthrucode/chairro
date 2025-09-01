import React from 'react';
import CheckoutForm from './CheckoutForm';

async function fetchListing(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/listings/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch listing: ${res.status} - ${errorText}`);
  }

  return res.json();
}
// app/checkout/[id]/page.tsx
export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ works now

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/listings/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch listing: ${res.status}`);
  }

  const listing = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      <p>{listing.description}</p>
      <p className="text-gray-600">Price: ${listing.price}</p>
    </div>
  );
}

