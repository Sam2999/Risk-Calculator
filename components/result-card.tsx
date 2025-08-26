import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRiskColor } from "@/lib/risk-utils"
import { cn } from "@/lib/utils"

interface ResultCardProps {
  score: number
  classification: string
}

export function ResultCard({ score, classification }: ResultCardProps) {
  const getGuidanceText = (classification: string): string => {
    switch (classification) {
      case "Low":
        return "Monitor and review periodically. Standard precautions may be sufficient."
      case "Medium":
        return "Implement additional controls and monitor regularly."
      case "High":
        return "Requires immediate attention and enhanced control measures."
      case "Critical":
        return "Address immediately with comprehensive risk mitigation strategies."
      default:
        return "Review risk assessment parameters."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Result</CardTitle>
        <CardDescription>Calculated risk score and recommended actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold">
            {score}
            <span className="text-lg text-muted-foreground">/25</span>
          </div>
          <Badge className={cn("text-white font-semibold px-3 py-1", getRiskColor(classification))}>
            {classification} Risk
          </Badge>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-center">{getGuidanceText(classification)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
