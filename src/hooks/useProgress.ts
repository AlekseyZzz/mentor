import { useState } from 'react';
import { ProgressMetrics, ProgressGoal, getProgressMetrics, getProgressGoals, updateGoal, createGoal } from '../lib/api/progress';

export const useProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = async (timeRange: 'week' | 'month' | 'year' = 'month') => {
    try {
      setLoading(true);
      setError(null);
      const metrics = await getProgressMetrics(timeRange);
      return metrics;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch progress metrics'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const goals = await getProgressGoals();
      return goals;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch goals'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProgressGoal = async (goalId: string, updates: Partial<ProgressGoal>) => {
    try {
      setLoading(true);
      setError(null);
      const goal = await updateGoal(goalId, updates);
      return goal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update goal'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProgressGoal = async (goal: Omit<ProgressGoal, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newGoal = await createGoal(goal);
      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create goal'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchMetrics,
    fetchGoals,
    updateProgressGoal,
    createProgressGoal,
    loading,
    error
  };
};