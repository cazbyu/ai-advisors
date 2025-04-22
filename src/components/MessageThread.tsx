import React, { useRef, useEffect } from 'react';
import type { Message } from '../hooks/useMessages';

interface MessageThreadProps {
  messages: Message[];
  loading?: boolean;
}

export function MessageThread({ messages, loading }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <span className="mt-1 block text-xs opacity-70">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}