import { NextResponse } from "next/server";
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { hostEmail, professionalEmail, booking } = await req.json();

    // 🔹 Log incoming request for debugging
    console.log("📌 notifyBooking request body:", { hostEmail, professionalEmail, booking });

    // 🔹 Validate required fields
    if (!hostEmail || !professionalEmail || !booking) {
      console.error("❌ Missing email or booking data");
      return NextResponse.json(
        { error: "Missing email or booking data" },
        { status: 400 }
      );
    }

    // Email for Host
    await resend.emails.send({
      from: "Chairro <rafiq.muntaqim@gmail.com>", // use verified email
      to: hostEmail,
      subject: "📅 New Booking Received",
      html: `
        <h2>You have a new booking!</h2>
        <p>Listing: ${booking.listingTitle}</p>
        <p>Professional: ${booking.professionalName}</p>
        <p>Date: ${booking.date}</p>
      `,
      text: `
        You have a new booking!\n
        Listing: ${booking.listingTitle}\n
        Professional: ${booking.professionalName}\n
        Date: ${booking.date}
      `,
      reply_to: "rafiq.muntaqim@gmail.com",
    });

    // Email for Professional
    await resend.emails.send({
      from: "Chairro <rafiq.muntaqim@gmail.com>", // use same verified email
      to: professionalEmail,
      subject: "✅ Booking Confirmed",
      html: `
        <h2>Your booking is confirmed!</h2>
        <p>Listing: ${booking.listingTitle}</p>
        <p>Host: ${booking.hostName}</p>
        <p>Date: ${booking.date}</p>
      `,
      text: `
        Your booking is confirmed!\n
        Listing: ${booking.listingTitle}\n
        Host: ${booking.hostName}\n
        Date: ${booking.date}
      `,
      reply_to: "rafiq.muntaqim@gmail.com",
    });

    console.log("✅ Emails sent successfully");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ notifyBooking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
