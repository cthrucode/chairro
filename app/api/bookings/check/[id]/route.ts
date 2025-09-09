import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: "start_date and end_date are required" },
        { status: 400 }
      );
    }

    const listing_id = params.id;

    const { data: overlaps, error } = await supabase
      .from("bookings")
      .select("start_date, end_date")
      .eq("listing_id", listing_id)
      .or(`and(start_date.lte.${end_date},end_date.gte.${start_date})`);

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (overlaps.length > 0) {
      const latestEnd = overlaps
        .map((b) => new Date(b.end_date))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      const nextAvailable = new Date(latestEnd);
      nextAvailable.setDate(nextAvailable.getDate() + 1);

      return NextResponse.json({
        available: false,
        nextAvailable: nextAvailable.toISOString().split("T")[0],
      });
    }

    return NextResponse.json({ available: true });
  } catch (err: any) {
    console.error("❌ API error:", err.message || err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
