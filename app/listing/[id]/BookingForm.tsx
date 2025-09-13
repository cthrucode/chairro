"use client";

import { useState } from "react";

export default function BookingForm({
  listingId,
  listingTitle,
  price,
  nextAvailable,
}: {
  listingId: string;
  listingTitle: string;
  price: number;
  nextAvailable?: string;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Example: call booking API
      const res = await fetch(`/api/bookings/listing/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!res.ok) throw new Error("Booking failed");

      window.location.href = "/bookings/success";
    } catch (err) {
      console.error(err);
      alert("Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTourRequest = () => {
    window.location.href = `/tours/request?listingId=${listingId}`;
  };

  // ✅ return is INSIDE the function now
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-xl shadow-md max-w-md mx-auto"
    >
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
        {nextAvailable && (
          <p className="text-blue-600 text-sm mt-2">
            That time is booked up. Please choose a date after{" "}
            <strong>{new Date(nextAvailable).toDateString()}</strong>.
          </p>
        )}
      </div>

      {/* Book Now Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Book Now"}
      </button>

      {/* Request Tour Button */}
      <button
        type="button"
        onClick={handleTourRequest}
        className="w-full bg-gray-100 text-gray-800 py-2 rounded-md border hover:bg-gray-200 transition-colors text-sm"
      >
        Request a Tour ($20 deposit)
      </button>
    </form>
  );
}
