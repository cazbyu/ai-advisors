export type AdvisorRole = 
  | 'CSO'
  | 'CMO'
  | 'CFO'
  | 'CTO'
  | 'CHRO'
  | 'CIO'
  | 'CEL'
  | 'COO'
  | 'CoS';

export interface Advisor {
  id: string;
  name: string;
  role: AdvisorRole;
  title: string;
  responsibility: string;
  contributions: string[];
  profileImage: string;
  isActionNode?: boolean;
  subtitle?: string;
  bio?: string;
  tags?: string[];
  responsibilities?: string[];
  key_decisions?: string[];
  value_to_org?: string[];
  gpt_link?: string;
  route?: string;
}

export interface AdvisorNodeProps {
  advisor: Advisor;
  index: number;
  isVisible: boolean;
  totalNodes: number;
  onClick: (advisor: Advisor) => void;
}

export interface Document {
  id: string;
  project_id: string;
  advisor: string;
  topic: string;
  title: string;
  version: number;
  file_url: string;
  file_type: string;
  display_name: string;
  tags: string[];
  access: 'public' | 'private';
  created_at: string;
  updated_at: string;
}