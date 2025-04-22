import { create } from 'zustand';
import type { Advisor, Decision, User, Message } from './types';

interface State {
  user: User | null;
  advisors: Advisor[];
  assistant: Advisor;
  decisions: Decision[];
  messages: Message[];
  setUser: (user: User | null) => void;
  addDecision: (decision: Decision) => void;
  updateDecision: (decision: Decision) => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
}

export const useStore = create<State>((set) => ({
  user: null,
  messages: [
    {
      id: '1',
      advisor: {
        id: 'cfo',
        title: 'Santiago Marín, Chief Finance Officer',
        name: 'Santiago',
        role: 'CFO',
        avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CFO_Santiago.png',
        description: 'Leads financial systems and investment logic for Africa Thryves, ensuring every dollar advances our mission and delivers triple-dividend impact.',
        expertise: ['Financial Strategy', 'Impact Investment', 'Risk Management']
      },
      title: 'Investment Strategy Review',
      preview: 'I\'ve analyzed the current market conditions and have some recommendations for our investment strategy.',
      content: 'Full message content here...',
      date: '2024-03-15',
      status: 'inbox'
    },
    {
      id: '2',
      advisor: {
        id: 'cto',
        title: 'Sir Marcus of Technology',
        name: 'Marcus',
        role: 'CTO',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        description: 'Architect of Digital Realms',
        expertise: ['Tech Strategy', 'Innovation', 'Digital Transformation']
      },
      title: 'Technology Stack Proposal',
      preview: 'Based on our discussion, I\'ve prepared a detailed proposal for updating our technology stack.',
      content: 'Full message content here...',
      date: '2024-03-14',
      status: 'consider'
    },
    {
      id: '3',
      advisor: {
        id: 'cmo',
        title: 'Lady Elena of Markets',
        name: 'Elena',
        role: 'CMO',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        description: 'Guardian of Brand & Growth',
        expertise: ['Marketing Strategy', 'Brand Development', 'Customer Insights']
      },
      title: 'Q2 Marketing Campaign',
      preview: 'Awaiting your feedback on the proposed Q2 marketing campaign strategy.',
      content: 'Full message content here...',
      date: '2024-03-13',
      status: 'pending'
    }
  ],
  assistant: {
    id: 'cos',
    title: 'Lady Victoria of Operations',
    name: 'Victoria',
    role: 'CoS',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    description: 'Orchestrator of Executive Operations & Strategic Implementation',
    expertise: ['Executive Operations', 'Strategic Coordination', 'Organizational Effectiveness', 'Leadership Support'],
    team: [
      {
        id: 'cos-1',
        name: 'Emma',
        role: 'Executive Assistant',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        description: 'Manages executive operations and communications',
        expertise: ['Calendar Management', 'Executive Support', 'Communication Coordination']
      },
      {
        id: 'cos-2',
        name: 'Thomas',
        role: 'Research Assistant',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        description: 'Conducts strategic research and analysis',
        expertise: ['Strategic Research', 'Data Analysis', 'Market Intelligence']
      },
      {
        id: 'cos-3',
        name: 'Sophia',
        role: 'Legal Advisor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        description: 'Provides legal guidance and compliance oversight',
        expertise: ['Legal Advisory', 'Compliance', 'Risk Management', 'Contract Review']
      }
    ]
  },
  advisors: [
    {
      id: 'cfo',
      title: 'Santiago Marín, Chief Finance Officer',
      name: 'Santiago Marín',
      role: 'CFO',
      avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CFO_Santiago.png',
      description: 'Leads financial systems and investment logic for Africa Thryves, ensuring every dollar advances our mission and delivers triple-dividend impact.',
      expertise: ['Financial Strategy', 'Impact Investment', 'Risk Management', 'Social ROI']
    },
    {
      id: 'cmo',
      title: 'Lady Elena of Markets, Chief Marketing Officer',
      name: 'Elena',
      role: 'CMO',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      description: 'Guardian of Brand & Growth',
      expertise: ['Marketing Strategy', 'Brand Development', 'Customer Insights']
    },
    {
      id: 'cto',
      title: 'Sir Marcus of Technology, Chief Technology Officer',
      name: 'Marcus',
      role: 'CTO',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Architect of Digital Realms',
      expertise: ['Tech Strategy', 'Innovation', 'Digital Transformation']
    },
    {
      id: 'coo',
      title: 'Lady Isabella of Operations, Chief Operating Officer',
      name: 'Isabella',
      role: 'COO',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      description: 'Master of Efficiency & Operations',
      expertise: ['Operations Management', 'Process Optimization', 'Supply Chain', 'Team Leadership']
    },
    {
      id: 'strategy',
      title: 'Sir Alexander of Strategy, Chief Strategy Officer',
      name: 'Alexander',
      role: 'CSO',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      description: 'Architect of Long-term Vision',
      expertise: ['Strategic Planning', 'Market Analysis', 'Competitive Intelligence', 'Growth Strategy']
    },
    {
      id: 'cio',
      title: 'Lady Grace of Impact, Chief Impact Officer',
      name: 'Grace',
      role: 'CIO',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      description: 'Guardian of Social Impact & Sustainability',
      expertise: ['Impact Assessment', 'Sustainability', 'Social Innovation', 'Community Development']
    },
    {
      id: 'cel',
      title: 'Clara Reynolds, Community Engagement Lead',
      name: 'Clara Reynolds',
      role: 'CEL',
      avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CEL_Clara.png',
      description: 'Strengthens local-global connection through grassroots support, mobile-first engagement, and culturally grounded visibility strategies.',
      expertise: ['Community Engagement', 'Mobile-First Strategy', 'Cultural Integration', 'Local Initiatives']
    },
    {
      id: 'chro',
      title: 'Jonas Thandi, Chief Human Resources Officer',
      name: 'Jonas Thandi',
      role: 'CHRO',
      avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CHRO_Jonas.png',
      description: 'Cultivates people-centered leadership, trust, and wellbeing across Africa Thryves through systems that empower values-based growth.',
      expertise: ['Values-based Leadership', 'Organizational Development', 'Employee Wellbeing', 'Inclusive Practices']
    }
  ],
  decisions: [],
  setUser: (user) => set({ user }),
  addDecision: (decision) => set((state) => ({ 
    decisions: [...state.decisions, decision]
  })),
  updateDecision: (decision) => set((state) => ({
    decisions: state.decisions.map(d => d.id === decision.id ? decision : d)
  })),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  updateMessageStatus: (messageId, status) => set((state) => ({
    messages: state.messages.map(m => m.id === messageId ? { ...m, status } : m)
  }))
}));