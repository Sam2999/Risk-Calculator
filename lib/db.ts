import type { Risk } from "./types"

// Simple in-memory storage for demo purposes
// In production, this would be replaced with SQLite/database
const risks: Risk[] = []

export function createRisk(hazard: string, likelihood: number, impact: number): Risk {
  const score = likelihood * impact
  let classification: "Low" | "Medium" | "High" | "Critical"

  if (score >= 1 && score <= 4) classification = "Low"
  else if (score >= 5 && score <= 9) classification = "Medium"
  else if (score >= 10 && score <= 16) classification = "High"
  else classification = "Critical"

  const risk: Risk = {
    id: crypto.randomUUID(),
    hazard,
    likelihood,
    impact,
    score,
    classification,
    createdAt: new Date().toISOString(),
  }

  risks.push(risk)
  return risk
}

export function getRisks(): Risk[] {
  return risks.sort((a, b) => b.score - a.score) // Sort by score descending
}
