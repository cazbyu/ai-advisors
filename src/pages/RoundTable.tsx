import React from 'react';
import { AdvisorGrid } from '../components/AdvisorGrid';
import { useAdvisors } from '../hooks/useAdvisors';

export function RoundTable() {
  const { advisors, loading, error } = useAdvisors();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Virtual Round Table</h1>
        <p className="mt-2 text-gray-600">
          Meet your advisory team of industry experts ready to guide you through key decisions.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <AdvisorGrid advisors={advisors} />
      </div>
    </div>
  );
}