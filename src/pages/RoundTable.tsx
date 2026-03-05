import React from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { Crown, Calculator, Users, MonitorPlay, Megaphone, BarChart3, HeartHandshake, Users2, ScrollText } from 'lucide-react';

// Map of role icons
const roleIcons = {
  'CFO': Calculator,
  'CMO': Megaphone,
  'CTO': MonitorPlay,
  'COO': Users,
  'CSO': BarChart3,
  'CIO': HeartHandshake,
  'CEL': Users2,
  'CHRO': Users,
  'CoS': ScrollText
} as const;

export function RoundTable() {
  const { advisors, assistant } = useStore();
  const numAdvisors = advisors.length;
  const spokeLength = 240; // Length of spokes
  const centerX = 400; // Center X coordinate
  const centerY = 400; // Center Y coordinate

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">The Round Table</h1>
      
      <div className="relative w-[800px] h-[800px] mx-auto mt-8">
        {/* Spokes */}
        {advisors.map((_, index) => {
          const angle = (index * 2 * Math.PI) / numAdvisors - Math.PI / 2;
          return (
            <div
              key={`spoke-${index}`}
              className="absolute top-1/2 left-1/2 h-[1px] bg-amber-700/20 origin-left"
              style={{
                width: `${spokeLength}px`,
                transform: `rotate(${angle}rad)`,
              }}
            />
          );
        })}

        {/* CEO in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <div className="bg-blue-600 rounded-full p-6 shadow-lg hover:shadow-xl transition-shadow border-4 border-white">
            <Crown className="h-12 w-12 text-white" />
          </div>
          <span className="mt-2 font-semibold text-gray-800 text-center">CEO</span>
        </div>

        {/* Advisors */}
        {advisors.map((advisor, index) => {
          const angle = (index * 2 * Math.PI) / numAdvisors - Math.PI / 2;
          const x = spokeLength * Math.cos(angle);
          const y = spokeLength * Math.sin(angle);
          const IconComponent = roleIcons[advisor.role as keyof typeof roleIcons];

          return (
            <Link
              key={advisor.id}
              to={`/advisor/${advisor.id}`}
              className="absolute flex flex-col items-center justify-center"
              style={{
                left: `${centerX + x}px`,
                top: `${centerY + y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="group">
                <div className="w-20 h-20 rounded-full border-4 border-amber-100 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white flex items-center justify-center">
                  <IconComponent className="h-10 w-10 text-blue-600" />
                </div>
                
                {/* Hover card */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-2 left-24 bg-white p-4 rounded-lg shadow-xl transition-all duration-200 w-64 z-30 border border-amber-100">
                  <h3 className="font-semibold text-gray-900">{advisor.title}</h3>
                  <p className="text-sm text-gray-600">{advisor.role}</p>
                  <p className="text-sm text-gray-600 mt-2">{advisor.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {advisor.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm text-center">
                {advisor.role}
              </span>
            </Link>
          );
        })}

        {/* Chief of Staff */}
        <Link 
          to={`/advisor/${assistant.id}`} 
          className="absolute right-0 top-1/2 transform translate-x-8 -translate-y-1/2 flex flex-col items-center"
        >
          <div className="group">
            <div className="w-16 h-16 rounded-full border-4 border-gray-100 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white flex items-center justify-center">
              <ScrollText className="h-8 w-8 text-blue-600" />
            </div>
            
            {/* Hover card */}
            <div className="opacity-0 group-hover:opacity-100 absolute -top-2 right-20 bg-white p-4 rounded-lg shadow-xl transition-all duration-200 w-64 z-30 border border-gray-100">
              <h3 className="font-semibold text-gray-900">{assistant.title}</h3>
              <p className="text-sm text-gray-600">{assistant.role}</p>
              <p className="text-sm text-gray-600 mt-2">{assistant.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {assistant.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="mt-2 text-sm font-medium text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm text-center">
            {assistant.role}
          </span>
        </Link>
      </div>
    </div>
  );
}