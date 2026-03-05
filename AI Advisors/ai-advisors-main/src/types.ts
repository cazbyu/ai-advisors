export interface Message {
  id: string;
  advisor: Advisor;
  title: string;
  preview: string;
  content: string;
  date: string;
  status: 'inbox' | 'pending' | 'consider' | 'archived';
}

export interface Advisor {
  id: string;
  title: string;
  name: string;
  role: string;
  profile_image: string;
  avatar?: string;
  description: string;
  expertise: string[];
  team?: TeamMember[];
  gpt_link?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  profile_image: string;
  avatar?: string;
  description: string;
  expertise: string[];
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  description: string;
  advisorsConsulted: string[];
  date: string;
  outcome: string;
  status: 'pending' | 'completed';
}

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  decisions: Decision[];
  consultationCount: number;
}

// --- Boardroom Session Types ---

export interface AdvisorResponse {
  advisorId: string;
  name: string;
  role: string;
  response: string;
}

export interface BoardroomRound {
  question: string;
  round1: AdvisorResponse[];
  round2: AdvisorResponse[];
  suggestedQuestions: string[];
}

export interface BoardroomSession {
  id: string;
  userId: string;
  question: string;
  selectedAdvisors: string[];
  rounds: BoardroomRound[];
  followUps: BoardroomRound[];
  createdAt: string;
  status: 'in_progress' | 'completed';
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string;
  companySize: string;
  companyDescription: string;
}
