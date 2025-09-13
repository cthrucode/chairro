// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

interface CheckoutRequestBody {
  bookingId: string;
  listingTitle: string;
  totalPrice: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { bookingId, listingTitle, totalPrice } = body;

    // 🔹 Debug logging
    console.log("📦 Checkout request body:", body);

    if (!bookingId || !listingTitle || totalPrice == null) {
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
            unit_amount: Math.round(totalPrice * 100), // convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Error creating Stripe session:", err.message);
      return NextResponse.json(
        { error: "Failed to create checkout session", details: err.message },
        { status: 500 }
      );
    }
    console.error("❌ Unknown error creating Stripe session:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: "Unknown error" },
      { status: 500 }
    );
  }
}
