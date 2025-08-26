import { type NextRequest, NextResponse } from "next/server"
import { createRisk } from "@/lib/db"
import type { CreateRiskRequest } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: CreateRiskRequest = await request.json()

    // Validation
    if (!body.hazard || body.hazard.length < 3) {
      return NextResponse.json({ error: "Hazard is required and must be at least 3 characters" }, { status: 400 })
    }

    if (!body.likelihood || body.likelihood < 1 || body.likelihood > 5) {
      return NextResponse.json({ error: "Likelihood must be between 1 and 5" }, { status: 400 })
    }

    if (!body.impact || body.impact < 1 || body.impact > 5) {
      return NextResponse.json({ error: "Impact must be between 1 and 5" }, { status: 400 })
    }

    const risk = createRisk(body.hazard, body.likelihood, body.impact)

    return NextResponse.json(risk)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
