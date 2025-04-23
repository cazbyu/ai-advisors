import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Advisor } from '../types';

interface DashboardProps {
  advisor?: Advisor;
  onBack?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ advisor: propAdvisor, onBack }) => {
  const { route } = useParams();
  const navigate = useNavigate();
  const [advisor, setAdvisor] = useState<Advisor | null>(propAdvisor || null);
  const [loading, setLoading] = useState(!propAdvisor);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvisor = async () => {
      if (!route) return;
      
      try {
        const { data, error } = await supabase
          .from('advisors')
          .select('*')
          .eq('route', route)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          setError(`No advisor found with route: ${route}`);
          return;
        }

        setAdvisor(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching advisor:', error);
        setError('Failed to load advisor profile');
      } finally {
        setLoading(false);
      }
    };

    if (!propAdvisor && route) {
      fetchAdvisor();
    }
  }, [route, propAdvisor]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/advisors');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading advisor profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={handleBack}
            className="mb-8 flex items-center text-blue-700 hover:text-blue-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Return to Advisors</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back to Advisors List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!advisor) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={handleBack}
          className="mb-8 flex items-center text-blue-700 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Return to Advisors</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header section */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-8">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={advisor.profileImage} 
                  alt={advisor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-6 text-white">
                <h1 className="text-3xl font-bold">{advisor.name}</h1>
                <h2 className="text-xl opacity-90">{advisor.title}</h2>
                {advisor.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {advisor.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="p-8 grid gap-8 md:grid-cols-2">
            {/* Left column */}
            <div className="space-y-6">
              {advisor.bio && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Bio</h3>
                  <p className="text-gray-600">{advisor.bio}</p>
                </div>
              )}

              {advisor.responsibilities && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {advisor.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {advisor.key_decisions && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Decisions</h3>
                  <ul className="space-y-2">
                    {advisor.key_decisions.map((decision, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                        {decision}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {advisor.value_to_org && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Value to Organization</h3>
                  <ul className="space-y-2">
                    {advisor.value_to_org.map((value, index) => (
                      <li key={index} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {advisor.gpt_link && (
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div className="bg-blue-700 text-white p-4">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      <h3 className="font-semibold">Chat with {advisor.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <a 
                      href={advisor.gpt_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Conversation
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;