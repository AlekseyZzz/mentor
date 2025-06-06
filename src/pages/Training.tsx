import React from 'react';
import { useTraining } from '../hooks/useTraining';
import LessonCard from '../components/training/LessonCard';
import ProgressStats from '../components/training/ProgressStats';
import { Brain, AlertCircle } from 'lucide-react';

const Training: React.FC = () => {
  const { 
    currentLesson, 
    stats, 
    dueReviews,
    complete,
    loading,
    error 
  } = useTraining();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="text-red-600 mr-2" size={20} />
          <p className="text-red-700">Failed to load training data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Brain className="mr-2 text-blue-600" size={24} />
          Mental Game Training
        </h2>

        {stats && <ProgressStats stats={stats} />}

        <div className="mt-8">
          {currentLesson ? (
            <LessonCard
              lesson={currentLesson}
              onComplete={async (rating, notes) => {
                await complete(currentLesson.id, rating, notes);
              }}
            />
          ) : (
            <div className="text-center py-8">
              <Brain size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Lesson Available</h3>
              <p className="text-gray-600">
                You've completed all available lessons for today.
                Check back tomorrow for new content!
              </p>
            </div>
          )}
        </div>

        {dueReviews && dueReviews.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Due for Review</h3>
            <div className="space-y-4">
              {dueReviews.map((review) => (
                <div
                  key={review.lesson_id}
                  className="p-4 bg-blue-50 rounded-lg"
                >
                  <h4 className="font-medium">{review.training_lessons.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Time to reinforce your learning
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;