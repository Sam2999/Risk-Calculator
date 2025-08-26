import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRiskColor } from "@/lib/risk-utils"
import { cn } from "@/lib/utils"
import type { Risk } from "@/lib/types"

interface RiskListProps {
  risks: Risk[]
}

export function RiskList({ risks }: RiskListProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Risk Assessments</CardTitle>
        <CardDescription>All saved risks ordered by severity (highest risk first)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hazard</TableHead>
                <TableHead className="text-center">Likelihood</TableHead>
                <TableHead className="text-center">Impact</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Classification</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{risk.hazard}</TableCell>
                  <TableCell className="text-center">{risk.likelihood}</TableCell>
                  <TableCell className="text-center">{risk.impact}</TableCell>
                  <TableCell className="text-center font-bold">{risk.score}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn("text-white font-semibold", getRiskColor(risk.classification))}>
                      {risk.classification}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(risk.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
