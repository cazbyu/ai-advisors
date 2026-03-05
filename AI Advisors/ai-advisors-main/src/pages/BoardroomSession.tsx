import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Users, UserCheck, AlertCircle, MessageSquare, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import { nanoid } from 'nanoid';
import type { AdvisorResponse, BoardroomRound } from '../types';

export function BoardroomSession() {
  const { user } = useAuth();
  const {
    advisors,
    companyProfile,
    currentSession,
    boardroomPhase,
    boardroomLoading,
    startBoardroomSession,
    setBoardroomPhase,
    setBoardroomLoading,
    updateCurrentRound,
    addFollowUp,
    completeSession,
    clearCurrentSession,
  } = useStore();

  const [question, setQuestion] = useState('');
  const [selectedAdvisorIds, setSelectedAdvisorIds] = useState<string[]>(advisors.map(a => a.id));
  const [error, setError] = useState<string | null>(null);
  const [expandedRound2, setExpandedRound2] = useState<Record<string, boolean>>({});
  const discussionEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    discussionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession, boardroomPhase]);

  const toggleAdvisor = (id: string) => {
    setSelectedAdvisorIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedAdvisorIds(advisors.map(a => a.id));
  const deselectAll = () => setSelectedAdvisorIds([]);

  const getCompanyContext = (): string | undefined => {
    if (!companyProfile) return undefined;
    const parts = [];
    if (companyProfile.companyName) parts.push(`Company: ${companyProfile.companyName}`);
    if (companyProfile.industry) parts.push(`Industry: ${companyProfile.industry}`);
    if (companyProfile.companySize) parts.push(`Size: ${companyProfile.companySize}`);
    if (companyProfile.companyDescription) parts.push(`About: ${companyProfile.companyDescription}`);
    return parts.length > 0 ? parts.join('\n') : undefined;
  };

  const callBoardroomAPI = async (payload: object) => {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/boardroom-discuss`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${response.status}`);
    }

    return response.json();
  };

  const handleAskBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || selectedAdvisorIds.length === 0 || boardroomLoading) return;
    if (!user) {
      setError('Please sign in to start a boardroom session.');
      return;
    }

    setError(null);
    const sessionId = nanoid();
    const selectedAdvisors = advisors.filter(a => selectedAdvisorIds.includes(a.id));
    const companyContext = getCompanyContext();

    const newRound: BoardroomRound = {
      question: question.trim(),
      round1: [],
      round2: [],
      suggestedQuestions: [],
    };

    startBoardroomSession({
      id: sessionId,
      userId: user.id,
      question: question.trim(),
      selectedAdvisors: selectedAdvisorIds,
      rounds: [newRound],
      followUps: [],
      createdAt: new Date().toISOString(),
      status: 'in_progress',
    });

    try {
      // Round 1: Initial perspectives
      const r1Data = await callBoardroomAPI({
        phase: 'round1',
        question: question.trim(),
        companyContext,
        selectedAdvisors: selectedAdvisors.map(a => ({ id: a.id, name: a.name, role: a.role })),
      });

      updateCurrentRound({ round1: r1Data.responses });
      setBoardroomPhase('round2');

      // Round 2: Cross-examination
      const r2Data = await callBoardroomAPI({
        phase: 'round2',
        question: question.trim(),
        companyContext,
        round1Responses: r1Data.responses,
        selectedAdvisors: selectedAdvisors.map(a => ({ id: a.id, name: a.name, role: a.role })),
      });

      updateCurrentRound({ round2: r2Data.responses });
      setBoardroomPhase('suggestions');

      // Round 3: Suggested questions
      const sqData = await callBoardroomAPI({
        phase: 'suggestions',
        question: question.trim(),
        round1Responses: r1Data.responses,
        round2Responses: r2Data.responses,
      });

      updateCurrentRound({ suggestedQuestions: sqData.suggestedQuestions });
      setBoardroomPhase('complete');
      setBoardroomLoading(false);
    } catch (err: any) {
      console.error('Boardroom error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setBoardroomLoading(false);
      setBoardroomPhase('complete');
    }
  };

  const handleFollowUp = async (followUpQuestion: string) => {
    if (!currentSession || boardroomLoading) return;
    setError(null);
    setBoardroomLoading(true);
    setBoardroomPhase('round1');

    const selectedAdvisors = advisors.filter(a => selectedAdvisorIds.includes(a.id));
    const companyContext = getCompanyContext();

    // Build conversation history from previous rounds
    const prevRounds = [...currentSession.rounds, ...currentSession.followUps];
    const history = prevRounds.map(r => ({
      question: r.question,
      round1: r.round1,
      round2: r.round2,
    }));

    try {
      const r1Data = await callBoardroomAPI({
        phase: 'round1',
        question: followUpQuestion,
        companyContext,
        selectedAdvisors: selectedAdvisors.map(a => ({ id: a.id, name: a.name, role: a.role })),
        conversationHistory: history,
      });

      const newRound: BoardroomRound = {
        question: followUpQuestion,
        round1: r1Data.responses,
        round2: [],
        suggestedQuestions: [],
      };
      addFollowUp(newRound);
      setBoardroomPhase('round2');

      const r2Data = await callBoardroomAPI({
        phase: 'round2',
        question: followUpQuestion,
        companyContext,
        round1Responses: r1Data.responses,
        selectedAdvisors: selectedAdvisors.map(a => ({ id: a.id, name: a.name, role: a.role })),
        conversationHistory: history,
      });

      // Update last follow-up
      useStore.setState((state) => {
        if (!state.currentSession) return state;
        const followUps = [...state.currentSession.followUps];
        const last = { ...followUps[followUps.length - 1], round2: r2Data.responses };
        followUps[followUps.length - 1] = last;
        return { currentSession: { ...state.currentSession, followUps } };
      });
      setBoardroomPhase('suggestions');

      const sqData = await callBoardroomAPI({
        phase: 'suggestions',
        question: followUpQuestion,
        round1Responses: r1Data.responses,
        round2Responses: r2Data.responses,
      });

      useStore.setState((state) => {
        if (!state.currentSession) return state;
        const followUps = [...state.currentSession.followUps];
        const last = { ...followUps[followUps.length - 1], suggestedQuestions: sqData.suggestedQuestions };
        followUps[followUps.length - 1] = last;
        return { currentSession: { ...state.currentSession, followUps } };
      });

      setBoardroomPhase('complete');
      setBoardroomLoading(false);
    } catch (err: any) {
      console.error('Follow-up error:', err);
      setError(err.message || 'Something went wrong with the follow-up.');
      setBoardroomLoading(false);
      setBoardroomPhase('complete');
    }
  };

  const handleNewSession = () => {
    clearCurrentSession();
    setQuestion('');
    setError(null);
  };

  const getAdvisorAvatar = (advisorId: string) => {
    const advisor = advisors.find(a => a.id === advisorId);
    return advisor?.profile_image || advisor?.avatar || '';
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      CFO: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      CMO: 'bg-purple-100 text-purple-800 border-purple-200',
      CTO: 'bg-blue-100 text-blue-800 border-blue-200',
      COO: 'bg-orange-100 text-orange-800 border-orange-200',
      CSO: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      CIO: 'bg-rose-100 text-rose-800 border-rose-200',
      CEL: 'bg-teal-100 text-teal-800 border-teal-200',
      CHRO: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Render a single discussion round
  const renderRound = (round: BoardroomRound, index: number, isFollowUp: boolean = false) => (
    <div key={`round-${index}-${isFollowUp ? 'fu' : 'main'}`} className="space-y-6">
      {/* Question */}
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-5 py-3 max-w-2xl shadow-sm">
          <p className="font-medium">{round.question}</p>
        </div>
      </div>

      {/* Round 1: Initial Perspectives */}
      {round.round1.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            <MessageSquare className="h-4 w-4" />
            Initial Perspectives
          </div>
          {round.round1.map((r) => (
            <div key={r.advisorId} className="flex items-start gap-3">
              <img
                src={getAdvisorAvatar(r.advisorId)}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleColor(r.role)}`}>
                    {r.role}
                  </span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{r.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Round 2: Cross-Examination */}
      {round.round2.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            <Users className="h-4 w-4" />
            Cross-Examination & Debate
          </div>
          {round.round2.map((r) => (
            <div key={`r2-${r.advisorId}`} className="flex items-start gap-3">
              <img
                src={getAdvisorAvatar(r.advisorId)}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleColor(r.role)}`}>
                    {r.role}
                  </span>
                  <span className="text-xs text-gray-400 italic">responding to the table</span>
                </div>
                <div className="bg-amber-50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-amber-100">
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{r.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Questions */}
      {round.suggestedQuestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            <Lightbulb className="h-4 w-4" />
            Suggested Follow-Up Questions
          </div>
          <div className="flex flex-wrap gap-2">
            {round.suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleFollowUp(sq)}
                disabled={boardroomLoading}
                className="text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Boardroom</h1>
        <p className="text-gray-500 mt-1">
          Ask your executive team a question. They'll share perspectives, then challenge each other.
        </p>
      </div>

      {/* Company context indicator */}
      {!companyProfile && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <strong>Tip:</strong> Add your company details in{' '}
          <a href="/profile" className="underline font-medium">Profile</a>{' '}
          so advisors can tailor their advice to your business.
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Question Input (shown when no active session) */}
      {!currentSession && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
          {/* Advisor selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Who's at the table?</label>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ask All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAll}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {advisors.map(advisor => {
                const isSelected = selectedAdvisorIds.includes(advisor.id);
                return (
                  <button
                    key={advisor.id}
                    onClick={() => toggleAdvisor(advisor.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                      isSelected
                        ? getRoleColor(advisor.role) + ' shadow-sm'
                        : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <img
                      src={advisor.profile_image || advisor.avatar}
                      alt={advisor.name}
                      className={`w-6 h-6 rounded-full object-cover ${!isSelected ? 'opacity-40' : ''}`}
                    />
                    {advisor.role}
                    {isSelected && <UserCheck className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question input */}
          <form onSubmit={handleAskBoard}>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Your question to the board</label>
            <div className="flex gap-3">
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="e.g., Should we expand into East Africa this year, or focus on strengthening our current markets first?"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows={3}
                disabled={!user}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-400">
                {selectedAdvisorIds.length} advisor{selectedAdvisorIds.length !== 1 ? 's' : ''} selected
              </span>
              <button
                type="submit"
                disabled={!user || !question.trim() || selectedAdvisorIds.length === 0}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Ask the Board
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Session Display */}
      {currentSession && (
        <div className="space-y-8">
          {/* New session button */}
          <div className="flex justify-end">
            <button
              onClick={handleNewSession}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              + New Question
            </button>
          </div>

          {/* Main round */}
          {currentSession.rounds.map((round, i) => renderRound(round, i))}

          {/* Follow-up rounds */}
          {currentSession.followUps.map((round, i) => (
            <React.Fragment key={`fu-${i}`}>
              <hr className="border-gray-200" />
              {renderRound(round, i, true)}
            </React.Fragment>
          ))}

          {/* Loading indicator */}
          {boardroomLoading && (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">
                {boardroomPhase === 'round1' && 'Advisors are sharing their perspectives...'}
                {boardroomPhase === 'round2' && 'Advisors are debating and challenging each other...'}
                {boardroomPhase === 'suggestions' && 'Generating follow-up questions...'}
              </span>
            </div>
          )}

          {/* Follow-up input */}
          {!boardroomLoading && boardroomPhase === 'complete' && (
            <div className="mt-6">
              <FollowUpInput onSubmit={handleFollowUp} />
            </div>
          )}

          <div ref={discussionEndRef} />
        </div>
      )}
    </div>
  );
}

// Separate component for the follow-up input
function FollowUpInput({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask a follow-up question..."
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
