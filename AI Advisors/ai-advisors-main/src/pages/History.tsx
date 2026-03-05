import React, { useState, useEffect } from 'react';
import { Clock, MessageSquare, Users, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

interface SessionSummary {
  id: string;
  question: string;
  selected_advisors: string[];
  status: string;
  created_at: string;
}

export function History() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('id, question, selected_advisors, status, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetail = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
      return;
    }

    setExpandedId(id);
    setLoadingDetail(true);

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setExpandedData(data);
    } catch (err) {
      console.error('Error loading session detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const ROLE_LABELS: Record<string, string> = {
    cfo: 'CFO', cmo: 'CMO', cto: 'CTO', coo: 'COO',
    strategy: 'CSO', cio: 'CIO', cel: 'CEL', chro: 'CHRO',
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view session history</h2>
          <p className="text-gray-500">Your past boardroom discussions will appear here.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Session History</h1>
      <p className="text-gray-500 mb-6">Review past boardroom discussions and the advice you received.</p>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h2>
          <p className="text-gray-500">Start a boardroom discussion and it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => loadSessionDetail(session.id)}
                className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{session.question}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">{formatDate(session.created_at)}</span>
                      <div className="flex gap-1">
                        {session.selected_advisors.map(id => (
                          <span key={id} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {ROLE_LABELS[id] || id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${expandedId === session.id ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {expandedId === session.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  {loadingDetail ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    </div>
                  ) : expandedData ? (
                    <div className="space-y-4 text-sm">
                      {/* Round 1 */}
                      {expandedData.round1_responses && expandedData.round1_responses.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-700 mb-2">Initial Perspectives</h3>
                          {expandedData.round1_responses.map((r: any, i: number) => (
                            <div key={i} className="mb-3">
                              <span className="font-medium text-gray-800">{r.name} ({r.role}):</span>
                              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{r.response}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Round 2 */}
                      {expandedData.round2_responses && expandedData.round2_responses.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-700 mb-2">Cross-Examination</h3>
                          {expandedData.round2_responses.map((r: any, i: number) => (
                            <div key={i} className="mb-3">
                              <span className="font-medium text-gray-800">{r.name} ({r.role}):</span>
                              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{r.response}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Could not load session details.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
