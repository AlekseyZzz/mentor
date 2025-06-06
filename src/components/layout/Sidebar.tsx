import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRight, 
  ArrowLeft, 
  BarChart2, 
  Image, 
  BookOpen, 
  Settings,
  Brain,
  Dumbbell,
  Calendar
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/pre-session', icon: <ArrowRight size={20} />, label: 'Pre-Session' },
    { to: '/post-session', icon: <ArrowLeft size={20} />, label: 'Post-Session' },
    { to: '/history', icon: <Calendar size={20} />, label: 'History' },
    { to: '/progress', icon: <BarChart2 size={20} />, label: 'Progress' },
    { to: '/analysis', icon: <Image size={20} />, label: 'Analysis' },
    { to: '/knowledge', icon: <BookOpen size={20} />, label: 'Knowledge Base' },
    { to: '/training', icon: <Dumbbell size={20} />, label: 'Training' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside 
      className={`bg-blue-900 text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-blue-800">
        {!collapsed && (
          <div className="flex items-center">
            <Brain className="mr-2\" size={24} />
            <span className="font-bold text-lg">Poker Mentor</span>
          </div>
        )}
        {collapsed && <Brain className="mx-auto" size={24} />}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-blue-800 focus:outline-none"
        >
          {collapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </button>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="mb-2">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 hover:bg-blue-800 transition-colors ${
                    isActive ? 'bg-blue-800' : ''
                  }`
                }
              >
                <span className={collapsed ? 'mx-auto' : 'mr-3'}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;