// app/api/bookings/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Bookings API root works" })
}
