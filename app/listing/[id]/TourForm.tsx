"use client";

import { useState } from "react";

interface TourFormProps {
  listingId: string;
  hostId: string;
  stylistId: string;
}

export default function TourForm({ listingId, hostId, stylistId }: TourFormProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const scheduledAt = new Date(`${date}T${time}`);

    const res = await fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId,
        hostId,
        stylistId,
        scheduledAt,
      }),
    });

    const data: { url?: string } = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirect to Stripe Checkout
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Request a Tour ($20 deposit)</h2>
      <label className="block mb-2">
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>
      <label className="block mb-4">
        Time:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>
      <button
        type="submit"
        className="bg-pink text-white px-4 py-2 rounded hover:bg-navy"
      >
        Reserve Tour
      </button>
    </form>
  );
}
