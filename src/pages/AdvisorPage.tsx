import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { useAdvisorByRoute } from '../hooks/useAdvisorByRoute';
import { useMessages } from '../hooks/useMessages';
import { MessageThread } from '../components/MessageThread';
import { MessageInput } from '../components/MessageInput';
import { supabase } from '../supabase';

export function AdvisorPage() {
  const { route } = useParams();
  const { advisor, loading: advisorLoading, error: advisorError } = useAdvisorByRoute(route || '');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { messages, loading: messagesLoading, sendMessage } = useMessages(conversationId || '');

  useEffect(() => {
    if (showChat && advisor && !conversationId) {
      initializeConversation();
    }
  }, [showChat, advisor]);

  const initializeConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !advisor) return;

      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          advisor_id: advisor.id,
          title: `Consultation with ${advisor.name}`,
          preview: `Started conversation with ${advisor.name}`,
        })
        .select()
        .single();

      if (error) throw error;
      setConversationId(conversation.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;
    await sendMessage(content, 'user');
  };

  if (advisorLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (advisorError || !advisor) {
    return (
      <div className="p-4 text-red-600">
        {advisorError || 'Advisor not found'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/round-table" className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Round Table
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Advisor Profile */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="flex items-start space-x-6">
            <img
              src={advisor.profile_image}
              alt={advisor.name}
              className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{advisor.title}</h1>
              <p className="mt-4 text-gray-600">{advisor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {advisor.tags?.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        {showChat ? (
          <div className="flex h-[600px] flex-col rounded-xl bg-white shadow-lg">
            <div className="border-b p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={advisor.profile_image}
                  alt={advisor.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{advisor.name}</h3>
                  <p className="text-sm text-gray-600">{advisor.title}</p>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <MessageThread messages={messages} loading={messagesLoading} />
            </div>

            <div className="border-t p-4">
              <MessageInput
                onSend={handleSendMessage}
                disabled={!conversationId}
                placeholder="Type your message..."
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold">Start Consultation</h2>
            <p className="mb-6">
              Begin your consultation with {advisor.name} to receive expert guidance
              and insights.
            </p>
            <button
              onClick={() => setShowChat(true)}
              className="inline-flex items-center rounded-lg border-2 border-white px-6 py-3 text-white transition-colors hover:bg-white hover:text-blue-600"
            >
              <Brain className="mr-2 h-5 w-5" />
              Begin Discussion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}