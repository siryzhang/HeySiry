
export enum TraitType {
  SYNERGY = 'Human-AI Synergy', // 人机协同力
  JUDGMENT = 'Value Judgment', // 价值判断力
  SYSTEM = 'System Architecture', // 系统架构力
  INNOVATION = 'Cross-Domain Innovation', // 跨界创新力
  EMPATHY = 'Human-Centric Empathy', // 人本共情力
  ITERATION = 'Cognitive Iteration', // 认知迭代力
}

export interface TalentMetrics {
  [TraitType.SYNERGY]: number;
  [TraitType.JUDGMENT]: number;
  [TraitType.SYSTEM]: number;
  [TraitType.INNOVATION]: number;
  [TraitType.EMPATHY]: number;
  [TraitType.ITERATION]: number;
}

export interface EvolutionPoint {
  timestamp: string;
  overallRating: number;
}

export interface TalentProfile {
  id: string;
  name: string;
  role: string;
  department: string; // New field for Galaxy clustering
  archetype: string; // e.g., "The Cyber-Architect", "The Bridge"
  overallRating: number; // 0-99
  metrics: TalentMetrics;
  scoutReport: string; // A concise summary of their current state
  developmentPlan: string[]; // Bullet points for improvement
  history: EvolutionPoint[];
  tags: string[]; // e.g., "High Potential", "Tool Master"
  avatarUrl?: string;
  isAgent?: boolean; // Whether this is a digital employee
  agentModel?: string; // e.g., "Gemini 2.5 Flash"
}

export interface AnalysisResult {
  metrics: TalentMetrics;
  archetype: string;
  scoutReport: string;
  developmentPlan: string[];
  tags: string[];
}

export interface SynergyAnalysis {
  score: number;
  chemistryReport: string;
  missingElements: string[];
  riskFactor: string;
}

export interface TeamRecommendation {
  recommendedIds: string[];
  strategyRationale: string; // "Why this specific combination?"
  keyRoles: string[]; // "Who plays what role in this squad"
}

export interface MarketInsight {
  trendAnalysis: string;
  hiringRecommendation: string;
  skillGaps: string[];
}

export type ViewMode = 'dashboard' | 'synergy' | 'horizon';

export type Language = 'en' | 'zh';
