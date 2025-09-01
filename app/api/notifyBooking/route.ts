import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { hostEmail, professionalEmail, booking } = await req.json();

    // Email for Host
    await resend.emails.send({
      from: "Chairro <no-reply@chairro.com>",
      to: hostEmail,
      subject: "📅 New Booking Received",
      html: `
        <h2>You have a new booking!</h2>
        <p>Listing: ${booking.listingTitle}</p>
        <p>Professional: ${booking.professionalName}</p>
        <p>Date: ${booking.date}</p>
      `,
    });

    // Email for Professional
    await resend.emails.send({
      from: "Chairro <no-reply@chairro.com>",
      to: professionalEmail,
      subject: "✅ Booking Confirmed",
      html: `
        <h2>Your booking is confirmed!</h2>
        <p>Listing: ${booking.listingTitle}</p>
        <p>Host: ${booking.hostName}</p>
        <p>Date: ${booking.date}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
