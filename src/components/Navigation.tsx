import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, MessageSquare } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Round Table', path: '/advisors' },
    { icon: BookOpen, label: 'Library', path: '/library' },
    { icon: MessageSquare, label: 'Communications', path: '/comms' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {tabs.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors duration-200 ${
              isActive(path) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className={`text-xs ${isActive(path) ? 'font-medium' : ''}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;