import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔹 Test/debug route
export async function GET(req: Request) {
  return NextResponse.json({ ok: true, msg: "Bookings route works!" });
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const listing_id = url.pathname.split("/").pop();

    if (!listing_id) {
      return NextResponse.json({ error: "listing_id is required" }, { status: 400 });
    }

    const body = await req.json();
    const { start_date, end_date } = body;

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: "start_date and end_date are required" },
        { status: 400 }
      );
    }

    // 👇 dummy renter_id (replace with actual user id from session)
    const renter_id = "392bc973-acb1-43df-a20e-16855f3c87ec";

    // get listing details (need host_id + price + title)
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, price, title, owner_id")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const price = parseFloat(listing.price);
    const nights =
      (new Date(end_date).getTime() - new Date(start_date).getTime()) /
      (1000 * 60 * 60 * 24);

    const total_price = nights * price;

    // create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert([{ listing_id, renter_id, start_date, end_date, total_price, host_id: listing.owner_id }])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      throw error;
    }

    // 🔔 fetch host + renter profile emails
    const { data: host } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", listing.owner_id)
      .single();

    const { data: professional } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", renter_id)
      .single();

    // 🔔 trigger notify API
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/notifyBooking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hostEmail: host?.email,
        professionalEmail: professional?.email,
        booking: {
          listingTitle: listing.title,
          professionalName: professional?.full_name,
          hostName: host?.full_name,
          date: start_date,
        },
      }),
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: any) {
    console.error("❌ Error creating booking:", err?.message || err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
