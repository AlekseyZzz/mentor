import React, { useState } from 'react';
import { Search, BookOpen, Star, Clock, Filter, ChevronDown, Brain } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock knowledge base entries
  const entries = [
    {
      id: 1,
      title: "3-Bet Pot Strategy",
      description: "Comprehensive guide to navigating 3-bet pots as both the aggressor and defender.",
      category: "strategy",
      difficulty: "intermediate",
      tags: ["3-betting", "preflop", "position"],
      lastAccessed: "2 days ago",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Mental Game: Controlling Tilt",
      description: "Techniques for recognizing and managing emotional responses at the poker table.",
      category: "mental",
      difficulty: "beginner",
      tags: ["tilt", "emotions", "focus"],
      lastAccessed: "1 week ago",
      isFavorite: true,
    },
    {
      id: 3,
      title: "Range vs. Range Analysis",
      description: "How to think about poker decisions in terms of ranges rather than specific hands.",
      category: "strategy",
      difficulty: "advanced",
      tags: ["hand reading", "ranges", "equity"],
      lastAccessed: "3 days ago",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Bet Sizing Theory",
      description: "Mathematical approach to optimal bet sizing in different scenarios.",
      category: "strategy",
      difficulty: "intermediate",
      tags: ["bet sizing", "GTO", "math"],
      lastAccessed: "5 days ago",
      isFavorite: false,
    },
    {
      id: 5,
      title: "Physical Game: Stamina & Focus",
      description: "Optimizing physical condition for long poker sessions.",
      category: "physical",
      difficulty: "beginner",
      tags: ["health", "endurance", "nutrition"],
      lastAccessed: "2 weeks ago",
      isFavorite: false,
    },
    {
      id: 6,
      title: "Multiway Pot Dynamics",
      description: "Adjusting strategy when playing against multiple opponents.",
      category: "strategy",
      difficulty: "intermediate",
      tags: ["multiway", "position", "stack depth"],
      lastAccessed: "1 day ago",
      isFavorite: true,
    },
  ];

  const filteredEntries = entries.filter(entry => {
    if (filter === 'favorites' && !entry.isFavorite) return false;
    if (filter === 'strategy' && entry.category !== 'strategy') return false;
    if (filter === 'mental' && entry.category !== 'mental') return false;
    if (filter === 'physical' && entry.category !== 'physical') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'strategy':
        return 'bg-blue-100 text-blue-800';
      case 'mental':
        return 'bg-purple-100 text-purple-800';
      case 'physical':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out"
                placeholder="Search concepts, strategies, or tags..."
              />
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter size={16} className="mr-1" />
                Filters
                <ChevronDown size={16} className="ml-1" />
              </button>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Content</option>
                <option value="favorites">Favorites</option>
                <option value="strategy">Strategy</option>
                <option value="mental">Mental Game</option>
                <option value="physical">Physical Game</option>
              </select>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Strategy</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Mental Game</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Physical Game</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h3>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Beginner</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Intermediate</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Advanced</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Last Accessed</h3>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Last 7 days</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Last 30 days</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">All time</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="border border-gray-200 rounded-lg hover:shadow-sm transition-shadow p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{entry.title}</h3>
                <button className={`text-gray-400 hover:text-yellow-500 ${entry.isFavorite ? 'text-yellow-500' : ''}`}>
                  <Star size={18} fill={entry.isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
              
              <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(entry.category)}`}>
                  {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(entry.difficulty)}`}>
                  {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                </span>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {entry.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                Last accessed: {entry.lastAccessed}
              </div>
            </div>
          ))}
        </div>
        
        {filteredEntries.length === 0 && (
          <div className="text-center py-8">
            <BookOpen size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No entries found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Personalized Recommendations</h2>
        <div className="space-y-4">
          <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-blue-800">Based on your recent sessions</h3>
                <p className="mt-1 text-sm text-blue-700">
                  You've been working on your 3-bet strategy. Consider exploring "Balanced 3-Bet Ranges" to take your game to the next level.
                </p>
                <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                  View recommendation →
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-purple-100 bg-purple-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                <Brain size={20} className="text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-purple-800">Your learning path</h3>
                <p className="mt-1 text-sm text-purple-700">
                  Complete your "Advanced Hand Reading" module to unlock the next level of strategic thinking.
                </p>
                <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-purple-600" style={{ width: '65%' }}></div>
                </div>
                <p className="mt-1 text-xs text-purple-700">65% complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;