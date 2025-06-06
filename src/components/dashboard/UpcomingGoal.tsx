import React from 'react';
import { Calendar } from 'lucide-react';

interface UpcomingGoalProps {
  title: string;
  deadline: string;
  progress: number;
}

const UpcomingGoal: React.FC<UpcomingGoalProps> = ({ title, deadline, progress }) => {
  return (
    <div className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
      <h3 className="font-medium">{title}</h3>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <Calendar size={14} className="mr-1" />
        {deadline}
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-blue-600" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingGoal;