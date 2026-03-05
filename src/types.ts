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
  avatar?: string; // Kept for backward compatibility
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
  avatar?: string; // Kept for backward compatibility
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