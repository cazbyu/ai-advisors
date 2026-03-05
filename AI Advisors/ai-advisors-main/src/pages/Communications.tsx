import React, { useState } from 'react';
import { MessageSquare, Clock, ThumbsUp, Archive, Search } from 'lucide-react';
import { useStore } from '../store';

type Tab = 'inbox' | 'pending' | 'consider' | 'archived';

export function Communications() {
  const [activeTab, setActiveTab] = useState<Tab>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const { messages } = useStore();

  const tabs = [
    { id: 'inbox', name: 'Inbox', icon: MessageSquare },
    { id: 'pending', name: 'Waiting for Response', icon: Clock },
    { id: 'consider', name: 'To Consider', icon: ThumbsUp },
    { id: 'archived', name: 'Archived', icon: Archive },
  ] as const;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="mt-2 text-gray-600">Manage your conversations with advisors</p>
          
          {/* Search */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Message List */}
        <div className="divide-y">
          {messages
            .filter((message) => message.status === activeTab)
            .filter((message) =>
              searchQuery
                ? message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  message.preview.toLowerCase().includes(searchQuery.toLowerCase())
                : true
            )
            .map((message) => (
              <div key={message.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start space-x-4">
                  <img
                    src={message.advisor.avatar}
                    alt={message.advisor.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {message.advisor.name}
                      </p>
                      <p className="text-sm text-gray-500">{message.date}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-1">{message.title}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{message.preview}</p>
                  </div>
                </div>
              </div>
            ))}

          {messages.filter((message) => message.status === activeTab).length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No messages in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
}