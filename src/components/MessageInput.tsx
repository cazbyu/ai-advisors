import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSend, disabled, placeholder }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);
      await onSend(content);
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        ref={inputRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type your message..."}
        disabled={disabled || isLoading}
        className="flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        rows={1}
      />
      <button
        type="submit"
        disabled={disabled || isLoading || !content.trim()}
        className="rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </form>
  );
}