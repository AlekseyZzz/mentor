import React, { useState } from 'react';
import { Brain, Star, Clock, CheckCircle } from 'lucide-react';
import { TrainingLesson } from '../../lib/api/training';

interface LessonCardProps {
  lesson: TrainingLesson;
  onComplete: (rating: number, notes: string) => Promise<void>;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onComplete }) => {
  const [showReflection, setShowReflection] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = async () => {
    if (rating === 0) return;
    
    try {
      setSubmitting(true);
      await onComplete(rating, notes);
      setShowReflection(false);
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <Brain className="mr-2 text-blue-600" size={20} />
            {lesson.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-1" />
            {lesson.estimated_minutes} min
          </div>
        </div>

        <div className="prose max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: lesson.content_body }} />
        </div>

        {!showReflection ? (
          <button
            onClick={() => setShowReflection(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Complete Lesson
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How well did you understand this concept?
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`p-2 rounded-full ${
                      rating >= value 
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star size={24} fill={rating >= value ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your reflections or questions (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="What did you learn? Any questions?"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleComplete}
                disabled={rating === 0 || submitting}
                className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center ${
                  (rating === 0 || submitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <CheckCircle size={16} className="mr-2" />
                {submitting ? 'Saving...' : 'Mark as Complete'}
              </button>
              <button
                onClick={() => setShowReflection(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;