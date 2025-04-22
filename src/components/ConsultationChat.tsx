import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { supabase } from '../supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConsultationChatProps {
  onClose: () => void;
}

export function ConsultationChat({ onClose }: ConsultationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeConversation();
      } else {
        setError('Please sign in to start a consultation');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeConversation();
      } else {
        setError('Please sign in to start a consultation');
      }
    });

    return () => {
      subscription.unsubscribe();
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  const initializeConversation = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        setError('Please sign in to start a consultation');
        return;
      }

      const initialMessage = "Hello! I'm Alex Stratton, Chief Strategy Officer. How can I assist you with strategic planning, organizational development, or growth leadership today?";

      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          advisor_id: 'strategy',
          title: 'Strategy Consultation',
          preview: initialMessage,
        })
        .select()
        .single();

      if (convError) throw convError;

      setConversationId(conversation.id);

      const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          role: 'advisor',
          content: initialMessage,
        })
        .select()
        .single();

      if (msgError) throw msgError;

      setMessages([
        {
          id: message.id,
          role: 'assistant',
          content: initialMessage,
          timestamp: new Date(message.created_at),
        },
      ]);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      setError('Failed to start conversation. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !conversationId) return;

    setError(null);
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to Supabase
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          content: input,
        });

      if (msgError) throw msgError;

      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/call-alex-gpt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
          const retryTimeoutId = window.setTimeout(() => {
            setError(null);
            setRetryTimeout(null);
          }, retryAfter * 1000);
          
          setRetryTimeout(retryTimeoutId);
          throw new Error('Service is busy. Please wait a moment before trying again.');
        }
        
        throw new Error(
          errorData.error || `Server responded with status ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.content) {
        throw new Error('Invalid response format from server');
      }

      const { data: savedMessage, error: aiMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'advisor',
          content: data.content,
        })
        .select()
        .single();

      if (aiMsgError) throw aiMsgError;

      const assistantMessage: Message = {
        id: savedMessage.id,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(savedMessage.created_at),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat flow:', error);
      setError(error.message || 'Failed to get response. Please try again.');
      
      // Remove the user message if we couldn't get a response
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
            alt="Alex Stratton"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">Alex Stratton</h3>
            <p className="text-sm text-gray-600">Chief Strategy Officer</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                !isAuthenticated 
                  ? "Please sign in to chat"
                  : retryTimeout 
                    ? "Please wait before sending another message..."
                    : "Type your message..."
              }
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isAuthenticated || isLoading || !!retryTimeout}
            />
            <button
              type="submit"
              disabled={!isAuthenticated || isLoading || !!retryTimeout}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}