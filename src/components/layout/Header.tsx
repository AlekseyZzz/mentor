import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, Search } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/pre-session':
        return 'Pre-Session Protocol';
      case '/post-session':
        return 'Post-Session Reflection';
      case '/progress':
        return 'Progress Tracker';
      case '/analysis':
        return 'Image Analysis';
      case '/knowledge':
        return 'Knowledge Base';
      case '/settings':
        return 'Settings';
      default:
        return 'AI Poker Mentor';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        
        <div className="relative mx-4 flex-1 max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 transition duration-150 ease-in-out text-sm"
            placeholder="Search for concepts, hands, or notes..."
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <Bell size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <User size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;