import React from 'react';
import { Trophy, Calendar, Siren as Fire, Brain } from 'lucide-react';

interface ProgressStatsProps {
  stats: {
    training_streak: number;
    current_week: number;
    current_day: number;
    completed_lessons: number;
  };
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Fire className="text-blue-600 mr-2\" size={20} />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Current Streak</h4>
            <p className="text-2xl font-bold text-blue-700">{stats.training_streak} days</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Trophy className="text-green-600 mr-2" size={20} />
          <div>
            <h4 className="text-sm font-medium text-green-900">Lessons Completed</h4>
            <p className="text-2xl font-bold text-green-700">{stats.completed_lessons}</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Calendar className="text-purple-600 mr-2" size={20} />
          <div>
            <h4 className="text-sm font-medium text-purple-900">Current Week</h4>
            <p className="text-2xl font-bold text-purple-700">{stats.current_week}</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Brain className="text-orange-600 mr-2" size={20} />
          <div>
            <h4 className="text-sm font-medium text-orange-900">Day Progress</h4>
            <p className="text-2xl font-bold text-orange-700">{stats.current_day}/7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;