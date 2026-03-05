import React from 'react';
import { Brain } from 'lucide-react';

interface Advisor {
  id: string;
  name: string;
  role: string;
  profile_image: string;
  expertise: string[];
  gpt_link?: string;
}

interface AdvisorCarouselProps {
  advisors: Advisor[];
}

export function AdvisorCarousel({ advisors }: AdvisorCarouselProps) {
  if (!advisors.length) {
    return null;
  }

  return (
    <div className="md:hidden overflow-x-auto pb-6 -mx-4">
      <div className="flex whitespace-nowrap space-x-4 px-4">
        {advisors.map((advisor) => (
          <div
            key={advisor.id}
            className="inline-block w-[250px] bg-white rounded-xl shadow p-4"
          >
            <div className="flex flex-col items-center">
              <img
                src={advisor.profile_image}
                alt={`${advisor.name} - ${advisor.role}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
              />
              <h3 className="mt-3 font-semibold text-gray-900 text-center">
                {advisor.name}
              </h3>
              <p className="text-sm text-gray-600 text-center">{advisor.role}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {advisor.expertise.slice(0, 2).map((skill) => (
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
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Brain className="h-4 w-4 mr-1" />
                  <span className="text-sm">Consult</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}