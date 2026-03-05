import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { Chat } from '../components/Chat';
import { ConsultationChat } from '../components/ConsultationChat';
import { AdvisorCarousel } from '../components/AdvisorCarousel';
import { AdvisorGrid } from '../components/AdvisorGrid';
import { supabase } from '../supabase';
import type { Advisor, TeamMember } from '../types';

export function AdvisorPage() {
  const { id } = useParams();
  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all advisors
        const { data: allAdvisors, error: advisorsError } = await supabase
          .from('advisors')
          .select('*')
          .order('role');

        if (advisorsError) throw advisorsError;
        setAdvisors(allAdvisors || []);

        // If we're looking at a specific advisor, get their details
        if (id) {
          const { data: currentAdvisor, error: advisorError } = await supabase
            .from('advisors')
            .select('*')
            .eq('id', id)
            .single();

          if (advisorError) throw advisorError;
          setAdvisor(currentAdvisor);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load advisor details');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !advisor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {error || 'Advisor not found'}
        </h1>
      </div>
    );
  }

  const roleContent = {
    cfo: {
      decisions: [
        'Financial resource allocation',
        'Investment strategies',
        'Risk management policies',
        'Budget approvals',
        'Capital structure decisions'
      ],
      value: [
        'Optimizes financial performance',
        'Ensures sustainable growth',
        'Protects company assets',
        'Maximizes shareholder value',
        'Maintains financial stability'
      ]
    },
    cso: {
      decisions: [
        'Long-term strategic planning',
        'Market entry strategies',
        'Partnership opportunities',
        'Business model innovation',
        'Competitive positioning'
      ],
      value: [
        'Shapes company direction',
        'Identifies growth opportunities',
        'Creates competitive advantage',
        'Drives innovation',
        'Ensures strategic alignment'
      ]
    }
  };

  const content = roleContent[advisor.id as keyof typeof roleContent] || {
    decisions: [],
    value: []
  };

  const ChatComponent = advisor.id === 'cso' ? ConsultationChat : Chat;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to="/round-table" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Round Table
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Advisor Profile */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
              <img 
                src={advisor.profile_image || advisor.avatar}
                alt={advisor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{advisor.title}</h1>
              <p className="text-xl text-blue-600 mt-1">{advisor.role}</p>
              <p className="text-gray-600 mt-4">{advisor.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {advisor.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Consultation CTA */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Seek Counsel</h2>
          <p className="mb-6">
            Tap into centuries of wisdom and experience. Consult with {advisor.name} for strategic guidance on your most important decisions.
          </p>
          <button 
            onClick={() => setShowChat(true)}
            className="inline-flex items-center px-6 py-3 border-2 border-white rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors"
          >
            <Brain className="mr-2 h-5 w-5" />
            Start Consultation
          </button>
        </div>

        {/* Decision Responsibilities */}
        {content.decisions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Decision Responsibilities</h2>
            <ul className="space-y-4">
              {content.decisions.map((decision, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{decision}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Value Contribution */}
        {content.value.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Value to Organization</h2>
            <ul className="space-y-4">
              {content.value.map((value, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2 mr-4" />
                  <p className="text-gray-700">{value}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Advisor Carousel */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Advisors</h2>
        <AdvisorCarousel advisors={advisors.filter(a => a.id !== advisor.id)} />
      </div>

      {/* Desktop/Tablet Advisor Grid */}
      <div className="mt-12">
        <AdvisorGrid advisors={advisors.filter(a => a.id !== advisor.id)} />
      </div>

      {/* Chat Modal */}
      {showChat && advisor && (
        <ChatComponent advisor={advisor} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}