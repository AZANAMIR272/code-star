// MODULE 4: Code Food Chain types

export type EcosystemRole = "apex_predator" | "herbivore" | "parasite" | "decomposer";

export interface FoodChainNode {
  id: string;
  filePath: string;
  moduleName: string;
  role: EcosystemRole;
  predatorScore: number; // how many modules depend on this (0–100)
  preyScore: number;     // how many modules this depends on (0–100)
  testCoverage: number;
  isFragile: boolean;    // high predator score + low test coverage
  importedBy: string[];
  imports: string[];
}

export interface FoodChainEdge {
  source: string; // node id
  target: string; // node id
  weight: number; // import frequency 0–100
}

export interface FoodChainGraph {
  repoUrl: string;
  generatedAt: string;
  nodes: FoodChainNode[];
  edges: FoodChainEdge[];
}

export interface ImpactAnalysis {
  module: string;
  directImpact: string[];
  indirectImpact: string[];
  riskScore: number;
  breakingChangeProbability: number;
  recommendation: string;
}

export interface FragileModule {
  filePath: string;
  predatorScore: number;
  testCoverage: number;
  fragileScore: number;
  reason: string;
}

export interface FoodChainEvolutionEntry {
  date: string;
  newApexPredators: string[];
  removedModules: string[];
  newFragile: string[];
}
