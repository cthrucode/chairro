"use client";

import { useState } from "react";

type BookingFormProps = {
  listingId: string;
  listingTitle: string;
  price: number; // per day
};

export default function BookingForm({ listingId, listingTitle, price }: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextAvailable, setNextAvailable] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNextAvailable(null);

    try {
      // 1️⃣ Check availability
      const checkRes = await fetch(
        `/api/bookings/check/${listingId}?start_date=${startDate}&end_date=${endDate}`
      );

      if (!checkRes.ok) throw new Error("Failed to check availability");

      const checkData: { available: boolean; nextAvailable?: string } = await checkRes.json();

      if (!checkData.available) {
        setNextAvailable(checkData.nextAvailable || null);
        setLoading(false);
        return;
      }

      // 2️⃣ Insert booking
      const insertRes = await fetch(`/api/bookings/listing/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const insertData: { bookingId?: string; total_price?: number; error?: string } =
        await insertRes.json();

      if (!insertRes.ok) {
        console.error("Booking failed:", insertData.error);
        alert("Booking failed: " + insertData.error);
        setLoading(false);
        return;
      }

      // 🔹 Expect backend to return bookingId + total_price
      const { bookingId, total_price } = insertData;

      if (!bookingId || !total_price) {
        throw new Error("Booking did not return bookingId or total_price");
      }

      // 3️⃣ Create Stripe Checkout session
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          listingTitle,
          totalPrice: total_price,
        }),
      });

      const checkoutData: { url?: string; error?: string } = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.url) {
        console.error("❌ Checkout error:", checkoutData.error);
        alert("Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // 4️⃣ Redirect user to Stripe Checkout
      window.location.href = checkoutData.url;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error submitting booking:", err.message);
        alert(err.message);
      } else {
        console.error("Unexpected error:", err);
        alert("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTourRequest = () => {
    // You can open a modal, or redirect to /tours page
    window.location.href = `/tours/request?listingId=${listingId}`;
  };

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

      {/* New Request Tour Button */}
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
