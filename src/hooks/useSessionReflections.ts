import { useState } from 'react';
import { SessionReflection, submitSessionReflection, getSessionReflections } from '../lib/api/sessionReflections';

export const useSessionReflections = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (data: SessionReflection) => {
    try {
      setLoading(true);
      setError(null);
      const reflection = await submitSessionReflection(data);
      return reflection;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit session reflection'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      const reflections = await getSessionReflections(limit);
      return reflections;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch session reflections'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    getHistory,
    loading,
    error
  };
};