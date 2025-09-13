import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request) {
  try {
    // Extract the ID from the URL
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const listing_id = segments[segments.length - 1];

    const body = await req.json();
    const { title, shop, location, price, description } = body;

    if (!listing_id || !title || !shop || !location || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("listings")
      .update({ title, shop, location, price, description })
      .eq("id", listing_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Listing updated successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
