import { useState } from 'react';
import {
  submit,
  getLatestPostSessionReflection,
  getPostSessionHistory
} from '../lib/api/postSession';

export const usePostSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitData = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const reflection = await submit(data);
      return reflection;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit post-session reflection'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLatest = async () => {
    try {
      setLoading(true);
      setError(null);
      const reflection = await getLatestPostSessionReflection();
      return reflection;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch latest post-session reflection'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (limit?: number) => {
    try {
      setLoading(true);
      setError(null);
      const reflections = await getPostSessionHistory(limit);
      return reflections;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch post-session history'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submit: submitData,
    getLatest,
    getHistory,
    loading,
    error
  };
};
