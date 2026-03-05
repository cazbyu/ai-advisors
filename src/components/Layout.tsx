import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Auth } from './Auth';
import { supabase } from '../supabase';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Round Table', href: '/round-table', icon: Users },
    { name: 'Decisions', href: '/decisions', icon: BookOpen },
    { name: 'Communications', href: '/communications', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Virtual Round Table</h1>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <div className="fixed bottom-0 w-full border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around py-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 ${
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  );
}