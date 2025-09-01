'use client';

import React, { useState } from 'react';

interface Listing {
  id: string;
  title: string;
  price: number;
}

interface CheckoutFormProps {
  listing: Listing;
}

export default function CheckoutForm({ listing }: CheckoutFormProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [time, setTime] = useState<string>(''); // optional
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleBooking = async () => {
    if (!startDate) return setMessage('Please select a start date.');
    if (!endDate) return setMessage('Please select an end date.');
    if (!listing.id) return setMessage('Listing ID is missing.');

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/bookings/listing/${listing.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          time: time || null,
        }),
      });

      const data: { booking?: any; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create booking');

      setMessage('Booking created successfully! 🎉');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Checkout for {listing.title}</h2>
      <p className="mb-2">ID: {listing.id}</p>
      <p className="mb-4">Price: ${listing.price}</p>

      {/* Start Date */}
      <label className="block mb-2">
        <span className="text-gray-700">Start Date *</span>
        <input
          type="date"
          className="border rounded w-full p-2 mt-1"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      {/* End Date */}
      <label className="block mb-2">
        <span className="text-gray-700">End Date *</span>
        <input
          type="date"
          className="border rounded w-full p-2 mt-1"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>

      {/* Optional Time */}
      <label className="block mb-4">
        <span className="text-gray-700">Time (optional)</span>
        <input
          type="time"
          className="border rounded w-full p-2 mt-1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>

      <button
        onClick={handleBooking}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Booking...' : 'Book Now'}
      </button>

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}
