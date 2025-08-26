import { NextResponse } from "next/server"
import { getRisks } from "@/lib/db"

export async function GET() {
  try {
    const risks = getRisks()
    return NextResponse.json({ risks })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch risks" }, { status: 500 })
  }
}
