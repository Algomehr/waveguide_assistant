
export enum AppView {
  CHAT = 'CHAT',
  ACADEMY = 'ACADEMY',
  DISCOVERY = 'DISCOVERY',
  SIMULATION = 'SIMULATION',
  INTERFEROMETRY = 'INTERFEROMETRY',
  MATERIALS = 'MATERIALS',
  FABRICATION = 'FABRICATION',
  PYTHON_AI = 'PYTHON_AI'
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
  loss?: string;
  description: string;
  category: 'Semiconductor' | 'Dielectric' | 'Polymer';
}
