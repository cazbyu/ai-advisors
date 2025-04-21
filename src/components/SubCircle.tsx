import React, { useState } from 'react';
import { ArrowLeft, Brain, ScrollText, FileText, Search, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  expertise: string[];
  responsibilities: string[];
  decisions: string[];
}

interface SubCircleProps {
  onBack: () => void;
}

export function SubCircle({ onBack }: SubCircleProps) {
  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  const centerMember: TeamMember = {
    id: 'cos',
    name: 'Rowan Reyes',
    role: 'Chief of Staff',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    description: 'Orchestrates executive alignment, prioritization, and decision flow across the AI Advisor system.',
    expertise: ['Executive Operations', 'Strategic Planning', 'Team Leadership', 'Decision Design'],
    responsibilities: [
      'Coordinate agendas, briefings, and cross-role strategy',
      'Serve as connective tissue between leadership and support staff',
      'Oversee decision pathways and execution logs',
      'Support onboarding and communication integrity'
    ],
    decisions: [
      'Which advisor is routed or prioritized',
      'Executive agenda shaping',
      'Timing of key communications or escalations',
      'Internal cohesion or messaging alignment'
    ]
  };

  const teamMembers: TeamMember[] = [
    {
      id: 'ea',
      name: 'Tessa Bennion',
      role: 'Executive Assistant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      description: 'Coordinates executive workflows, documents, and scheduling across the AI Advisor Team.',
      expertise: ['Calendar Management', 'Administrative Operations', 'Communication'],
      responsibilities: [
        'Maintain meeting schedules and team calendar',
        'Draft, edit, and organize internal SOPs',
        'Coordinate between Advisors and Fellows',
        'Manage advisor prompt archives and summaries'
      ],
      decisions: [
        'Escalation routing (who sees what, when)',
        'Message formatting and tone for internal ops',
        'Workflow bottleneck flagging',
        'Meeting prep and briefing consolidation'
      ]
    },
    {
      id: 'la',
      name: 'Anya Marais',
      role: 'Legal Affairs Advisor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      description: 'Provides legal context and risk framing across organizational partnerships, compliance, and content governance.',
      expertise: ['Legal Advisory', 'Compliance', 'Risk Management', 'Policy Development'],
      responsibilities: [
        'Monitor AI, IP, and policy updates',
        'Review legal frameworks tied to partnerships',
        'Draft internal policy language',
        'Guide ethical and risk-based decisions'
      ],
      decisions: [
        'Legal framing of contracts or policies',
        'Risk alerts and escalation points',
        'IP language for AI assets or content',
        'Compliance alignment for fundraising or tech'
      ]
    },
    {
      id: 'ra',
      name: 'Iris Sinclair',
      role: 'Research Assistant',
      avatar: 'https://szcngfdwlktwaefirtux.supabase.co/storage/v1/object/public/public-assets//AI%20Advisor_Research%20Asst_Iris.png',
      description: 'Conducts strategic research and analysis for executive decisions.',
      expertise: ['Strategic Research', 'Data Analysis', 'Market Intelligence'],
      responsibilities: [
        'Conduct market research',
        'Analyze industry trends',
        'Prepare briefings',
        'Support strategic planning'
      ],
      decisions: [
        'Research methodology',
        'Data source selection',
        'Analysis framework',
        'Report prioritization'
      ]
    }
  ];

  const getMemberIcon = (role: string) => {
    switch (role) {
      case 'Executive Assistant':
        return ScrollText;
      case 'Research Assistant':
        return Search;
      case 'Legal Affairs Advisor':
        return Scale;
      default:
        return Brain;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Round Table
        </button>

        {selectedMember ? (
          // Member Dashboard
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <img
                src={selectedMember.avatar}
                alt={`${selectedMember.name} – ${selectedMember.role}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedMember.name}</h1>
                <p className="text-xl text-blue-600">{selectedMember.role}</p>
                <p className="mt-2 text-gray-600">{selectedMember.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Responsibilities</h2>
                <ul className="space-y-4">
                  {selectedMember.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{resp}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Decisions</h2>
                <ul className="space-y-4">
                  {selectedMember.decisions.map((decision, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2 mr-4" />
                      <p className="text-gray-700">{decision}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">Start Consultation</h2>
                  <p className="mb-6">
                    {selectedMember.id === 'ea' 
                      ? 'Connect with Tessa for help with internal processes, advisor access, or documentation support.'
                      : selectedMember.id === 'la'
                      ? 'Connect with Anya for legal framing, ethical risk sensing, or compliance guidance.'
                      : selectedMember.id === 'cos'
                      ? 'Connect with Rowan for decision design, alignment guidance, or executive clarity.'
                      : `Connect with ${selectedMember.name} for guidance on ${selectedMember.role.toLowerCase()} matters.`}
                  </p>
                  <button className="inline-flex items-center px-6 py-3 border-2 border-white rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors">
                    <Brain className="mr-2 h-5 w-5" />
                    Begin Discussion
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Sub-Circle View
          <div className="relative w-[800px] h-[800px] mx-auto">
            {/* Table surface */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-100/20 border-8 border-amber-700/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border-2 border-amber-600/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-amber-600/5" />
            </div>

            {/* Spokes */}
            {teamMembers.map((_, index) => {
              const angle = (index * 2 * Math.PI) / teamMembers.length - Math.PI / 2;
              return (
                <div
                  key={`spoke-${index}`}
                  className="absolute top-1/2 left-1/2 h-[1px] bg-amber-700/20 origin-left"
                  style={{
                    width: '240px',
                    transform: `rotate(${angle}rad)`,
                  }}
                />
              );
            })}

            {/* Center member */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 cursor-pointer"
              onClick={() => setSelectedMember(centerMember)}
            >
              <div 
                className="group"
                onMouseEnter={() => setHoveredMember(centerMember)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white flex items-center justify-center">
                  <Brain className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <span className="mt-2 font-semibold text-gray-800 text-center">{centerMember.role}</span>
            </div>

            {/* Team members */}
            {teamMembers.map((member, index) => {
              const angle = (index * 2 * Math.PI) / teamMembers.length - Math.PI / 2;
              const x = 240 * Math.cos(angle);
              const y = 240 * Math.sin(angle);
              const Icon = getMemberIcon(member.role);

              return (
                <div
                  key={member.id}
                  className="absolute flex flex-col items-center justify-center cursor-pointer"
                  style={{
                    left: `${400 + x}px`,
                    top: `${400 + y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div 
                    className="group"
                    onMouseEnter={() => setHoveredMember(member)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    <div className="w-20 h-20 rounded-full border-4 border-amber-100 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white overflow-hidden">
                      {member.id === 'ra' ? (
                        <img
                          src={member.avatar}
                          alt={`${member.name} – ${member.role}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="h-10 w-10 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm text-center">
                    {member.role}
                  </span>
                </div>
              );
            })}

            {/* Hover card */}
            {hoveredMember && (
              <div 
                className="bg-white p-6 rounded-xl shadow-xl border border-amber-100 opacity-0 animate-fade-in"
                style={{
                  position: 'fixed',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -120%)',
                  width: '288px',
                  zIndex: 50,
                  animation: 'fadeIn 0.2s ease forwards',
                }}
              >
                <h3 className="font-semibold text-gray-900">{hoveredMember.name}</h3>
                <p className="text-sm text-gray-600">{hoveredMember.role}</p>
                <p className="text-sm text-gray-600 mt-2">{hoveredMember.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {hoveredMember.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}