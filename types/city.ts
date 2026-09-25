// MODULE 5: Code City 3D Explorer types

export type BuildingType =
  | "commercial"   // business logic
  | "residential"  // utilities / helpers
  | "industrial"   // data processing
  | "hospital"     // error handling
  | "police"       // security / auth
  | "fire_station" // logging / monitoring
  | "park"         // test suites
  | "road";        // dependencies (edges, not buildings)

export type HealthColor = "green" | "yellow" | "red";

export interface CityBuilding {
  id: string;
  moduleName: string;
  filePath: string;
  type: BuildingType;
  health: HealthColor;
  height: number;   // proportional to complexity
  width: number;    // proportional to file size
  floors: number;   // number of functions
  position: { x: number; y: number; z: number };
  description?: string;
  functionCount: number;
  lineCount: number;
  testCoverage: number;
}

export interface CityRoad {
  id: string;
  from: string; // building id
  to: string;   // building id
  weight: number; // import frequency → road thickness
  color: string;
}

export interface CityDistrict {
  id: string;
  name: string;
  type: BuildingType;
  buildings: string[]; // building ids
  bounds: { minX: number; minZ: number; maxX: number; maxZ: number };
}

export interface CityMap {
  repoUrl: string;
  generatedAt: string;
  buildings: CityBuilding[];
  roads: CityRoad[];
  districts: CityDistrict[];
  stats: {
    totalBuildings: number;
    totalRoads: number;
    healthSummary: Record<HealthColor, number>;
  };
}

export interface CitySearchResult {
  buildingId: string;
  moduleName: string;
  filePath: string;
  position: { x: number; y: number; z: number };
}

export interface CityDirections {
  from: string;
  to: string;
  path: string[]; // ordered list of building ids
  steps: string[];
  distance: number;
}

export interface CityBookmark {
  id: string;
  label: string;
  buildingId: string;
  createdAt: string;
}
