// app/api/bookings/listing/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Listing {
  id: string;
  price: string;
  title: string;
  host_id: string;
}

interface Booking {
  id: string;
  total_price: number;
}

export async function POST(
  req: Request,
  context: any // 👈 use `any` here instead of trying to type params
) {
  try {
    const listing_id = context.params.id; // ✅ safe to access
    const { start_date, end_date } = (await req.json()) as {
      start_date: string;
      end_date: string;
    };

    if (!listing_id || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const renter_id = "392bc973-acb1-43df-a20e-16855f3c87ec";

    // 1️⃣ Get listing
    const { data: listing, error: listingError } = await supabase
      .from<Listing>("listings")
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
      .from<Booking>("bookings")
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
      .select("id, total_price")
      .single();

    if (bookingError || !booking) {
      console.error("❌ Supabase insert error:", bookingError);
      return NextResponse.json(
        { error: "Insert failed", details: bookingError?.message },
        { status: 400 }
      );
    }

    // ✅ Return JSON (not JSX)
    return NextResponse.json(
      {
        bookingId: booking.id,
        total_price: booking.total_price,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: "Unexpected error", details: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Unexpected error", details: "Unknown error" },
      { status: 500 }
    );
  }
}
