import React from 'react';
import { Clock, Award, Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface SessionCardProps {
  date: string;
  duration: string;
  gameType: string;
  performance: string;
  mentalState: string;
  profit: number;
}

const SessionCard: React.FC<SessionCardProps> = ({
  date,
  duration,
  gameType,
  performance,
  mentalState,
  profit,
}) => {
  const getPerformanceColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProfitColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getProfitIcon = (value: number) => {
    return value >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  return (
    <div className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex flex-wrap justify-between items-start">
        <div className="mb-2">
          <h3 className="font-medium">{gameType}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className={`flex items-center font-medium ${getProfitColor(profit)}`}>
          {getProfitIcon(profit)}
          <span className="ml-1">${Math.abs(profit)}</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          {duration}
        </div>
        <div className="flex items-center text-sm">
          <Award size={14} className={`mr-1 ${getPerformanceColor(performance)}`} />
          <span className={getPerformanceColor(performance)}>
            Performance: {performance}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Brain size={14} className="mr-1" />
          {mentalState}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;