"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Booking {
  id: string;
  client_name: string;
  start_time: string;
  end_time: string;
  status: string;
  start_date: string; // derived
  end_date: string;   // derived
}

export default function BookingList({ listingId }: { listingId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          client_name,
          start_time,
          end_time,
          status,
          start_date: start_time::date,
          end_date: end_time::date
        `)
        .eq("listing_id", listingId);

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    }

    fetchBookings();
  }, [listingId]);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="space-y-4">
      {bookings.length === 0 && <p>No bookings found.</p>}
      {bookings.map((b) => (
        <div
          key={b.id}
          className="border rounded-xl p-4 shadow-sm bg-white"
        >
          <h3 className="font-semibold">{b.client_name}</h3>
          <p>
            <span className="font-medium">Date:</span>{" "}
            {b.start_date} – {b.end_date}
          </p>
          <p>
            <span className="font-medium">Time:</span>{" "}
            {new Date(b.start_time).toLocaleTimeString()} –{" "}
            {new Date(b.end_time).toLocaleTimeString()}
          </p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}
