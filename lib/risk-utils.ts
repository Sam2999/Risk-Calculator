export function calculateRiskScore(likelihood: number, impact: number): number {
  return likelihood * impact
}

export function classifyRisk(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 1 && score <= 4) return "Low"
  if (score >= 5 && score <= 9) return "Medium"
  if (score >= 10 && score <= 16) return "High"
  if (score >= 17 && score <= 25) return "Critical"
  return "Low" // fallback
}

export function getRiskColor(classification: string): string {
  switch (classification) {
    case "Low":
      return "bg-green-600"
    case "Medium":
      return "bg-yellow-600"
    case "High":
      return "bg-orange-600"
    case "Critical":
      return "bg-red-600"
    default:
      return "bg-gray-600"
  }
}

export function getMatrixCellClassification(
  likelihood: number,
  impact: number,
): "Low" | "Medium" | "High" | "Critical" {
  const score = calculateRiskScore(likelihood, impact)
  return classifyRisk(score)
}
