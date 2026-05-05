export type Impact = 'high' | 'medium' | 'low';

export interface ProCon {
  item: string;
  type: 'pro' | 'con';
  impact: Impact;
  description: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ComparisonRow {
  criterion: string;
  option1Value: string;
  option2Value: string;
  score1: number; // 1-10
  score2: number; // 1-10
  winner: string;
}

export interface DecisionAnalysis {
  prosCons: ProCon[];
  swot: SWOT;
  comparison?: ComparisonRow[];
  summary: string;
  recommendation: string;
  options?: {
    alpha: string;
    beta: string;
  };
}
