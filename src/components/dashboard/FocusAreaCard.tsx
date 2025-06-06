import React from 'react';
import { Activity } from 'lucide-react';

interface FocusAreaCardProps {
  title: string;
  progress: number;
  category: string;
}

const FocusAreaCard: React.FC<FocusAreaCardProps> = ({ title, progress, category }) => {
  const getProgressColor = (value: number) => {
    if (value < 30) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'Mental Game':
        return 'bg-purple-100 text-purple-800';
      case 'Strategy':
        return 'bg-blue-100 text-blue-800';
      case 'Physical Game':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <Activity size={18} className="text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getProgressColor(progress)}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FocusAreaCard;