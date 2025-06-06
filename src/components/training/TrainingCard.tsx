import React, { useState } from 'react';
import { Brain, Check, RotateCcw } from 'lucide-react';

interface TrainingCardProps {
  spotType: string;
  initialThought: string;
  adaptiveThought: string;
  screenshot?: string;
  onMark: (remembered: boolean) => void;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  spotType,
  initialThought,
  adaptiveThought,
  screenshot,
  onMark,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="max-w-xl mx-auto perspective-1000"
      onClick={handleFlip}
    >
      <div className={`relative transform-style-3d transition-transform duration-500 cursor-pointer ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front of card */}
        <div className={`bg-white rounded-lg shadow-md p-6 backface-hidden ${
          isFlipped ? 'hidden' : ''
        }`}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{spotType}</h3>
            <Brain className="text-blue-600" size={24} />
          </div>
          
          {screenshot && (
            <div className="mb-4">
              <img 
                src={screenshot} 
                alt="Hand situation" 
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}
          
          <p className="text-gray-700">{initialThought}</p>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Click to reveal the optimal thought process
          </div>
        </div>

        {/* Back of card */}
        <div className={`bg-white rounded-lg shadow-md p-6 backface-hidden rotate-y-180 ${
          !isFlipped ? 'hidden' : ''
        }`}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-green-600">Optimal Thought Process</h3>
            <Brain className="text-green-600" size={24} />
          </div>
          
          <p className="text-gray-700 mb-6">{adaptiveThought}</p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMark(true);
              }}
              className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              <Check size={16} className="mr-2" />
              Got it
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMark(false);
              }}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <RotateCcw size={16} className="mr-2" />
              Repeat Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;