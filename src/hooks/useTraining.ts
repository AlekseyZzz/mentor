import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrainingLesson, 
  UserProgress,
  getTodayLesson,
  completeLesson,
  getTrainingStats,
  getDueReviews
} from '../lib/api/training';

export const useTraining = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentLesson, setCurrentLesson] = useState<TrainingLesson | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [dueReviews, setDueReviews] = useState<any[]>([]);
  const { user } = useAuth();

  const loadTrainingData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const [lessonData, statsData, reviewsData] = await Promise.all([
        getTodayLesson(),
        getTrainingStats(user.id),
        getDueReviews()
      ]);

      setCurrentLesson(lessonData);
      setStats(statsData);
      setDueReviews(reviewsData);
    } catch (err) {
      console.error('Failed to load training data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load training data'));
    } finally {
      setLoading(false);
    }
  };

  const complete = async (
    lessonId: string,
    rating: number,
    notes: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      await completeLesson(lessonId, rating, notes);
      await loadTrainingData(); // Refresh data
    } catch (err) {
      console.error('Failed to complete lesson:', err);
      setError(err instanceof Error ? err : new Error('Failed to complete lesson'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadTrainingData();
  }, [user]);

  return {
    currentLesson,
    stats,
    dueReviews,
    complete,
    refresh: loadTrainingData,
    loading,
    error
  };
};