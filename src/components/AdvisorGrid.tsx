import React from 'react';
import { Link } from 'react-router-dom';
import type { Advisor } from '../types';

interface AdvisorGridProps {
  advisors: Advisor[];
}

export function AdvisorGrid({ advisors }: AdvisorGridProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (!advisors.length) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">No advisors available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {advisors.map((advisor) => (
        <Link
          key={advisor.id}
          to={`/advisor/${advisor.route}`}
          className="group flex flex-col items-center p-4 transition-transform hover:scale-105"
        >
          <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-blue-100 bg-blue-50 shadow-md transition-shadow group-hover:shadow-lg sm:h-24 sm:w-24 md:h-28 md:w-28">
            {advisor.profile_image ? (
              <>
                <img
                  src={advisor.profile_image}
                  alt={advisor.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center text-xl font-semibold text-blue-600">
                  {getInitials(advisor.name)}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-blue-600">
                {getInitials(advisor.name)}
              </div>
            )}
          </div>
          
          <h3 className="text-center font-medium text-gray-900 group-hover:text-blue-600">
            {advisor.title}
          </h3>
          
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {advisor.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}