import { create } from 'zustand';
import type { Advisor, Decision, User, Message, BoardroomSession, BoardroomRound, CompanyProfile } from './types';

interface State {
  user: User | null;
  advisors: Advisor[];
  assistant: Advisor;
  decisions: Decision[];
  messages: Message[];

  // Boardroom state
  currentSession: BoardroomSession | null;
  sessionHistory: BoardroomSession[];
  companyProfile: CompanyProfile | null;
  boardroomLoading: boolean;
  boardroomPhase: 'idle' | 'round1' | 'round2' | 'suggestions' | 'complete';

  // Actions
  setUser: (user: User | null) => void;
  addDecision: (decision: Decision) => void;
  updateDecision: (decision: Decision) => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;

  // Boardroom actions
  setCompanyProfile: (profile: CompanyProfile | null) => void;
  startBoardroomSession: (session: BoardroomSession) => void;
  setBoardroomPhase: (phase: State['boardroomPhase']) => void;
  setBoardroomLoading: (loading: boolean) => void;
  updateCurrentRound: (round: Partial<BoardroomRound>) => void;
  addFollowUp: (round: BoardroomRound) => void;
  completeSession: () => void;
  setSessionHistory: (sessions: BoardroomSession[]) => void;
  clearCurrentSession: () => void;
}

export const useStore = create<State>((set) => ({
  user: null,
  messages: [],
  assistant: {
    id: 'cos',
    title: 'Victoria Chen, Chief of Staff',
    name: 'Victoria Chen',
    role: 'CoS',
    profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    description: 'Orchestrator of Executive Operations & Strategic Implementation',
    expertise: ['Executive Operations', 'Strategic Coordination', 'Organizational Effectiveness', 'Leadership Support'],
    team: [
      {
        id: 'cos-1',
        name: 'Emma',
        role: 'Executive Assistant',
        profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        description: 'Manages executive operations and communications',
        expertise: ['Calendar Management', 'Executive Support', 'Communication Coordination']
      },
      {
        id: 'cos-2',
        name: 'Thomas',
        role: 'Research Assistant',
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        description: 'Conducts strategic research and analysis',
        expertise: ['Strategic Research', 'Data Analysis', 'Market Intelligence']
      },
      {
        id: 'cos-3',
        name: 'Sophia',
        role: 'Legal Advisor',
        profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        description: 'Provides legal guidance and compliance oversight',
        expertise: ['Legal Advisory', 'Compliance', 'Risk Management', 'Contract Review']
      }
    ]
  },
  advisors: [
    {
      id: 'cfo',
      title: 'Santiago Marín, Chief Financial Officer',
      name: 'Santiago Marín',
      role: 'CFO',
      profile_image: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CFO_Santiago.png',
      avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CFO_Santiago.png',
      description: 'Analytical financial leader focused on sustainable growth, ROI clarity, and risk management.',
      expertise: ['Financial Strategy', 'Impact Investment', 'Risk Management', 'Social ROI']
    },
    {
      id: 'cmo',
      title: 'Elena Vasquez, Chief Marketing Officer',
      name: 'Elena Vasquez',
      role: 'CMO',
      profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      description: 'Customer-obsessed brand strategist who turns market insight into growth.',
      expertise: ['Marketing Strategy', 'Brand Development', 'Customer Insights', 'Go-to-Market']
    },
    {
      id: 'cto',
      title: 'Marcus Chen, Chief Technology Officer',
      name: 'Marcus Chen',
      role: 'CTO',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Pragmatic technologist who builds scalable solutions and speaks truth about timelines.',
      expertise: ['Tech Strategy', 'Innovation', 'Digital Transformation', 'Architecture']
    },
    {
      id: 'coo',
      title: 'Isabella Torres, Chief Operating Officer',
      name: 'Isabella Torres',
      role: 'COO',
      profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      description: 'Execution-focused operator who turns strategy into reality.',
      expertise: ['Operations Management', 'Process Optimization', 'Supply Chain', 'Team Leadership']
    },
    {
      id: 'strategy',
      title: 'Alexander Reid, Chief Strategy Officer',
      name: 'Alexander Reid',
      role: 'CSO',
      profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      description: 'Big-picture strategist who connects dots and challenges short-term thinking.',
      expertise: ['Strategic Planning', 'Market Analysis', 'Competitive Intelligence', 'Growth Strategy']
    },
    {
      id: 'cio',
      title: 'Grace Okafor, Chief Impact Officer',
      name: 'Grace Okafor',
      role: 'CIO',
      profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      description: 'Values-driven leader ensuring decisions create sustainable, meaningful impact.',
      expertise: ['Impact Assessment', 'Sustainability', 'Social Innovation', 'Community Development']
    },
    {
      id: 'cel',
      title: 'Clara Reynolds, Community Engagement Lead',
      name: 'Clara Reynolds',
      role: 'CEL',
      profile_image: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CEL_Clara.png',
      avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CEL_Clara.png',
      description: 'Grassroots connector who brings the voice of communities into the boardroom.',
      expertise: ['Community Engagement', 'Mobile-First Strategy', 'Cultural Integration', 'Local Initiatives']
    },
    {
      id: 'chro',
      title: 'Jonas Thandi, Chief Human Resources Officer',
      name: 'Jonas Thandi',
      role: 'CHRO',
      profile_image: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CHRO_Jonas.png',
      avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_CHRO_Jonas.png',
      description: 'People-centered leader who builds culture, trust, and organizational readiness.',
      expertise: ['Values-based Leadership', 'Organizational Development', 'Employee Wellbeing', 'Inclusive Practices']
    }
  ],
  decisions: [],

  // Boardroom initial state
  currentSession: null,
  sessionHistory: [],
  companyProfile: null,
  boardroomLoading: false,
  boardroomPhase: 'idle',

  // Existing actions
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
  })),

  // Boardroom actions
  setCompanyProfile: (profile) => set({ companyProfile: profile }),

  startBoardroomSession: (session) => set({
    currentSession: session,
    boardroomPhase: 'round1',
    boardroomLoading: true
  }),

  setBoardroomPhase: (phase) => set({ boardroomPhase: phase }),
  setBoardroomLoading: (loading) => set({ boardroomLoading: loading }),

  updateCurrentRound: (roundUpdate) => set((state) => {
    if (!state.currentSession) return state;
    const rounds = [...state.currentSession.rounds];
    const lastRound = { ...rounds[rounds.length - 1], ...roundUpdate };
    rounds[rounds.length - 1] = lastRound;
    return { currentSession: { ...state.currentSession, rounds } };
  }),

  addFollowUp: (round) => set((state) => {
    if (!state.currentSession) return state;
    return {
      currentSession: {
        ...state.currentSession,
        followUps: [...state.currentSession.followUps, round]
      }
    };
  }),

  completeSession: () => set((state) => {
    if (!state.currentSession) return state;
    const completed = { ...state.currentSession, status: 'completed' as const };
    return {
      currentSession: completed,
      sessionHistory: [completed, ...state.sessionHistory],
      boardroomPhase: 'complete'
    };
  }),

  setSessionHistory: (sessions) => set({ sessionHistory: sessions }),

  clearCurrentSession: () => set({
    currentSession: null,
    boardroomPhase: 'idle',
    boardroomLoading: false
  }),
}));
