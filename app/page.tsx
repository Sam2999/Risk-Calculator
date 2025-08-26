import { RiskCalculator } from "@/components/risk-calculator"

export default function Home() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Risk Management Calculator</h1>
            <p className="text-muted-foreground">Assess and manage risks using a comprehensive 5×5 matrix system</p>
          </header>
          <RiskCalculator />
        </div>
      </div>
    </div>
  )
}
