import { Advisor } from '../types';

export const advisors: Advisor[] = [
  {
    id: 'action',
    name: 'Chief of Staff',
    role: 'CoS',
    title: 'Chief of Staff',
    subtitle: 'Action',
    responsibility: 'Strategic execution and team coordination',
    contributions: [
      'Cross-functional alignment',
      'Strategic initiative execution',
      'Team effectiveness optimization'
    ],
    profileImage: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isActionNode: true,
    route: 'cos',
    bio: 'Orchestrating strategic initiatives and ensuring seamless cross-functional collaboration.',
    tags: ['Strategy', 'Operations', 'Leadership'],
    responsibilities: [
      'Drive strategic initiatives across departments',
      'Facilitate executive decision-making',
      'Optimize organizational effectiveness'
    ],
    key_decisions: [
      'Resource allocation optimization',
      'Strategic partnership development',
      'Process improvement implementation'
    ],
    value_to_org: [
      'Enhanced operational efficiency',
      'Improved cross-functional coordination',
      'Accelerated strategic execution'
    ],
    gpt_link: 'https://chat.openai.com/g/your-cos-advisor'
  },
  {
    id: 'marketing',
    name: 'Chief Marketing Officer',
    role: 'CMO',
    title: 'Chief Marketing Officer',
    subtitle: 'Marketing',
    responsibility: 'Brand strategy and market outreach',
    contributions: [
      'Brand development and positioning',
      'Marketing campaign effectiveness',
      'Customer acquisition strategies'
    ],
    profileImage: 'https://images.pexels.com/photos/3760514/pexels-photo-3760514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'cmo',
    bio: 'Leading brand strategy and market expansion initiatives.',
    tags: ['Marketing', 'Branding', 'Growth'],
    responsibilities: [
      'Develop and execute marketing strategies',
      'Build and maintain brand identity',
      'Drive customer acquisition and retention'
    ],
    key_decisions: [
      'Market positioning strategy',
      'Campaign budget allocation',
      'Channel optimization'
    ],
    value_to_org: [
      'Enhanced brand visibility',
      'Increased market share',
      'Improved customer engagement'
    ],
    gpt_link: 'https://chat.openai.com/g/your-cmo-advisor'
  },
  {
    id: 'operations',
    name: 'Chief Operations Officer',
    role: 'COO',
    title: 'Chief Operations Officer',
    subtitle: 'Operations',
    responsibility: 'Operational excellence and process optimization',
    contributions: [
      'Business process reengineering',
      'Resource allocation efficiency',
      'Operational risk management'
    ],
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'coo',
    bio: 'Driving operational excellence and sustainable growth.',
    tags: ['Operations', 'Efficiency', 'Process'],
    responsibilities: [
      'Optimize operational processes',
      'Manage resource allocation',
      'Drive continuous improvement'
    ],
    key_decisions: [
      'Process automation initiatives',
      'Supply chain optimization',
      'Quality management systems'
    ],
    value_to_org: [
      'Improved operational efficiency',
      'Reduced operational costs',
      'Enhanced quality standards'
    ],
    gpt_link: 'https://chat.openai.com/g/your-coo-advisor'
  },
  {
    id: 'community',
    name: 'Chief Engagement & Learning Officer',
    role: 'CEL',
    title: 'Chief Engagement & Learning Officer',
    subtitle: 'Community',
    responsibility: 'Community engagement and learning initiatives',
    contributions: [
      'Community program development',
      'Learning experience design',
      'Stakeholder engagement'
    ],
    profileImage: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'cel',
    bio: 'Building engaged communities through innovative learning experiences.',
    tags: ['Community', 'Learning', 'Engagement'],
    responsibilities: [
      'Design learning programs',
      'Foster community engagement',
      'Develop stakeholder relationships'
    ],
    key_decisions: [
      'Learning platform selection',
      'Community program design',
      'Engagement metrics definition'
    ],
    value_to_org: [
      'Enhanced community engagement',
      'Improved learning outcomes',
      'Stronger stakeholder relationships'
    ],
    gpt_link: 'https://chat.openai.com/g/your-cel-advisor'
  },
  {
    id: 'impact',
    name: 'Chief Impact Officer',
    role: 'CIO',
    title: 'Chief Impact Officer',
    subtitle: 'Impact',
    responsibility: 'Social impact measurement and initiatives',
    contributions: [
      'Impact assessment frameworks',
      'Sustainability programs',
      'Social value creation'
    ],
    profileImage: 'https://images.pexels.com/photos/3771839/pexels-photo-3771839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'cio',
    bio: 'Maximizing social impact through sustainable initiatives.',
    tags: ['Impact', 'Sustainability', 'Social Value'],
    responsibilities: [
      'Develop impact strategies',
      'Measure social outcomes',
      'Drive sustainability initiatives'
    ],
    key_decisions: [
      'Impact measurement framework',
      'Sustainability program design',
      'Social value metrics'
    ],
    value_to_org: [
      'Increased social impact',
      'Enhanced sustainability',
      'Improved stakeholder value'
    ],
    gpt_link: 'https://chat.openai.com/g/your-cio-advisor'
  },
  {
    id: 'hr',
    name: 'Chief Human Resources Officer',
    role: 'CHRO',
    title: 'Chief Human Resources Officer',
    subtitle: 'Human Resources',
    responsibility: 'People and culture development',
    contributions: [
      'Talent management',
      'Culture building',
      'Employee experience'
    ],
    profileImage: 'https://images.pexels.com/photos/3776932/pexels-photo-3776932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'chro',
    bio: 'Fostering organizational culture and talent development.',
    tags: ['HR', 'Culture', 'Talent'],
    responsibilities: [
      'Develop HR strategies',
      'Build company culture',
      'Manage talent acquisition'
    ],
    key_decisions: [
      'Talent development programs',
      'Culture initiatives',
      'HR policy framework'
    ],
    value_to_org: [
      'Enhanced employee engagement',
      'Improved talent retention',
      'Stronger company culture'
    ],
    gpt_link: 'https://chat.openai.com/g/your-chro-advisor'
  },
  {
    id: 'tech',
    name: 'Chief Technology Officer',
    role: 'CTO',
    title: 'Chief Technology Officer',
    subtitle: 'Technology',
    responsibility: 'Technology strategy and innovation',
    contributions: [
      'Technical architecture',
      'Innovation management',
      'Digital transformation'
    ],
    profileImage: 'https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'cto',
    bio: 'Driving technological innovation and digital transformation.',
    tags: ['Technology', 'Innovation', 'Digital'],
    responsibilities: [
      'Define tech strategy',
      'Lead innovation initiatives',
      'Manage digital transformation'
    ],
    key_decisions: [
      'Technology stack selection',
      'Innovation roadmap',
      'Digital transformation strategy'
    ],
    value_to_org: [
      'Enhanced technical capabilities',
      'Accelerated innovation',
      'Improved digital presence'
    ],
    gpt_link: 'https://chat.openai.com/g/your-cto-advisor'
  },
  {
    id: 'strategy',
    name: 'Chief Strategy Officer',
    role: 'CSO',
    title: 'Chief Strategy Officer',
    subtitle: 'Strategy',
    responsibility: 'Strategic planning and execution',
    contributions: [
      'Strategic planning',
      'Market analysis',
      'Growth strategy'
    ],
    profileImage: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'cso',
    bio: 'Crafting and executing organizational strategy for sustainable growth.',
    tags: ['Strategy', 'Planning', 'Growth'],
    responsibilities: [
      'Develop corporate strategy',
      'Lead strategic planning',
      'Drive growth initiatives'
    ],
    key_decisions: [
      'Strategic direction setting',
      'Growth opportunity identification',
      'Market expansion strategy'
    ],
    value_to_org: [
      'Clear strategic direction',
      'Enhanced market position',
      'Sustainable growth'
    ],
    gpt_link: 'https://chat.openai.com/g/your-cso-advisor'
  },
  {
    id: 'finance',
    name: 'Chief Financial Officer',
    role: 'CFO',
    title: 'Chief Financial Officer',
    subtitle: 'Finance',
    responsibility: 'Financial strategy and management',
    contributions: [
      'Financial planning',
      'Investment strategy',
      'Risk management'
    ],
    profileImage: 'https://images.pexels.com/photos/3760958/pexels-photo-3760958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: 'cfo',
    bio: 'Managing financial strategy and ensuring fiscal responsibility.',
    tags: ['Finance', 'Investment', 'Risk'],
    responsibilities: [
      'Manage financial strategy',
      'Oversee investments',
      'Control risk exposure'
    ],
    key_decisions: [
      'Investment allocation',
      'Financial planning',
      'Risk management strategy'
    ],
    value_to_org: [
      'Strong financial performance',
      'Optimized resource allocation',
      'Effective risk management'
    ],
    gpt_link: 'https://chat.openai.com/g/your-cfo-advisor'
  }
];