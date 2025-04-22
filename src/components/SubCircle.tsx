import React, { useState } from 'react';
import { ArrowLeft, Brain, ScrollText, FileText, Search, Scale } from 'lucide-react';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { DEFAULT_PROFILE_IMAGE } from '../constants';
import type { TeamMember } from '../types';

interface SubCircleProps {
  onBack: () => void;
}

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

export function SubCircle({ onBack }: SubCircleProps) {
  const { teamMembers, loading, error } = useTeamMembers('cos');
  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

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
                src={selectedMember.profile_image || selectedMember.avatar || DEFAULT_PROFILE_IMAGE}
                alt={`${selectedMember.name} – ${selectedMember.role}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedMember.name}</h1>
                <p className="text-xl text-blue-600">{selectedMember.role}</p>
                <p className="mt-2 text-gray-600">{selectedMember.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Start Consultation</h2>
                <p className="mb-6">
                  Connect with {selectedMember.name} for guidance on {selectedMember.role.toLowerCase()} matters.
                </p>
                <button className="inline-flex items-center px-6 py-3 border-2 border-white rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors">
                  <Brain className="mr-2 h-5 w-5" />
                  Begin Discussion
                </button>
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
                  onMouseEnter={() => setHoveredMember(member)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className="group">
                    <div className="w-20 h-20 rounded-full border-4 border-amber-100 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white overflow-hidden">
                      <img
                        src={member.profile_image || member.avatar || DEFAULT_PROFILE_IMAGE}
                        alt={`${member.name} – ${member.role}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                        }}
                      />
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