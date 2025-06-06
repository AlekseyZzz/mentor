import React, { useState } from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  activity: string;
  isProductiveTime: boolean;
}

interface TimeBug {
  id: string;
  description: string;
  reason: string;
  solution: string;
  category: 'poker' | 'life';
}

const DailyTimeTracker: React.FC = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [timeBugs, setTimeBugs] = useState<TimeBug[]>([]);
  const [newBlock, setNewBlock] = useState({
    startTime: '',
    endTime: '',
    activity: '',
    isProductiveTime: true
  });
  const [newBug, setNewBug] = useState({
    description: '',
    reason: '',
    solution: '',
    category: 'poker' as const
  });

  const addTimeBlock = () => {
    if (newBlock.startTime && newBlock.endTime && newBlock.activity) {
      setTimeBlocks([
        ...timeBlocks,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...newBlock
        }
      ]);
      setNewBlock({
        startTime: '',
        endTime: '',
        activity: '',
        isProductiveTime: true
      });
    }
  };

  const addTimeBug = () => {
    if (newBug.description && newBug.reason && newBug.solution) {
      setTimeBugs([
        ...timeBugs,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...newBug
        }
      ]);
      setNewBug({
        description: '',
        reason: '',
        solution: '',
        category: 'poker'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Clock className="mr-2 text-blue-600" size={20} />
          Time Blocks
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="time"
              value={newBlock.startTime}
              onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Start Time"
            />
            <input
              type="time"
              value={newBlock.endTime}
              onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
              placeholder="End Time"
            />
            <input
              type="text"
              value={newBlock.activity}
              onChange={(e) => setNewBlock({ ...newBlock, activity: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Activity Description"
            />
            <button
              onClick={addTimeBlock}
              className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
            >
              Add Block
            </button>
          </div>

          <div className="space-y-2">
            {timeBlocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
              >
                <div className="flex items-center">
                  <span className="text-gray-600">
                    {block.startTime} - {block.endTime}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{block.activity}</span>
                </div>
                <div className="flex items-center">
                  {block.isProductiveTime ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <AlertCircle size={16} className="text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <AlertCircle className="mr-2 text-red-600" size={20} />
          Time Bugs
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              value={newBug.description}
              onChange={(e) => setNewBug({ ...newBug, description: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
              placeholder="What time was lost or wasted?"
            />
            <input
              type="text"
              value={newBug.reason}
              onChange={(e) => setNewBug({ ...newBug, reason: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
              placeholder="Why was this a bug?"
            />
            <input
              type="text"
              value={newBug.solution}
              onChange={(e) => setNewBug({ ...newBug, solution: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
              placeholder="How will you fix this tomorrow?"
            />
            <div className="flex items-center space-x-4">
              <select
                value={newBug.category}
                onChange={(e) => setNewBug({ ...newBug, category: e.target.value as 'poker' | 'life' })}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="poker">Poker-related</option>
                <option value="life">Life-related</option>
              </select>
              <button
                onClick={addTimeBug}
                className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
              >
                Add Time Bug
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {timeBugs.map((bug) => (
              <div
                key={bug.id}
                className="bg-red-50 p-4 rounded-md space-y-2"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-red-800">{bug.description}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    bug.category === 'poker' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {bug.category}
                  </span>
                </div>
                <p className="text-sm text-red-700">Why: {bug.reason}</p>
                <p className="text-sm text-green-700">Solution: {bug.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTimeTracker;