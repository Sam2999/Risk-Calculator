import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMatrixCellClassification, getRiskColor } from "@/lib/risk-utils"
import { cn } from "@/lib/utils"

interface RiskMatrixGridProps {
  selectedLikelihood?: number
  selectedImpact?: number
}

export function RiskMatrixGrid({ selectedLikelihood, selectedImpact }: RiskMatrixGridProps) {
  const likelihoodLabels = ["5 - Very Likely", "4 - Likely", "3 - Possible", "2 - Unlikely", "1 - Very Unlikely"]

  const impactLabels = ["1 - Negligible", "2 - Minor", "3 - Moderate", "4 - Major", "5 - Severe"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Matrix (5×5)</CardTitle>
        <CardDescription>Visual representation of risk levels based on likelihood and impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="text-sm font-medium text-center p-2">Likelihood ↓ / Impact →</div>
              {impactLabels.map((label, index) => (
                <div key={index} className="text-xs text-center p-2 font-medium">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            {likelihoodLabels.map((likelihoodLabel, likelihoodIndex) => {
              const likelihood = 5 - likelihoodIndex // Reverse for display (5 at top)

              return (
                <div key={likelihood} className="grid grid-cols-6 gap-1 mb-1">
                  {/* Row Label */}
                  <div className="text-xs p-2 font-medium flex items-center">{likelihood}</div>

                  {/* Matrix Cells */}
                  {impactLabels.map((_, impactIndex) => {
                    const impact = impactIndex + 1
                    const classification = getMatrixCellClassification(likelihood, impact)
                    const isSelected = selectedLikelihood === likelihood && selectedImpact === impact

                    return (
                      <div
                        key={`${likelihood}-${impact}`}
                        className={cn(
                          "aspect-square flex items-center justify-center text-xs font-bold text-white rounded border-2 transition-all",
                          getRiskColor(classification),
                          isSelected ? "border-white shadow-lg scale-110 z-10 relative" : "border-transparent",
                        )}
                        role="gridcell"
                        aria-label={`Likelihood ${likelihood}, Impact ${impact}: ${classification} risk`}
                      >
                        {classification.charAt(0)}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>L = Low (1-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-600 rounded"></div>
            <span>M = Medium (5-9)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded"></div>
            <span>H = High (10-16)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>C = Critical (17-25)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
