"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookingFormProps = {
  listingId: string;
  listingTitle: string;
  price: number; // per day
};

export default function BookingForm({ listingId, listingTitle, price }: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }

    setLoading(true);

    try {
      // Calculate number of days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (nights <= 0) {
        alert("End date must be after start date.");
        setLoading(false);
        return;
      }
      const totalPrice = nights * price;

      // 1. Create booking in Supabase
      const bookingRes = await fetch(`/api/bookings/listing/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: startDate, end_date: endDate, totalPrice }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) throw new Error(bookingData.error || "Booking failed");

      // 2. Redirect to Stripe Checkout
      const stripeRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingData.booking.id,
          listingTitle,
          totalPrice,
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
        />
      </div>

      <div>
        <label className="block mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
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
