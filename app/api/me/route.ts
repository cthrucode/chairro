// app/api/me/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ use service role only in server routes
);

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // pull extra role data from "profiles" table
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role, email")
      .eq("id", user.id)
      .single();

    return NextResponse.json({ user: profile });
  } catch (err) {
    console.error("API /me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
