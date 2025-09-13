"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

type BookingFormProps = {
  listingId: string;
  listingTitle: string;
  price: number; // per day
};

function BookingForm({ listingId, listingTitle, price }: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingRes = await fetch(`/api/bookings/listing/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) throw new Error(bookingData.error || "Booking failed");

      const stripeRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.bookingId,
          listingTitle,
          totalPrice: bookingData.total_price,
        }),
      });

      const { url, error } = await stripeRes.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Book {listingTitle}</h2>
      <p className="text-gray-600">Price: ${price}/day</p>

      <div>
        <label className="block mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Book Now"}
      </button>
    </form>
  );
}

// ✅ Default export: Next.js Page
export default function Page() {
  const params = useParams();
  const listingId = params?.id as string;

  // Ideally fetch listing details here with server component or props
  return (
    <BookingForm listingId={listingId} listingTitle="Sample Listing" price={100} />
  );
}
