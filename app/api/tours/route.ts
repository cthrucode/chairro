import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { listingId, stylistId, hostId, scheduledAt } = await req.json();

    // 1. Insert tour record (status = pending)
    const { data: tour, error } = await supabase
      .from("tours")
      .insert([
        {
          listing_id: listingId,
          stylist_id: stylistId,
          host_id: hostId,
          scheduled_at: scheduledAt,
          deposit_amount: 20,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // 2. Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tour Reservation Deposit",
              description: "Deposit for salon/barbershop tour",
            },
            unit_amount: 2000, // $20 in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tours/success?tourId=${tour.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tours/cancel?tourId=${tour.id}`,
      metadata: { tourId: tour.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Error creating tour:", err.message);
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}
