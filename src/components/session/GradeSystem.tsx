import React from 'react';
import { Brain, Target, AlertCircle } from 'lucide-react';

interface GradeSystemProps {
  grade: string;
  onGradeChange: (grade: string) => void;
  feeling: string;
  onFeelingChange: (feeling: string) => void;
  contributors: string;
  onContributorsChange: (contributors: string) => void;
  improvements: string;
  onImprovementsChange: (improvements: string) => void;
}

const GradeSystem: React.FC<GradeSystemProps> = ({
  grade,
  onGradeChange,
  feeling,
  onFeelingChange,
  contributors,
  onContributorsChange,
  improvements,
  onImprovementsChange,
}) => {
  const grades = ['A', 'B', 'C', 'D'];

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'A':
        return 'bg-green-600 hover:bg-green-700';
      case 'B':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'C':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'D':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Game Quality Grade
        </label>
        <div className="flex space-x-2">
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => onGradeChange(g)}
              className={`px-6 py-2 text-white rounded-md ${
                grade === g 
                  ? `${getGradeColor(g)} ring-2 ring-offset-2 ring-blue-500` 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {grade && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Brain size={16} className="mr-2 text-blue-600" />
              How did this level feel?
            </label>
            <textarea
              value={feeling}
              onChange={(e) => onFeelingChange(e.target.value)}
              placeholder="e.g., Calm, confident, decisions were intuitive"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Target size={16} className="mr-2 text-blue-600" />
              What contributed to this performance?
            </label>
            <textarea
              value={contributors}
              onChange={(e) => onContributorsChange(e.target.value)}
              placeholder="e.g., Good sleep, focused warm-up, deep breathing"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <AlertCircle size={16} className="mr-2 text-blue-600" />
              What can you repeat or improve next time?
            </label>
            <textarea
              value={improvements}
              onChange={(e) => onImprovementsChange(e.target.value)}
              placeholder="e.g., Do a short reset after bad beats, reduce distractions"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeSystem;