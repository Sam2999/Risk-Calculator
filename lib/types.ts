export interface Risk {
  id: string
  hazard: string
  likelihood: number
  impact: number
  score: number
  classification: "Low" | "Medium" | "High" | "Critical"
  createdAt: string
}

export interface CreateRiskRequest {
  hazard: string
  likelihood: number
  impact: number
}

export interface CreateRiskResponse extends Risk {}

export interface GetRisksResponse {
  risks: Risk[]
}
