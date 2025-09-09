// app/api/bookings/listing/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listing_id } = await context.params;
    const { start_date, end_date } = await req.json();

    if (!listing_id || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const renter_id = "392bc973-acb1-43df-a20e-16855f3c87ec";

    // 1️⃣ Get listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, price, title, host_id")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Listing not found", details: listingError?.message },
        { status: 404 }
      );
    }

    const price = parseFloat(listing.price);
    const nights =
      (new Date(end_date).getTime() - new Date(start_date).getTime()) /
      (1000 * 60 * 60 * 24);
    const total_price = nights * price;

    // 2️⃣ Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          listing_id,
          renter_id,
          start_date: new Date(start_date).toISOString().split("T")[0],
          end_date: new Date(end_date).toISOString().split("T")[0],
          total_price,
          host_id: listing.host_id,
        },
      ])
      .select("id, total_price") // 👈 only select the needed fields
      .single();

    if (bookingError) {
      console.error("❌ Supabase insert error:", bookingError);
      return NextResponse.json(
        { error: "Insert failed", details: bookingError.message },
        { status: 400 }
      );
    }

    // 3️⃣ Return in the shape BookingForm expects
    return NextResponse.json(
      {
        bookingId: booking.id,
        total_price: booking.total_price,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: err?.message },
      { status: 500 }
    );
  }
}
