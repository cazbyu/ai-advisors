import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useAdvisors } from '../hooks/useAdvisors';

const Communications: React.FC = () => {
  const { advisors, loading, error } = useAdvisors();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading communications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Communications</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200"
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
              <div className="text-sm text-gray-500 mt-2">
                <div className="flex items-center justify-between">
                  <span>No recent messages</span>
                  {advisor.gpt_link && (
                    <a
                      href={advisor.gpt_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Start Chat
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communications;