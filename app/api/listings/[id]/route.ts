import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ListingUpdateBody {
  title?: string;
  shop?: string;
  location?: string;
  price?: number | string;
  description?: string;
  image_urls?: string[];
}

export async function PATCH(req: NextRequest, context: any) {
  try {
    const listingId = context.params?.id; // ✅ safe way
    const body = (await req.json()) as ListingUpdateBody;

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("listings")
      .update(body)
      .eq("id", listingId)
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase error updating listing:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ listing: data }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ API error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("❌ Unknown API error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
