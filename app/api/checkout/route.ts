// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, listingTitle, totalPrice } = body;

    
    // 🔹 Debug logging
    console.log("📦 Checkout request body:", body);
    console.log("➡️ bookingId:", bookingId);
    console.log("➡️ listingTitle:", listingTitle);
    console.log("➡️ totalPrice:", totalPrice);


    if (!bookingId || !listingTitle || !totalPrice) {
      return NextResponse.json(
        { error: "bookingId, listingTitle, and totalPrice are required" },
        { status: 400 }
      );
    }

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: listingTitle },
            unit_amount: totalPrice * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error creating Stripe session:", err.message || err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
