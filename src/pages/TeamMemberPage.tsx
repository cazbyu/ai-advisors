import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { useStore } from '../store';
import { Chat } from '../components/Chat';

export function TeamMemberPage() {
  const { advisorId, memberId } = useParams();
  const { advisors, assistant } = useStore();
  const [showChat, setShowChat] = useState(false);
  
  const advisor = advisorId === 'assistant' 
    ? assistant 
    : advisors.find(a => a.id === advisorId);
    
  const member = advisor?.team?.find(m => m.id === memberId);

  if (!member || !advisor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Team member not found</h1>
      </div>
    );
  }

  // Define role-specific content for team members
  const roleContent = {
    // Financial Team
    'cfo-1': {
      decisions: [
        'Financial reporting accuracy',
        'Internal controls implementation',
        'Accounting policy compliance',
        'Budget monitoring',
        'Cost analysis oversight'
      ],
      value: [
        'Ensures financial accuracy',
        'Maintains regulatory compliance',
        'Strengthens internal controls',
        'Improves financial visibility',
        'Supports decision-making'
      ]
    },
    'cfo-2': {
      decisions: [
        'Cash flow management',
        'Investment portfolio oversight',
        'Banking relationship management',
        'Working capital optimization',
        'Funding strategy execution'
      ],
      value: [
        'Optimizes cash utilization',
        'Maximizes investment returns',
        'Ensures liquidity',
        'Reduces financing costs',
        'Strengthens financial position'
      ]
    },
    'cfo-3': {
      decisions: [
        'Risk assessment methodology',
        'Insurance coverage optimization',
        'Compliance monitoring',
        'Risk mitigation strategies',
        'Control framework development'
      ],
      value: [
        'Minimizes financial risks',
        'Protects company assets',
        'Ensures regulatory compliance',
        'Strengthens risk management',
        'Improves control environment'
      ]
    },
    // Marketing Team
    'cmo-1': {
      decisions: [
        'Brand identity guidelines',
        'Marketing campaign themes',
        'Visual design standards',
        'Brand partnership selection',
        'Brand message consistency'
      ],
      value: [
        'Strengthens brand identity',
        'Ensures consistent messaging',
        'Builds brand recognition',
        'Enhances brand value',
        'Drives market positioning'
      ]
    },
    'cmo-2': {
      decisions: [
        'Digital campaign strategy',
        'Channel optimization',
        'Content calendar planning',
        'Performance metrics selection',
        'Marketing technology adoption'
      ],
      value: [
        'Maximizes digital presence',
        'Improves campaign ROI',
        'Enhances customer engagement',
        'Drives online growth',
        'Optimizes marketing spend'
      ]
    },
    // Technology Team
    'cto-1': {
      decisions: [
        'Architecture design',
        'Technology selection',
        'Development methodology',
        'Team structure',
        'Technical roadmap'
      ],
      value: [
        'Ensures technical excellence',
        'Drives innovation',
        'Improves development efficiency',
        'Maintains system reliability',
        'Enables scalability'
      ]
    },
    'cto-2': {
      decisions: [
        'Security policy development',
        'Risk assessment protocols',
        'Security tool selection',
        'Incident response planning',
        'Compliance framework'
      ],
      value: [
        'Protects digital assets',
        'Ensures data security',
        'Maintains compliance',
        'Reduces security risks',
        'Builds trust'
      ]
    },
    'cto-3': {
      decisions: [
        'Infrastructure planning',
        'Cloud strategy',
        'Capacity management',
        'System monitoring',
        'Disaster recovery'
      ],
      value: [
        'Ensures system reliability',
        'Optimizes performance',
        'Enables scalability',
        'Reduces downtime',
        'Manages costs'
      ]
    },
    // Operations Team
    'coo-1': {
      decisions: [
        'Vendor selection',
        'Supply chain optimization',
        'Inventory management',
        'Logistics planning',
        'Cost reduction initiatives'
      ],
      value: [
        'Optimizes supply chain',
        'Reduces costs',
        'Improves efficiency',
        'Ensures reliability',
        'Manages relationships'
      ]
    },
    'coo-2': {
      decisions: [
        'Quality standards development',
        'Process improvement',
        'Performance metrics',
        'Compliance monitoring',
        'Training programs'
      ],
      value: [
        'Ensures quality',
        'Improves processes',
        'Reduces errors',
        'Maintains standards',
        'Enhances efficiency'
      ]
    },
    // Strategy Team
    'strategy-1': {
      decisions: [
        'Growth opportunity assessment',
        'Partnership evaluation',
        'Market entry planning',
        'Business model innovation',
        'Strategic initiative prioritization'
      ],
      value: [
        'Drives growth',
        'Identifies opportunities',
        'Develops partnerships',
        'Enables innovation',
        'Optimizes resources'
      ]
    },
    'strategy-2': {
      decisions: [
        'Market analysis methodology',
        'Competitive intelligence gathering',
        'Trend identification',
        'Research prioritization',
        'Data analysis framework'
      ],
      value: [
        'Provides market insights',
        'Informs strategy',
        'Identifies trends',
        'Supports decisions',
        'Reduces uncertainty'
      ]
    },
    // Legal Team
    'clo-1': {
      decisions: [
        'Contract review process',
        'Legal risk assessment',
        'Corporate governance',
        'Policy development',
        'Regulatory compliance'
      ],
      value: [
        'Ensures legal compliance',
        'Protects interests',
        'Reduces risks',
        'Strengthens governance',
        'Facilitates transactions'
      ]
    },
    'clo-2': {
      decisions: [
        'Compliance program design',
        'Training requirements',
        'Audit planning',
        'Policy implementation',
        'Regulatory monitoring'
      ],
      value: [
        'Ensures compliance',
        'Reduces risks',
        'Protects reputation',
        'Maintains standards',
        'Prevents issues'
      ]
    },
    // HR Team
    'chro-1': {
      decisions: [
        'Recruitment strategy',
        'Candidate assessment',
        'Employer branding',
        'Talent pipeline development',
        'Hiring process optimization'
      ],
      value: [
        'Attracts talent',
        'Improves hiring quality',
        'Reduces time-to-hire',
        'Strengthens workforce',
        'Builds reputation'
      ]
    },
    'chro-2': {
      decisions: [
        'Training program design',
        'Development pathway planning',
        'Learning platform selection',
        'Skill gap analysis',
        'Career progression framework'
      ],
      value: [
        'Develops talent',
        'Improves capabilities',
        'Increases retention',
        'Enables growth',
        'Builds leadership'
      ]
    },
    'chro-3': {
      decisions: [
        'Culture initiative planning',
        'Engagement program design',
        'Workplace experience',
        'Recognition programs',
        'Wellness initiatives'
      ],
      value: [
        'Enhances culture',
        'Improves engagement',
        'Increases satisfaction',
        'Reduces turnover',
        'Builds community'
      ]
    },
    // Assistant Team
    'assistant-1': {
      decisions: [
        'Schedule optimization',
        'Meeting coordination',
        'Time allocation',
        'Priority management',
        'Calendar integration'
      ],
      value: [
        'Maximizes efficiency',
        'Reduces conflicts',
        'Optimizes time',
        'Improves coordination',
        'Ensures availability'
      ]
    },
    'assistant-2': {
      decisions: [
        'Document organization',
        'Filing system design',
        'Information categorization',
        'Access management',
        'Archive maintenance'
      ],
      value: [
        'Improves accessibility',
        'Ensures organization',
        'Maintains records',
        'Facilitates retrieval',
        'Protects information'
      ]
    }
  };

  const content = roleContent[member.id as keyof typeof roleContent] || {
    decisions: [
      'Role-specific decision making',
      'Process optimization',
      'Team coordination',
      'Resource allocation',
      'Quality assurance'
    ],
    value: [
      'Improves efficiency',
      'Ensures quality',
      'Supports team goals',
      'Enhances operations',
      'Drives results'
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to={`/advisor/${advisorId}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {advisor.role}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Member Profile */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
              <p className="text-xl text-blue-600 mt-1">{member.role}</p>
              <p className="text-gray-600 mt-4">{member.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Consultation CTA */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Seek Guidance</h2>
          <p className="mb-6">
            Consult with {member.name} for expert advice on {member.role.toLowerCase()} matters and leverage their specialized experience.
          </p>
          <button 
            onClick={() => setShowChat(true)}
            className="inline-flex items-center px-6 py-3 border-2 border-white rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
          >
            <Brain className="mr-2 h-5 w-5" />
            
            Request Consultation
          </button>
        </div>

        {/* Decision Responsibilities */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Decision Areas</h2>
          <ul className="space-y-4">
            {content.decisions.map((decision, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                  {index + 1}
                </div>
                <p className="text-gray-700">{decision}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Value Contribution */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Value to Organization</h2>
          <ul className="space-y-4">
            {content.value.map((value, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2 mr-4" />
                <p className="text-gray-700">{value}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <Chat advisor={member} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}