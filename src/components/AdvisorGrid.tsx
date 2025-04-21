import React from 'react';
import { Brain } from 'lucide-react';

interface Advisor {
  id: string;
  name: string;
  role: string;
  profile_image: string;
  expertise: string[];
  description: string;
  gpt_link?: string;
}

interface AdvisorGridProps {
  advisors: Advisor[];
}

export function AdvisorGrid({ advisors }: AdvisorGridProps) {
  if (!advisors.length) {
    return null;
  }

  return (
    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {advisors.map((advisor) => (
        <div
          key={advisor.id}
          className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex flex-col items-center">
            <img
              src={advisor.profile_image}
              alt={`${advisor.name} - ${advisor.role}`}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
            />
            <h3 className="mt-4 font-semibold text-gray-900 text-center">
              {advisor.name}
            </h3>
            <p className="text-sm text-gray-600 text-center">{advisor.role}</p>
            <p className="mt-2 text-sm text-gray-600 text-center line-clamp-2">
              {advisor.description}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {advisor.expertise.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
            {advisor.gpt_link && (
              <a
                href={advisor.gpt_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Brain className="h-4 w-4 mr-2" />
                <span className="text-sm">Consult</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}