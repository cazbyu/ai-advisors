import React from 'react';
import { BookOpen } from 'lucide-react';
import { advisors } from '../data/advisors';

const Library: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Strategic Library</h1>
        <div className="grid gap-4">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
            >
              <img
                src={advisor.profileImage}
                alt={advisor.title}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{advisor.title}</h3>
                <p className="text-sm text-gray-600">{advisor.role} Documents</p>
              </div>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;