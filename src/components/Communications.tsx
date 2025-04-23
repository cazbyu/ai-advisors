import React from 'react';
import { MessageSquare } from 'lucide-react';
import { advisors } from '../data/advisors';

const Communications: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Communications</h1>
        <div className="grid gap-4">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center space-x-4 mb-3">
                <img
                  src={advisor.profileImage}
                  alt={advisor.title}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{advisor.title}</h3>
                  <p className="text-sm text-gray-600">{advisor.role}</p>
                </div>
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-gray-500">
                No recent messages
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communications;