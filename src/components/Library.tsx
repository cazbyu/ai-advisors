import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { useAdvisors } from '../hooks/useAdvisors';
import { useDocuments } from '../hooks/useDocuments';
import AdvisorCard from './AdvisorCard';

const Library: React.FC = () => {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | undefined>();
  const { advisors, loading: advisorsLoading, error: advisorsError } = useAdvisors();
  const { documents, loading: documentsLoading, error: documentsError } = useDocuments(selectedAdvisor);

  const loading = advisorsLoading || documentsLoading;
  const error = advisorsError || documentsError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading library...</div>
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

  const getAdvisorDocuments = (advisorId: string) => {
    return documents.filter(doc => doc.advisor === advisorId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Strategic Library</h1>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="form-select rounded-lg border-gray-300 text-gray-700"
              onChange={(e) => setSelectedAdvisor(e.target.value || undefined)}
              value={selectedAdvisor || ''}
            >
              <option value="">All Advisors</option>
              {advisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {advisors.map((advisor) => (
            <AdvisorCard
              key={advisor.id}
              advisor={advisor}
              documents={getAdvisorDocuments(advisor.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;