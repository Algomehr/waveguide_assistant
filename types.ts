
export enum AppView {
  CHAT = 'CHAT',
  ACADEMY = 'ACADEMY',
  DISCOVERY = 'DISCOVERY',
  SIMULATION = 'SIMULATION',
  INTERFEROMETRY = 'INTERFEROMETRY',
  MATERIALS = 'MATERIALS',
  FABRICATION = 'FABRICATION',
  PYTHON_AI = 'PYTHON_AI',
  LAB_SETUP = 'LAB_SETUP'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  groundingLinks?: GroundingLink[];
}

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface AcademyTopic {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface PythonTopic {
  id: string;
  title: string;
  category: 'Python Core' | 'Optimization' | 'Machine Learning' | 'Hardware Control';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Material {
  name: string;
  formula: string;
  index: number;
  category: 'Semiconductor' | 'Dielectric' | 'Polymer' | 'Photoresist';
  description: string;
  thermalExpansion?: string;
  bandgap?: string;
}

export interface Equipment {
  name: string;
  type: 'Laser' | 'Optics' | 'Positioning' | 'Detection';
  keySpecs: Record<string, string>;
  description: string;
  application: string;
  buyingGuide: string;
}
