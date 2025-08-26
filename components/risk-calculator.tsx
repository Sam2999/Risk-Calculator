"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RiskMatrixGrid } from "./risk-matrix-grid"
import { ResultCard } from "./result-card"
import { RiskList } from "./risk-list"
import { calculateRiskScore, classifyRisk } from "@/lib/risk-utils"
import type { Risk } from "@/lib/types"

export function RiskCalculator() {
  const [hazard, setHazard] = useState("")
  const [likelihood, setLikelihood] = useState<number | null>(null)
  const [impact, setImpact] = useState<number | null>(null)
  const [calculatedRisk, setCalculatedRisk] = useState<{
    score: number
    classification: string
  } | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [risks, setRisks] = useState<Risk[]>([])

  const validateInputs = (): boolean => {
    const newErrors: string[] = []

    if (!hazard || hazard.length < 3) {
      newErrors.push("Hazard is required and must be at least 3 characters")
    }

    if (!likelihood || likelihood < 1 || likelihood > 5) {
      newErrors.push("Likelihood must be selected (1-5)")
    }

    if (!impact || impact < 1 || impact > 5) {
      newErrors.push("Impact must be selected (1-5)")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCalculate = () => {
    if (!validateInputs()) return

    const score = calculateRiskScore(likelihood!, impact!)
    const classification = classifyRisk(score)

    setCalculatedRisk({ score, classification })
  }

  const handleSave = async () => {
    if (!validateInputs() || !calculatedRisk) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hazard,
          likelihood,
          impact,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setErrors([error.error || "Failed to save risk"])
        return
      }

      const newRisk: Risk = await response.json()
      setRisks((prev) => [newRisk, ...prev].sort((a, b) => b.score - a.score))

      // Clear form after successful save
      handleClear()
    } catch (error) {
      setErrors(["Failed to save risk. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setHazard("")
    setLikelihood(null)
    setImpact(null)
    setCalculatedRisk(null)
    setErrors([])
  }

  const loadRisks = async () => {
    try {
      const response = await fetch("/api/risks")
      if (response.ok) {
        const data = await response.json()
        setRisks(data.risks)
      }
    } catch (error) {
      console.error("Failed to load risks:", error)
    }
  }

  // Load risks on component mount
  useEffect(() => {
    loadRisks()
  }, [])

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Input</CardTitle>
          <CardDescription>
            Enter the hazard details and select likelihood and impact values (1-5 scale)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Hazard Input */}
          <div className="space-y-2">
            <Label htmlFor="hazard">Hazard Description</Label>
            <Input
              id="hazard"
              placeholder="Describe the potential hazard (minimum 3 characters)"
              value={hazard}
              onChange={(e) => setHazard(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Likelihood and Impact Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="likelihood">Likelihood (1-5)</Label>
              <Select
                value={likelihood?.toString() || ""}
                onValueChange={(value) => setLikelihood(Number.parseInt(value))}
              >
                <SelectTrigger id="likelihood">
                  <SelectValue placeholder="Select likelihood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Unlikely</SelectItem>
                  <SelectItem value="2">2 - Unlikely</SelectItem>
                  <SelectItem value="3">3 - Possible</SelectItem>
                  <SelectItem value="4">4 - Likely</SelectItem>
                  <SelectItem value="5">5 - Very Likely</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">Impact (1-5)</Label>
              <Select value={impact?.toString() || ""} onValueChange={(value) => setImpact(Number.parseInt(value))}>
                <SelectTrigger id="impact">
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Negligible</SelectItem>
                  <SelectItem value="2">2 - Minor</SelectItem>
                  <SelectItem value="3">3 - Moderate</SelectItem>
                  <SelectItem value="4">4 - Major</SelectItem>
                  <SelectItem value="5">5 - Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCalculate} className="flex-1 min-w-[120px]">
              Calculate Risk
            </Button>
            <Button
              onClick={handleSave}
              variant="secondary"
              disabled={!calculatedRisk || isLoading}
              className="flex-1 min-w-[120px]"
            >
              {isLoading ? "Saving..." : "Save to List"}
            </Button>
            <Button onClick={handleClear} variant="outline" className="flex-1 min-w-[120px] bg-transparent">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Matrix and Results */}
      {likelihood && impact && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RiskMatrixGrid selectedLikelihood={likelihood} selectedImpact={impact} />
          {calculatedRisk && <ResultCard score={calculatedRisk.score} classification={calculatedRisk.classification} />}
        </div>
      )}

      {/* Risk List */}
      {risks.length > 0 && <RiskList risks={risks} />}
    </div>
  )
}
